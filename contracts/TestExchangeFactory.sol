// contracts/TestExchangeFactory.sol
pragma solidity ^0.6.2;

import './CDT.sol';

// a simple fixed price exchange to be able to buy CDT
contract TestExchangeFactory {
    address  public cdt;

    uint256 private reserveCDT;
    uint256 private reserveETH;

    constructor(address _cdt)
    public
    {
        cdt = _cdt;
    }

    function depositCDT(address from, uint amount) external {
        bool success = CDTToken(cdt).transferFrom(from, address(this), amount);
        require(success);

        reserveCDT += amount;
    }

    function depositETH() payable external {
        reserveETH += msg.value;
    }

    function cdtReserve() public view returns(uint256) {
        return reserveCDT;
    }

    function ethReserve() public view returns(uint256) {
        return reserveETH;
    }
}