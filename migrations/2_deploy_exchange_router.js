const Web3 = require('web3');
const global = require('./global');
var exchange = artifacts.require("ExchangeRouter");

module.exports = function(deployer, network, accounts) {
    // networkDeployer returns a map of addresses for CDT and exchange router
    var networkDeployer;
    if (network == "development") {
        networkDeployer = deployDev;
    } else {
        networkDeployer = deployMainnet;
    }

    return networkDeployer(deployer, network, accounts)
        .then(addresses => {
            global.cdtDeployed = addresses["cdt"];
            return deployer.deploy(exchange, global.cdtDeployed, addresses["uniswapRouter"]);
        })
        .then(function (instance) {
            global.exchangeDeployed = instance;
        });
};

function deployMainnet(deployer, network, accounts) {
    return Promise.resolve({
        "cdt": "0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af",
        "uniswapRouter": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    });
}

var cdt = artifacts.require("CDTToken")
var UniswapV2Router = artifacts.require("UniswapV2Router02");
function deployDev(deployer, network, accounts) {
    var ret = {};
    var cdtInstance, uniswapRouterInstance;

    const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
    const initialCDTDepositAmount =  Web3.utils.toBN(10000).mul(decimals); // 10K
    const initialETHDepositAmount = Web3.utils.toBN(10).mul(decimals); // 10 ETH sets the price to 0.001
    const from = accounts[0];


    return deployer
        .deploy(cdt)
        .then(instance => {
            ret["cdt"] = instance.address;
            cdtInstance = instance;
            return deployer.deploy(UniswapV2Router, instance.address);
        })
        .then(instance => {
            ret["uniswapRouter"] = instance.address;
            uniswapRouterInstance = instance;

            return cdtInstance.approve(uniswapRouterInstance.address, initialCDTDepositAmount); // approve exchange 10K CDT
        })
        .then(res => {
            return uniswapRouterInstance.depositCDT(from, initialCDTDepositAmount); // transfer to exchange CDT
        })
        .then(res => {
            return uniswapRouterInstance.depositETH({value: initialETHDepositAmount}); // transfer to exchange ETH
        })
        .then(function (res) { // get cdt reserve
            return Promise.all([
                uniswapRouterInstance.cdtReserve(),
                uniswapRouterInstance.ethReserve()
            ])
        })
        .then(function (res) {
            console.log("Uniswap CDT reserve: " + res[0].div(decimals).toNumber())
            console.log("Uniswap ETH reserve: " + res[1].div(decimals).toNumber())

            return ret;
        })
}