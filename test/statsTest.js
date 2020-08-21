const Web3 = require('web3');
const bloxStaking = artifacts.require("BloxStaking");

contract("Stats testing", async accounts => {

    it("test total staked updated", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);
        fee = Web3.utils.toBN(1).mul(decimals);

        return instance
            .depositAndFee
            .sendTransaction(
                web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                fee,
                {from: accounts[0], value: value.add(fee)}
            )
            .then(res => {
                // DepositedValidator event
                event0 = res.logs[0];
                expect(event0.args['3'].toString()).to.equal('32000000000000000000'); // total staked

                return instance
                    .depositAndFee
                    .sendTransaction(
                        web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                        web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                        web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                        web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                        fee,
                        {from: accounts[0], value: value.add(fee)}
                    )
            })
            .then(res => {
                    // DepositedValidator event
                    event0 = res.logs[0];
                expect(event0.args['3'].toString()).to.equal('64000000000000000000'); // total staked
            })
            .catch (e => {
                    console.log(e);
                expect(e).to.be.null;
            });
});
});