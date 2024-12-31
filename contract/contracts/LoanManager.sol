// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AggregatorV3Interface}  from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "./interfaces/ILoanManager.sol";
import "./interfaces/INotificationSystem.sol";
import "./libraries/CollateralUtils.sol";
import "./libraries/CollateralRegistry.sol";
import "./libraries/LoanCalculator.sol";
import "./storage/LoanStorage.sol";




contract LoanManager is ILoanManager, LoanStorage, ReentrancyGuard, Pausable {
    using CollateralUtils for uint256;
    
    IERC20 public stablecoin;
    AggregatorV3Interface public priceFeed;
    INotificationSystem public notificationSystem;
    address public owner;

    uint256 public collateralizationRatio = 150;
    uint256 public liquidationThreshold = 110;
    uint256 public loanCounter;
    uint256 public minLoanAmount;
    uint256 public maxLoanAmount;

    constructor(
        IERC20 _stablecoin,
        AggregatorV3Interface _priceFeed,
        address _notificationSystem
    ) {
        stablecoin = _stablecoin;
        priceFeed = _priceFeed;
        notificationSystem = INotificationSystem(_notificationSystem);
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
        
        loanCounter++;
        
        LoanRequest storage request = loanRequests[loanCounter];
        request.amount = amount;
        request.maxInterestRate = maxInterestRate;
        request.duration = duration;
        request.acceptedCollaterals = acceptedCollaterals;
        request.matched = false;

        // Store core loan data
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
        notificationSystem.notifyUser(msg.sender, "Loan request created");
        
        emit LoanRequested(loanCounter, msg.sender, amount, msg.value);
    }

    function fundLoan(uint256 loanId) external whenNotPaused nonReentrant {
        LoanCore storage loan = loansCore[loanId];
        LoanStatus storage status = loansStatus[loanId];
        
        require(!status.active, "Loan already active");
        require(loan.lender == address(0), "Loan already funded");
        
        require(stablecoin.transferFrom(msg.sender, loan.borrower, loan.amount), "Transfer failed");

        loan.lender = msg.sender;
        status.startTime = block.timestamp;
        status.active = true;

        lenderLoans[msg.sender].push(loanId);
        
        emit LoanFunded(loanId, msg.sender);
    }


    function returnCollateral(uint256 loanId) internal  {
        LoanCore storage loan = loansCore[loanId];
        for (uint i = 0; i < loan.acceptedCollaterals.length; i++) {
            address token = loan.acceptedCollaterals[i];
            uint256 amount = getCollateralAmount(loanId, token);

            if (amount > 0) {
                setCollateralAmount(loanId, token, 0);
                if (token == address(0)) {
                    (bool sent, ) = payable(loan.borrower).call{value: amount}("");
                } else {
                    IERC20(token).transfer(loan.borrower, amount);
                }
            }
        }
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
        uint256 totalRepayment = loan.amount + totalInterest;

        require(stablecoin.transferFrom(msg.sender, loan.lender, totalRepayment), "Transfer failed");

        status.repaid = true;
        status.active = false;
        interest.accruedInterest = totalInterest;

        // Return collateral using helper
        returnCollateral(loanId);
        
        emit LoanRepaid(loanId, msg.sender, totalRepayment);
    }

    function liquidateLoan(uint256 loanId) external whenNotPaused nonReentrant {
        LoanCore storage loan = loansCore[loanId];
        LoanStatus storage status = loansStatus[loanId];
        
        require(status.active, "Loan not active");
        
        uint256 collateralValue = getCollateralValue(loan.collateral);
        uint256 requiredCollateral = (loan.amount * liquidationThreshold) / 100;

        require(collateralValue < requiredCollateral, "Collateral sufficient");

        status.active = false;
        payable(loan.lender).transfer(loan.collateral);

        emit LoanLiquidated(loanId, msg.sender);
    }

    function getCollateralValue(uint256 collateral) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return collateral.calculateCollateralValue(uint256(price), priceFeed.decimals());
    }

    function tryAutomaticMatch(uint256 loanId) internal {
        LoanRequest storage request = loanRequests[loanId];
        address bestLender;
        uint256 bestRate = type(uint256).max;
        
        for (uint i = 0; i < lenderLoans.length; i++) {
            address lender = address(uint160(lenderLoans[i]));
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
        // Simplified rate calculation
        return 5; // 5% fixed rate for example
    }

    function createMatchedLoan(uint256 loanId, address lender, uint256 rate) internal {
        LoanCore storage loan = loansCore[loanId];
        loan.lender = lender;
        loan.interestRate = rate;
        loanRequests[loanId].matched = true;
        
        emit AutomaticMatch(loanId, lender, loan.borrower);
    }

  
   

    // Admin functions
    function updateCollateralizationRatio(uint256 newRatio) external onlyOwner {
        require(newRatio >= 100, "Ratio too low");
        collateralizationRatio = newRatio;
    }

    function updateLiquidationThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold >= 100, "Threshold too low");
        liquidationThreshold = newThreshold;
    }
}



