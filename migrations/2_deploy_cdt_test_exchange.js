const Web3 = require('web3');
const global = require('./global');
var cdt = artifacts.require("CDTToken");
var exchange = artifacts.require("TestExchangeFactory");

module.exports = function(deployer, network, accounts) {
    // deployment steps
    const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
    const initialCDTDepositAmount =  Web3.utils.toBN(10000).mul(decimals); // 10K
    const initialETHDepositAmount = Web3.utils.toBN(10).mul(decimals); // 10 ETH sets the price to 0.001
    const from = accounts[0];
    deployer
        .then(function (instance) { // deploy CDT
            return deployer.deploy(cdt)
        })
        .then(function (instance) { // deploy exchange
            global.cdtDepoloyed = instance;
            return exchange.new(global.cdtDepoloyed.address)
        })
        .then(function (instance) { // approve exchange 100M CDT
            global.exchangeDeployed = instance;
            return global.cdtDepoloyed.approve(global.exchangeDeployed.address, initialCDTDepositAmount);
        })
        .then(function (res) { // transfer to exchange CDT
            return global.exchangeDeployed.depositCDT(from, initialCDTDepositAmount);
        })
        .then(function (res) { // transfer to exchange ETH
            return global.exchangeDeployed.depositETH({value: initialETHDepositAmount});
        })
        .then(function (res) { // get cdt reserve
            return global.exchangeDeployed.cdtReserve();
        })
        .then(function (res) {
            console.log("CDT reserve: " + res.div(decimals).toNumber())
        })
        .then(function (res) { // get eth reserve
            return global.exchangeDeployed.ethReserve();
        })
        .then(function (res) {
            console.log("ETH reserve: " + res.div(decimals).toNumber())
        })
};