//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';


contract LpTestToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 amountToMint
    ) public ERC20(name, symbol) {
        _mint(msg.sender, amountToMint);
    }
}