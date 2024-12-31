// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LoanCalculator {
    function calculatePeriodicInterest(
        uint256 amount,
        uint256 rate,
        uint256 timeElapsed
    ) internal pure returns (uint256) {
        return (amount * rate * timeElapsed) / (365 days * 100);
    }

    function calculateTotalOwed(
        uint256 principal,
        uint256 accruedInterest
    ) internal pure returns (uint256) {
        return principal + accruedInterest;
    }
}
