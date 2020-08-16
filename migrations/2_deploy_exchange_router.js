const Web3 = require('web3');
const global = require('./global');
var exchange = artifacts.require("ExchangeRouter");

module.exports = function(deployer, network, accounts) {
    // networkDeployer returns a map of addresses for CDT and exchange router
    // var networkDeployer;
    // if (network == "development") {
    //     networkDeployer = deployDev;
    // } else {
        networkDeployer = deployMainnet;
    // }

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

// var ERC20 = artifacts.require("openzeppelin-solidity/ERC20")
// var UniswapV2Factory = artifacts.require("UniswapV2Factory_Dev");
// // var UniswapV2Router = artifacts.require("@uniswap/v2-periphery/UniswapV2Router02");
// function deployDev(deployer, network, accounts) {
//     var ret = {};
//     return deployer
//         .deploy(ERC20, "cdt","cdt")
//         .then(instance => {
//             ret["cdt"] = instance.address;
//             return deployer.deploy(UniswapV2Factory, accounts[0]);
//         })
// }