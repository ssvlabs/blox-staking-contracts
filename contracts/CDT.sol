// contracts/CDT.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract CDT is ERC20 {
    constructor (string memory name, string memory symbol) ERC20(name, symbol) public {

    }
}