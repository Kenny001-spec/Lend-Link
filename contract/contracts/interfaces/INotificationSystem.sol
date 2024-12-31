// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INotificationSystem {
    function notifyUser(address user, string memory message) external;
}