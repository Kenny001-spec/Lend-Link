// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "./interfaces/ILoanManager.sol";
import "./libraries/CollateralUtils.sol";
import "./libraries/CollateralRegistry.sol";
import "./libraries/LoanCalculator.sol";
import "./storage/LoanStorage.sol";

contract LoanManager is ILoanManager, LoanStorage, ReentrancyGuard, Pausable {
    using CollateralUtils for uint256;

    IERC20 public linkToken; // $LINK as the loan currency
    AggregatorV3Interface public priceFeed; // ETH price feed
    address public owner;

    uint256 public collateralizationRatio = 150; // 150%
    uint256 public liquidationThreshold = 110; // 110%
    uint256 public loanCounter;
    uint256 public minLoanAmount;
    uint256 public maxLoanAmount;

    constructor(
        IERC20 _linkToken,
        AggregatorV3Interface _priceFeed
    ) {
        linkToken = _linkToken;
        priceFeed = _priceFeed;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function requestLoan(
    uint256 amount,
    uint256 maxInterestRate,
    uint256 duration,
    address[] calldata acceptedCollaterals
    ) external payable override whenNotPaused nonReentrant {
    require(amount >= minLoanAmount && amount <= maxLoanAmount, "Invalid loan amount");

    uint256 requiredCollateral = (amount * collateralizationRatio) / 100;
    uint256 ethPrice = getETHPrice();
    uint256 ethValue = msg.value.calculateCollateralValue(ethPrice, priceFeed.decimals());

    require(ethValue >= requiredCollateral, "Insufficient collateral");

    loanCounter++;

    LoanRequest storage request = loanRequests[loanCounter];
    request.amount = amount;
    request.maxInterestRate = maxInterestRate;
    request.duration = duration;
    request.acceptedCollaterals = acceptedCollaterals;
    request.matched = false;

    loansCore[loanCounter] = LoanCore({
        borrower: msg.sender,
        lender: address(0),
        amount: amount,
        collateral: msg.value,
        interestRate: 0,
        rateType: InterestRateType.FIXED,
        duration: duration
    });

    borrowerLoans[msg.sender].push(loanCounter);
    tryAutomaticMatch(loanCounter);

    emit LoanRequested(loanCounter, msg.sender, amount, msg.value);
}


    function fundLoan(uint256 loanId) external whenNotPaused nonReentrant {
        LoanCore storage loan = loansCore[loanId];
        LoanStatus storage status = loansStatus[loanId];

        require(!status.active, "Loan already active");
        require(loan.lender == address(0), "Loan already funded");

        require(
            linkToken.transferFrom(msg.sender, address(this), loan.amount),
            "Transfer failed"
        );

        loan.lender = msg.sender;
        status.startTime = block.timestamp;
        status.active = true;

        lenderLoans[msg.sender].push(loanId);
        AllLoansID.push(loanId);

        emit LoanFunded(loanId, msg.sender);
    }

    function makePartialRepayment(uint256 loanId, uint256 amount) external override whenNotPaused nonReentrant {
        LoanCore storage loan = loansCore[loanId];
        LoanStatus storage status = loansStatus[loanId];

        require(status.active, "Loan not active");
        require(msg.sender == loan.borrower, "Not borrower");

        require(
            linkToken.transferFrom(msg.sender, loan.lender, amount),
            "Partial repayment failed"
        );

        status.repaidAmount += amount;
        emit PartialRepayment(loanId, msg.sender, amount);
    }



    function accrueInterest(uint256 loanId) external  whenNotPaused nonReentrant {
    LoanCore storage loan = loansCore[loanId];
    LoanInterest storage interest = loansInterest[loanId];
    LoanStatus storage status = loansStatus[loanId];

    require(status.active, "Loan not active");
    
    uint256 timeElapsed = block.timestamp - interest.lastInterestAccrualTimestamp;
    uint256 accrued = LoanCalculator.calculatePeriodicInterest(
        loan.amount,
        loan.interestRate,
        timeElapsed
    );
   

    interest.accruedInterest += accrued;
    interest.lastInterestAccrualTimestamp = block.timestamp;

    emit InterestAccrued(loanId, accrued);
}

    function repayLoan(uint256 loanId) external whenNotPaused nonReentrant {
        LoanCore storage loan = loansCore[loanId];
        LoanStatus storage status = loansStatus[loanId];
        LoanInterest storage interest = loansInterest[loanId];

        require(status.active, "Loan not active");
        require(msg.sender == loan.borrower, "Not borrower");

        uint256 totalInterest = LoanCalculator.calculatePeriodicInterest(
            loan.amount,
            loan.interestRate,
            block.timestamp - status.startTime
        );
        uint256 totalRepayment = loan.amount + totalInterest - status.repaidAmount;

        require(
            linkToken.transferFrom(msg.sender, loan.lender, totalRepayment),
            "Transfer failed"
        );

        status.repaid = true;
        status.active = false;
        interest.accruedInterest = totalInterest;
        returnCollateral(loanId);

        emit LoanRepaid(loanId, msg.sender, totalRepayment);
    }

    function returnCollateral(uint256 loanId) internal {
        LoanCore storage loan = loansCore[loanId];
        uint256 amount = loan.collateral;

        if (amount > 0) {
            loan.collateral = 0;
            (bool sent, ) = payable(loan.borrower).call{value: amount}("");
            require(sent, "Collateral transfer failed");
        }
    }

    function getETHPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    function tryAutomaticMatch(uint256 loanId) internal {
        LoanRequest storage request = loanRequests[loanId];
        address bestLender;
        uint256 bestRate = type(uint256).max;

        for (uint i = 0; i < AllLoansID.length; i++) {
            address lender = address(uint160(AllLoansID[i]));
            if (lenderAvailableFunds[lender] >= request.amount) {
                uint256 offeredRate = getLenderOfferedRate(lender, request.amount);
                if (offeredRate <= request.maxInterestRate && offeredRate < bestRate) {
                    bestLender = lender;
                    bestRate = offeredRate;
                }
            }
        }

        if (bestLender != address(0)) {
            createMatchedLoan(loanId, bestLender, bestRate);
        }
    }

   function getLenderOfferedRate(address lender, uint256 amount) internal view returns (uint256) {
    // Fetch lender's available funds
    uint256 availableFunds = lenderAvailableFunds[lender];

    // Ensure the lender has enough funds to cover the requested amount
    require(availableFunds >= amount, "Insufficient lender funds");

    // Calculate the utilization rate (percentage of available funds requested)
    uint256 utilizationRate = (amount * 100) / availableFunds;

    // Define the base rate (e.g., 5%)
    uint256 baseRate = 5;

    // Calculate a risk premium based on utilization rate
    uint256 premium = utilizationRate > 50 ? (utilizationRate - 50) / 2 : 0;

    // Compute the total interest rate
    return baseRate + premium;
}

    function createMatchedLoan(uint256 loanId, address lender, uint256 rate) internal {
        LoanCore storage loan = loansCore[loanId];
        loan.lender = lender;
        loan.interestRate = rate;
        loanRequests[loanId].matched = true;

        emit AutomaticMatch(loanId, lender, loan.borrower);
    }

    function updateCollateralizationRatio(uint256 newRatio) external onlyOwner {
        require(newRatio >= 100, "Ratio too low");
        collateralizationRatio = newRatio;
    }

    function updateLiquidationThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold >= 100, "Threshold too low");
        liquidationThreshold = newThreshold;
    }
}
