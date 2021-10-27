//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Token {
    string public name = "Nader Dabit Token";
    string public symbol = "NDT";
    uint256 public totalSupply = 1000000;
    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
