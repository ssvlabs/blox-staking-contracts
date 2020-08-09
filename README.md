[<img src="internals/img/Blox-Staking-Banner.png" >](https://www.bloxstaking.com/)

<br>
<br>

<div align="center">

[![Discord](https://discord.com/api/guilds/723834989506068561/widget.png?style=shield)](https://discord.gg/HpT2z5B)

</div>

## Dependencies
```bash
brew install node@12
npm install -g solc 
npm install -g truffle 
```

Download [Genache](https://github.com/trufflesuite/ganache/releases) latests UI

## Compile
First, clone the repo via git and install dependencies:

```bash
git clone https://github.com/bloxapp/blox-staking-contracts
cd blox-staking-contracts
truffle compile
```
## Local test network
See [Genache quickstart](https://www.trufflesuite.com/docs/ganache/quickstart) for more info
```bash
npx ganache-cli --deterministic
```
* Not supported for node@14

## Deployment (currently on local testnet)


```bash
truffle migrate development

```

## interacting with the contract (cli)


```bash
truffle console
truffle(development)> let instance = await BloxStaking.deployed()
truffle(development)> instance.getCount()
BN { negative: 0, words: [ 0, <1 empty item> ], length: 1, red: null }


```

## License

GPL © [Blox Live](https://github.com/bloxapp/blox-live)

<hr />
<br />