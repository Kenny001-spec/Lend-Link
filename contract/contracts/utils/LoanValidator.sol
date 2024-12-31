// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../storage/LoanStorage.sol";

library LoanValidator {
    function validateLoanRequest(
        uint256 amount,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 duration
    ) internal pure returns (bool) {
        return amount >= minAmount && 
               amount <= maxAmount && 
               duration > 0;
    }

    function validateCollateral(
        LoanStorage.LoanCore storage loan,
        uint256 requiredAmount
    ) internal view returns (bool) {
        return loan.collateral >= requiredAmount;
    }
}