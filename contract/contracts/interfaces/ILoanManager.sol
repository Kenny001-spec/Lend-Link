// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILoanManager {
    enum InterestRateType { FIXED, VARIABLE }

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 collateral);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event PartialRepayment(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event InterestAccrued(uint256 indexed loanId, uint256 amount);
    event CollateralAdded(address indexed token, uint256 maxLTV);
    event AutomaticMatch(uint256 indexed loanId, address indexed lender, address indexed borrower);
    event LoanLiquidated(uint256 indexed loanId, address indexed liquidator);

    function requestLoan(
        uint256 amount,
        uint256 maxInterestRate,
        uint256 duration,
        address[] calldata acceptedCollaterals
    ) external payable;

    function makePartialRepayment(uint256 loanId, uint256 amount) external;
    function accrueInterest(uint256 loanId) external;
}