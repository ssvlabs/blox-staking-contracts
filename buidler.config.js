usePlugin('@nomiclabs/buidler-ethers');
usePlugin('@openzeppelin/buidler-upgrades');

module.exports = {
    defaultNetwork: "localhost",
    networks: {
        development: {
            url: "http://127.0.0.1:8545"
        },
        goerli: {
            url: "https://goerli.infura.io/v3/3fc48ed4dc844a049c3286c3dbe074fe",
            accounts: [] // Here should be a private key of a wallet
        }
    },
    solc: {
        version: "0.6.8"
    }
};
