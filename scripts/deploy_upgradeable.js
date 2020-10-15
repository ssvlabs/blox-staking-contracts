// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("@nomiclabs/buidler");

async function main() {
    const BloxStaking = await ethers.getContractFactory("BloxStaking");
    console.log("Deploying BloxStaking smart contract...");
    const bloxStaking = await upgrades.deployProxy(BloxStaking, [
        "0x749429b8bfB81F396901Bf9B65C85f16587EFC56",
        "0xB4Fc13cF17bB54119c9c440699A812f386Ae3adD",
        "0x67499310F685Bb112AB436A8E783D15abFEA03c2",
    ], { initializer: 'initialize' });
    await bloxStaking.deployed();
    console.log("BloxStaking deployed to:", bloxStaking.address);
}

main();