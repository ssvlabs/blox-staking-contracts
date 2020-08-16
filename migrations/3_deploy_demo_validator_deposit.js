const global = require('./global');
var depositContract = artifacts.require("DepositContract");

module.exports = function(deployer, network, accounts) {
    deployer
        .then(function (instance) {
            return deployer.deploy(depositContract);
        })
        .then(function (instance) {
            global.depositContract = instance;
        })
}