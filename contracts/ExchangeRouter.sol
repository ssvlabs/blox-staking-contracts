// SPDX-License-Identifier: GNU
// contracts/TestExchangeFactory.sol
pragma solidity ^0.6.2;

import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

// a router that can integrate many exchanges under a unified API
contract ExchangeRouter {
    address public uniswap_router;
    address public cdt;

    struct Exchange {
        uint id;
        function (uint256) returns(uint256) f;
    }
    mapping(string => Exchange) supported_exchanges;

    constructor(address _cdt, address _uniswap_router)
    public
    {
        uniswap_router = _uniswap_router;
        cdt = _cdt;

        supported_exchanges["uniswap"] = Exchange(1,exchangeCDTUniswap);
    }

    modifier supportedExchange(string memory exchange) {
        require(supported_exchanges[exchange].id != 0, "exchange not supported");
        _;
    }

    function exchangeCDT(string calldata exchange_name, uint256 eth_amount)
        external
        payable
        supportedExchange(exchange_name)
        returns(uint256 cdt_bought) {
        Exchange memory exchange = supported_exchanges[exchange_name];
        return exchange.f(eth_amount);
    }

    function exchangeCDTUniswap(uint256 eth_amount) internal returns(uint256 cdt_bought) {
        require(msg.value >= eth_amount, "insufficient funds");

        address weth = IUniswapV2Router02(uniswap_router).WETH();

        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = cdt;

        uint[] memory amounts = IUniswapV2Router02(uniswap_router).swapExactETHForTokens{value:eth_amount}(1, path, address(msg.sender), now + 15);
        return amounts[1];
    }
}