// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.12;

import '@pancakeswap/pancake-swap-lib/contracts/token/BEP20/BEP20.sol';

contract PoolToken is BEP20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 amountToMint
    ) public BEP20(name, symbol) {
        _mint(msg.sender, amountToMint);
    }
}