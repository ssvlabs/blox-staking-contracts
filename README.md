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

#### 1. Infura account

1. Create an [infura account](https://infura.io/)
2. Create a new [Ethereum project](https://infura.io/dashboard/ethereum) with API keys for the Mainnet.
3. Go to settings page and copy `wss` endpoint in `KEYS` section.

#### 2. Genache UI
1. Download and run [Genache UI](https://www.trufflesuite.com/ganache)
2. Once the app is running, there will be two options in the fist screen: `QUICKSTART` and `NEW WORKSPACE`. Chose the new workspace one.
3. Go to **`Server`** tab, and enable **`Chain forking`**. After that there will be two more inputs related to fork.
4. Paste infura URL copied in p.3 above into **`ENTER CUSTOM URL`** input.
5. Go to [https://etherscan.io/blocks](https://etherscan.io/blocks), copy the latest block number, and paste that into **`BLOCK NUMBER`** input.
6. Go to `SERVER` tab and set port `8545`.

* Not supported for node@14

#### Enable CONTRACTS tab in Ganache UI

- Go to `CONTRACTS` tab in Genache UI.
- Click `ADD PROJECT` button and chose `truffle-config.js` in the root of the project.
- Reload the workspace.

Now you can see all your contracts under this tab.

## Deployment (currently on local testnet)

```bash
truffle migrate development
```

## Interacting with the contract (cli)

```bash
truffle console
truffle(development)> let instance = await BloxStaking.deployed()
truffle(development)> instance.getTotalStaked()
BN { negative: 0, words: [ 0, <1 empty item> ], length: 1, red: null }

```

## Debug contract

We can debug our contracts using remix + remixd.
Instructions from: https://medium.com/authereum/debugging-solidity-with-a-gui-remix-and-ganache-c6c16488fcfd

*NOTE: Run the remox-ide locally using docker. See instruction there https://github.com/ethereum/remix-ide#docker.*

(we can use Genache UI instead of the CLI)

We should use the truffle deployment and then copy paste the addresses to Remix.

```bash
$ docker pull remixproject/remix-ide:latest
$ docker run --network="host" -p 80:80 remixproject/remix-ide:latest
```

### Produce a first transaction

This is the description how to produce a transaction to the BloxStaking smart contract. 

Once the `remix-ide` is started and `REMIXD` plugin is enabled, contracts are ready to be deployed.

Deploy smart contract first:

- Find and open `BloxStaking` smart contract in the file explorers tab of remix-ide page.
- Compile this smart contract to make sure it's valid.
- Open `Deploy & run transactions` tab in remix-ide.
- Chose `Web3 Provider` option in the `ENVIRONMENT` input.
- Chose account with enough ETH amount on its balance. 
- Chose `BloxStaking` contract in the `CONTRACT` tab.
- Open `BloxStaking` contract in `CONTRACTS` tab of Ganache UI.
- Copy CDT, Exchange, and Deposit Contract values from Ganache UI to remix-ide fields under the deployment button.
- Click `transact` button.

Make validator deposit transaction to the deployed contract:

- Open `Deploy & run transactions` tab in remix-ide.
- Under `Deployed Contracts` section chose the deployed `BloxStaking` smart contract.
- Open `validatorDeposit` section in the list of contract's actions.
- Fill the required fields to make a deposit: `pubkey`, `withdrawal_credentials`, `signature`, and `deposit_data_root`.
- Click `transact` button.

### Connect MetaMask plugin to local Ganache network

This requires the installed MetaMask plugin in a browser.

- Open MetaMask plugin
- Open the networks list and chose `Custom RPC` option.
- Specify network name, e.g. `My Local Network`.
- Specify the Ganache network RPC address, it should be `http://127.0.0.1:8545`.
- Open `ACCOUNTS` tab in Ganache UI.
- Chose an account that should be liked to MetaMask wallet, and click on "key" icon.
- Copy private key of the selected account.
- Go to MetaMask plugin and open the import account screen.
- Paste the copied private key in the MetaMask input.
- Save the account.

## Smart contracts

**IMPORTANT: Anyone who develops upgradable smart contracts must read all articles from there https://docs.openzeppelin.com/upgrades-plugins/1.x/**

Smart contracts is the entity in blockchain similar with wallets. 
From the developer perspective, it looks like a class in a programming. It may have functions, variables, etc.

Smart contract doesn't have a private key, but can receive payments, and can handle that.

Smart contract balance stores in the blockchain, and that info can be stored in local variables of a smart contract as well, like with classes in Java.

Smart contracts should be upgradable. More information can be found there:
- https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable
- https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies

## License

GPL © [Blox Live](https://github.com/bloxapp/blox-live)

<hr />
<br />