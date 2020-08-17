// SPDX-License-Identifier: GNU
// contracts/TestExchangeFactory.sol
pragma solidity ^0.6.2;

import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

// this is a DEV only contract that simulates IUniswapV2Router02 for testing.
// Not all methods are implemented, just what BloxStaking needs.
contract UniswapV2Router02 is IUniswapV2Router02 {
    address  public cdt;
    address public immutable override WETH;

    uint256 private reserveCDT;
    uint256 private reserveETH;

    // https://medium.com/block-journal/uniswap-understanding-the-decentralised-ethereum-exchange-5ee5d7878996
    uint256 private k_constant;

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');
        _;
    }

    constructor(address _cdt, address _weth) public {
        cdt = _cdt;
        WETH = _weth;
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
        require(path[0] == this.WETH(), 'UniswapV2Router: INVALID_PATH');

        uint256 fac = 1000;
        uint256 new_input_token_reserve = this.ethReserve() + msg.value;
        uint256 new_output_token_reserve = (k_constant * fac)/ new_input_token_reserve;
        uint256 output_amount = (this.cdtReserve() * fac - new_output_token_reserve) / fac;

        require(amountOutMin <= output_amount, 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');

        require(ERC20(path[1] /* suppose to be CDT */).transfer(to, output_amount), 'UniswapV2: TRANSFER_FAILED');

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
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint
    ) external override returns (uint amountETH) {return 0;}
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint ,
        bool , uint8 , bytes32 , bytes32
    ) external override returns (uint amountETH){return 0;}

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint ,
        uint ,
        address[] calldata ,
        address ,
        uint
    ) override external {}
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint ,
        address[] calldata ,
        address ,
        uint
    ) override external payable {}
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint ,
        uint ,
        address[] calldata ,
        address ,
        uint
    ) override  external {}
    function factory() override external pure returns (address) { return address(0);}

    function addLiquidity(
        address ,
        address ,
        uint ,
        uint ,
        uint ,
        uint ,
        address ,
        uint
    ) override external returns (uint amountA, uint amountB, uint liquidity) {return (0,0,0);}
    function addLiquidityETH(
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint
    ) override external payable returns (uint amountToken, uint amountETH, uint liquidity) {return (0,0,0);}
    function removeLiquidity(
        address ,
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint
    ) override external returns (uint amountA, uint amountB) {return (0,0);}
    function removeLiquidityETH(
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint
    ) override external returns (uint amountToken, uint amountETH) {return (0,0);}
    function removeLiquidityWithPermit(
        address ,
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint ,
        bool , uint8 , bytes32 , bytes32
    ) override external returns (uint amountA, uint amountB) {return (0,0);}
    function removeLiquidityETHWithPermit(
        address ,
        uint ,
        uint ,
        uint ,
        address ,
        uint ,
        bool , uint8 , bytes32 , bytes32
    ) override external returns (uint amountToken, uint amountETH) {return (0,0);}
    function swapExactTokensForTokens(
        uint ,
        uint ,
        address[] calldata ,
        address ,
        uint
    ) override external returns (uint[] memory amounts) {}
    function swapTokensForExactTokens(
        uint ,
        uint ,
        address[] calldata ,
        address ,
        uint
    ) override external returns (uint[] memory amounts) {}
    function swapTokensForExactETH(uint , uint , address[] calldata , address to, uint )
    override
    external
    returns (uint[] memory amounts){}
    function swapExactTokensForETH(uint , uint , address[] calldata , address , uint )
    override
    external
    returns (uint[] memory amounts){}
    function swapETHForExactTokens(uint , address[] calldata , address , uint )
    override
    external
    payable
    returns (uint[] memory ){}

    function quote(uint , uint , uint ) override external pure returns (uint amountB) {return 0;}
    function getAmountOut(uint , uint , uint ) override external pure returns (uint amountOut)  {return 0;}
    function getAmountIn(uint , uint , uint ) override external pure returns (uint amountIn)  {return 0;}
    function getAmountsOut(uint , address[] calldata ) override external view returns (uint[] memory amounts)  {}
    function getAmountsIn(uint , address[] calldata ) override external view returns (uint[] memory amounts) {}

}