const global = require('./global');
var bloxStaking = artifacts.require("BloxStaking");

module.exports = function(deployer) {
    return deployer.deploy(
        bloxStaking,
        global.cdtDeployed,
        global.exchangeDeployed.address,
        global.depositContract.address
    );
};