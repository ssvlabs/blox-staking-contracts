usePlugin('@nomiclabs/buidler-ethers');
usePlugin('@openzeppelin/buidler-upgrades');

module.exports = {
    defaultNetwork: "localhost",
    networks: {
        development: {
            url: "http://127.0.0.1:8545"
        }
    },
    solc: {
        version: "0.6.8"
    }
};
