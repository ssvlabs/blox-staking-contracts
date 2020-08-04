// contracts/BloxStaking.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract BloxStaking {
    ERC20 public cdt;
    uint counter;

    constructor(ERC20 _cdt) public {
        cdt = _cdt;
        counter = 0;
    }

    function increment() public {
        counter += 1;
    }

    function getCount() public view returns (uint) {
        return counter;
    }
}