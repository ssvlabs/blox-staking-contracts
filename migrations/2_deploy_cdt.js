var cdt = artifacts.require("CDT");

module.exports = function(deployer) {
    // deployment steps
    deployer.deploy(cdt, "CDT", "CDT");
};