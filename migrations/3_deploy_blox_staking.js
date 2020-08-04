var bloxStaking = artifacts.require("BloxStaking");
var cdt = artifacts.require("CDT");

module.exports = function(deployer) {
    // deployment steps
    deployer.deploy(bloxStaking, cdt.address);
};