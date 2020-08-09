// SPDX-License-Identifier: GNU
// contracts/TestExchangeFactory.sol
pragma solidity ^0.6.2;

import './CDT.sol';

// a simple fixed price exchange to be able to buy CDT
contract TestExchangeFactory {
    address  public cdt;

    uint256 private reserveCDT;
    uint256 private reserveETH;

    // https://medium.com/block-journal/uniswap-understanding-the-decentralised-ethereum-exchange-5ee5d7878996
    uint256 private k_constant;

    constructor(address _cdt)
    public
    {
        cdt = _cdt;
        k_constant = 10000*10**18 * 10*10**18;
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

    function exchangeCDT(uint256 eth_amount) external payable returns(uint256 cdt_bought) {
        require(msg.value > 0, "eth value can't be 0");

        uint256 fac = 1000;
        uint256 new_input_token_reserve = this.ethReserve() + eth_amount;
        uint256 new_output_token_reserve = (k_constant * fac)/ new_input_token_reserve;
        uint256 output_amount = this.cdtReserve() * fac - new_output_token_reserve;

        return output_amount / fac;
    }
}