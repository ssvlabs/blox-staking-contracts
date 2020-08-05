const Web3 = require('web3');

const _decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
const _maxEffectiveBalance = Web3.utils.toBN(32).div(Web3.utils.toBN(100)).mul(_decimals); // to spare testing tokens, we use 1/100 of the actual deposit value

module.exports = {
    "decimals": _decimals,
    "maxEffectiveBalance": _maxEffectiveBalance,
}