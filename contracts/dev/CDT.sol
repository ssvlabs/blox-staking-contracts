// SPDX-License-Identifier: GNU
// contracts/CDTToken.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/access/Ownable.sol';

contract CDTToken is Ownable, ERC20 {
    using SafeMath for uint256;

    uint256 internal cap = 1000000000; // 1B

    constructor()
    public
    ERC20('CDT', 'CDT')
    Ownable() {
        _mint(msg.sender, cap.mul(10 ** 18));
    }
}