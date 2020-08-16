// SPDX-License-Identifier: GNU
// contracts/TestExchangeFactory.sol
pragma solidity ^0.6.2;

import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

// this is a DEV only contract that simulates IUniswapV2Router02 for testing.
// Not all methods are implemented, just what BloxStaking needs.
contract UniswapV2Router02 is IUniswapV2Router02 {
    address  public cdt;

    uint256 private reserveCDT;
    uint256 private reserveETH;

    // https://medium.com/block-journal/uniswap-understanding-the-decentralised-ethereum-exchange-5ee5d7878996
    uint256 private k_constant;

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');
        _;
    }

    constructor(address _cdt) public {
        cdt = _cdt;
        k_constant = 10000*10**18 * 10*10**18;
    }

    function depositCDT(address from, uint amount) external {
        bool success = ERC20(cdt).transferFrom(from, address(this), amount);
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

    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    virtual
    override
    payable
    ensure(deadline)
    returns (uint[] memory amounts)
    {
        require(msg.value > 0, "eth value can't be 0");

        uint256 fac = 1000;
        uint256 new_input_token_reserve = this.ethReserve() + msg.value;
        uint256 new_output_token_reserve = (k_constant * fac)/ new_input_token_reserve;
        uint256 output_amount = (this.cdtReserve() * fac - new_output_token_reserve) / fac;

        require(ERC20(cdt).transfer(to, output_amount), "failed to transfer");

        uint[] memory ret = new uint[](2);
        ret[0] = msg.value;
        ret[1] = output_amount;
        return ret;
    }


    ///////////////////////
    //
    //  Not implemented
    //
    ///////////////////////
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external override returns (uint amountETH) {return 0;}
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external override returns (uint amountETH){return 0;}

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) override external {}
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) override external payable {}
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) override  external {}
    function factory() override external pure returns (address) { return address(0);}
    function WETH() override external pure returns (address){ return address(0);}

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) override external returns (uint amountA, uint amountB, uint liquidity) {return (0,0,0);}
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) override external payable returns (uint amountToken, uint amountETH, uint liquidity) {return (0,0,0);}
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) override external returns (uint amountA, uint amountB) {return (0,0);}
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) override external returns (uint amountToken, uint amountETH) {return (0,0);}
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) override external returns (uint amountA, uint amountB) {return (0,0);}
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) override external returns (uint amountToken, uint amountETH) {return (0,0);}
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) override external returns (uint[] memory amounts) {}
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) override external returns (uint[] memory amounts) {}
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
    override
    external
    returns (uint[] memory amounts){}
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    override
    external
    returns (uint[] memory amounts){}
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
    override
    external
    payable
    returns (uint[] memory amounts){}

    function quote(uint amountA, uint reserveA, uint reserveB) override external pure returns (uint amountB) {return 0;}
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) override external pure returns (uint amountOut)  {return 0;}
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) override external pure returns (uint amountIn)  {return 0;}
    function getAmountsOut(uint amountIn, address[] calldata path) override external view returns (uint[] memory amounts)  {}
    function getAmountsIn(uint amountOut, address[] calldata path) override external view returns (uint[] memory amounts) {}

}