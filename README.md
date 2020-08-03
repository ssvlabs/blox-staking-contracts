[<img src="./internals/img/Blox-Staking-Banner.png" >](https://www.bloxstaking.com/)

<br>
<br>

<div align="center">
[![Github Tag][github-tag-image]][github-tag-url]
[![Discord](https://discord.com/api/guilds/723834989506068561/widget.png?style=shield)](https://discord.gg/HpT2z5B)

</div>

## Compile
First, clone the repo via git and install dependencies:

```bash
git clone https://github.com/bloxapp/blox-staking-contracts
cd blox-staking-contracts
npx oz compile
```
## Local test network
```bash
npx ganache-cli --deterministic
```
* Not supported for node@14

## Deployment (currently on local testnet)


```bash
npx oz deploy

```

## interacting with the contract (cli)


```bash
npx oz send-tx 

```

## License

GPL © [Blox Live](https://github.com/bloxapp/blox-live)

<hr />
<br />