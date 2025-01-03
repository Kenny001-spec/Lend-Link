// File: contracts/storage/LoanStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ILoanManager.sol";
import "../libraries/CollateralRegistry.sol";

contract LoanStorage {
    struct LoanCore {
        address borrower;
        address lender;
        uint256 amount;
        uint256 collateral;
        uint256 interestRate;
        ILoanManager.InterestRateType rateType;
        uint256 duration;
    }

    struct LoanStatus {
        uint256 startTime;
        bool active;
        bool repaid;
        uint256 repaidAmount;
    }

    struct LoanInterest {
        uint256 lastInterestAccrualTimestamp;
        uint256 accruedInterest;
    }

 

    struct LoanRequest {
        uint256 amount;
        uint256 maxInterestRate;
        uint256 duration;
        address[] acceptedCollaterals;
        bool matched;
    }

    // Main storage mappings
    mapping(uint256 => LoanCore) public loansCore;
    mapping(uint256 => LoanStatus) public loansStatus;
    mapping(uint256 => LoanInterest) public loansInterest;

    // Changed from public to internal

    mapping(uint256 => mapping(address => uint256)) public  loansCollateral;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(address => uint256) public lenderAvailableFunds;
    mapping(address => CollateralRegistry.CollateralInfo) public supportedCollaterals;

    // Helper functions for accessing CollateralTracker data

    function getCollateralAmount(uint256 loanId, address token) external   view returns (uint256) {
        return loansCollateral[loanId][token];
    }

    function setCollateralAmount(uint256 loanId, address token, uint256 amount) internal {
        loansCollateral[loanId][token] = amount;
    }

}