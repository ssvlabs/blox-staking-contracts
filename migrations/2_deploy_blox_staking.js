var bloxStaking = artifacts.require("BloxStaking");

module.exports = function(deployer) {
    // deployment steps
    deployer.deploy(bloxStaking, "0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af");
};