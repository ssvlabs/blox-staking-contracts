// SPDX-License-Identifier: GNU
// contracts/TestExchangeFactory.sol
pragma solidity ^0.6.2;

import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

// a router that can integrate many exchanges under a unified API
contract ExchangeRouter {
    address public uniswapRouter;
    address public cdt;

    struct Exchange {
        uint id;
        function (uint256) returns(uint256) f;
    }
    mapping(string => Exchange) supportedExchanges;
    modifier supportedExchange(string memory exchange) {
        require(supportedExchanges[exchange].id != 0, "exchange not supported");
        _;
    }

    constructor(address _cdt, address _uniswapRouter)
    public
    {
        uniswapRouter = _uniswapRouter;
        cdt = _cdt;

        supportedExchanges["uniswap"] = Exchange(1,exchangeCDTUniswap);
    }

    function exchangeCDT(string calldata exchangeName, uint256 ethAmount)
        external
        payable
        supportedExchange(exchangeName)
        returns(uint256 cdtBought) {
        Exchange memory exchange = supportedExchanges[exchangeName];
        return exchange.f(ethAmount);
    }

    function exchangeCDTUniswap(uint256 ethAmount) internal returns(uint256 cdt_bought) {
        require(msg.value >= ethAmount, "insufficient funds");

        address weth = IUniswapV2Router02(uniswapRouter).WETH();

        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = cdt;

        uint[] memory amounts = IUniswapV2Router02(uniswapRouter).swapExactETHForTokens{value:ethAmount}(1, path, address(msg.sender), now + 15);
        return amounts[1];
    }
}