// contracts/CDTToken.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/access/Ownable.sol';

contract CDTToken is Ownable, ERC20 {

    uint256 CAP = 1000000000; // 1B
    uint256 TOTALSUPPLY = CAP.mul(10 ** 18);

    constructor()
    public
    ERC20('CDT', 'CDT')
    Ownable()
    {
        _mint(msg.sender, TOTALSUPPLY);
    }
}