// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("@nomiclabs/buidler");

const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

// Deploy CDT
// Deploy UniSwapRouter
// Deploy ExchangeRouter
// Deploy DepositContract

// deployCDTToken deploys CTDToken smart contract.
async function deployCDTToken() {
    const CDTToken = await ethers.getContractFactory("CDTToken");
    console.log("Deploying CDTToken smart contract...");
    const cdtToken = await upgrades.deployProxy(CDTToken, [], { initializer: 'initialize' });
    await cdtToken.deployed();
    console.log("CDTToken deployed to:", cdtToken.address);
    return cdtToken.address;
}

// deployUniSwapRouter deploys uniswap router smart contract with the given CDT address.
async function deployUniSwapRouter(cdt) {
    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    console.log("Deploying UniswapV2Router02 smart contract...");
    const uniswapV2Router02Token = await upgrades.deployProxy(UniswapV2Router02, [cdt, weth], { initializer: 'initialize' });
    await uniswapV2Router02Token.deployed();
    console.log("UniswapV2Router02 deployed to:", uniswapV2Router02Token.address);
    return uniswapV2Router02Token.address;
}

// deployExchangeRouter deploys ExchangeRouter smart contract with the given CDT and uniswap addresses.
// TODO: ExchangeRouter must be upgradable.
async function deployExchangeRouter(cdt, uniSwap) {
    return "0xB4Fc13cF17bB54119c9c440699A812f386Ae3adD";

    const ExchangeRouter = await ethers.getContractFactory("ExchangeRouter");
    console.log("Deploying ExchangeRouter smart contract...");
    const exchangeRouter = await upgrades.deployProxy(ExchangeRouter, [cdt, uniSwap], { initializer: 'initialize' });
    await exchangeRouter.deployed();
    console.log("ExchangeRouter deployed to:", exchangeRouter.address);
    return exchangeRouter.address;
}

// deployDepositContract deploys DepositContract.
async function deployDepositContract() {
    const DepositContract = await ethers.getContractFactory("DepositContract");
    console.log("Deploying DepositContract smart contract...");
    const depositContract = await upgrades.deployProxy(DepositContract, [], { initializer: 'initialize' });
    await depositContract.deployed();
    console.log("DepositContract deployed to:", depositContract.address);
    return depositContract.address;
}

// deployBloxStaking deploys BloxStaking smart contract.
async function deployBloxStaking(cdt, exchange, depositContract) {
    const BloxStaking = await ethers.getContractFactory("BloxStaking");
    console.log("Deploying BloxStaking smart contract...");
    const bloxStaking = await upgrades.deployProxy(BloxStaking, [cdt, exchange, depositContract], { initializer: 'initialize' });
    await bloxStaking.deployed();
    console.log("BloxStaking deployed to:", bloxStaking.address);
    return bloxStaking.address;
}

async function main() {
    const cdtTokenAddress = await deployCDTToken();
    const uniSwapRouterAddress = await deployUniSwapRouter(cdtTokenAddress);
    const exchangeRouterAddress = await deployExchangeRouter(cdtTokenAddress, uniSwapRouterAddress);
    const depositContractAddress = deployDepositContract();
    const bloxStakingAddress = deployBloxStaking(cdtTokenAddress, exchangeRouterAddress,depositContractAddress);

    const BloxStakingV2 = await ethers.getContractFactory("BloxStaking");
    console.log("Upgrading BloxStakingV2...");
    const bloxStakingV2 = await upgrades.upgradeProxy(bloxStakingAddress, BloxStakingV2);
    console.log("BloxStakingV2 upgraded to:", bloxStakingAddress);
}

main();
// console.warn("initial deployment script is not implemented!")