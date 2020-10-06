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
npm install -g truffle-flattener
npm install -g remixd
```

Download [Genache](https://github.com/trufflesuite/ganache/releases) latests UI

## Compile

First, clone the repo via git and install dependencies:

```bash
git clone https://github.com/bloxapp/blox-staking-contracts
cd blox-staking-contracts
npm install
truffle compile
```

## Local test network

See [Genache quickstart](https://www.trufflesuite.com/docs/ganache/quickstart) for more info

#### 1. Unfura account

1. Create an [infura account](https://infura.io/)
2. Create a new [Ethereum project](https://infura.io/dashboard/ethereum) with API keys for the Mainnet.
3. Go to settings page and copy `wss` endpoint in `KEYS` section.

#### 2. Genache UI
1. Download and run [Genache UI](https://www.trufflesuite.com/ganache)
2. Once the app is running, there will be two options in the fist screen: `QUICKSTART` and `NEW WORKSPACE`. Chose the new workspace one.
3. Go to **`Server`** tab, and enable **`Chain forking`**. After that there will be two more inputs related to fork.
4. Paste infura URL copied in p.3 above into **`ENTER CUSTOM URL`** input.
5. Go to [https://etherscan.io/blocks](https://etherscan.io/blocks), copy the latest block number, and paste that into **`BLOCK NUMBER`** input.

* Not supported for node@14

## Debug contract
We can debug our contracts using remix + remixd.
Instructions from: https://medium.com/authereum/debugging-solidity-with-a-gui-remix-and-ganache-c6c16488fcfd

(we can use Genache UI instead of the CLI)

We should use the truffle deployment and then copy paste the addresses to Remix

## Deployment (currently on local testnet)

```bash
truffle migrate development
```

## Interacting with the contract (cli)

```bash
truffle console
truffle(development)> let instance = await BloxStaking.deployed()
truffle(development)> instance.getTotalStaked(()
BN { negative: 0, words: [ 0, <1 empty item> ], length: 1, red: null }

```

## License

GPL © [Blox Live](https://github.com/bloxapp/blox-live)

<hr />
<br />