const global = require('./global');
var bloxStaking = artifacts.require("BloxStaking");

module.exports = function(deployer) {
    deployer.deploy(bloxStaking, global.cdtDepoloyed.address, global.depositContract.address);
};