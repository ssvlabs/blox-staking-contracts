const Web3 = require('web3');
const bloxStaking = artifacts.require("BloxStaking");
const depositContract = artifacts.require("DepositContract");

contract("BloxStaking - initial deposit", async accounts => {

    // it("test direct deposit", async () => {
    //     let instance = await bloxStaking.deployed();
    //
    //     const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
    //     value = Web3.utils.toBN(33).mul(decimals);
    //
    //     return instance
    //         .validatorDeposit
    //         .sendTransaction(
    //             web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
    //             web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
    //             web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
    //             web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
    //             {from: accounts[1], value: value}
    //         )
    //         .then(res => {
    //             // console.log(res);
    //             // res.receipt.logs.forEach(function(v,i,arr) {
    //             //     console.log(v);
    //             // });
    //         // TODO
    //         })
    //         .catch (e => {
    //             expect(e).to.be.null;
    //         })
    // });

    it("test fee in ETH", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);
        fee = Web3.utils.toBN(1).mul(decimals);

        return instance
            .payFeeInETH
            .sendTransaction(
                fee,
                {from: accounts[0], value: value.add(fee)}
            )
            .then(res => {
                expect(res.logs).to.have.lengthOf(1)
                expect(res.logs[0].event).to.equal("FeeBurned");
                expect(res.receipt.logs[0].args.cdt_amount.div(decimals).toString()).to.equal('909');
            })
            .catch (e => {
                console.log(e);
                expect(e).to.be.null;
            });
    });

    // it("test fee in CDT", async () => {
    //     let staking = await bloxStaking.deployed();
    //     let cdt = await cdtContract.deployed();
    //
    //     const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
    //     fee = Web3.utils.toBN(50).mul(decimals);
    //
    //     return cdt
    //         .approve(staking.address, fee, {from: accounts[0]})
    //         .then(res => {
    //         return staking
    //             .payFeeInCDT
    //             .sendTransaction(
    //                 fee,
    //                 {from: accounts[0]}
    //             )
    //         })
    //         .then(res => {
    //             // 1: Approve (erc20)
    //             // 2: Transfer (erc20)
    //             // 3: Transfer (erc20) burn
    //             // 4: FeePaid (BloxStaking)
    //             expect(res.receipt.rawLogs).to.have.lengthOf(4);
    //
    //             // those are just the logs in BloxStaking
    //             expect(res.logs).to.have.lengthOf(1);
    //
    //             // FeeBurned event
    //             event0 = res.logs[0];
    //             expect(event0.event).to.be.equal('FeeBurned');
    //             expect(event0.args['0'].toString()).to.equal('50000000000000000000'); // fee paid in CDT, should be 909 CDT for 1 eth (with 18 decimals)
    //         })
    //         .catch (e => {
    //                 console.log(e);
    //             expect(e).to.be.null;
    //         });
    // });
    //
    // it("test deposit + fee conversion", async () => {
    //     let instance = await bloxStaking.deployed();
    //
    //     const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
    //     value = Web3.utils.toBN(32).mul(decimals);
    //     fee = Web3.utils.toBN(1).mul(decimals);
    //
    //     return instance
    //         .depositAndFee
    //         .sendTransaction(
    //             web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
    //             web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
    //             web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
    //             web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
    //             fee,
    //             {from: accounts[1], value: value.add(fee)}
    //         )
    //         .then(res => {
    //             // 1: DepositEvent (from the eth deposit contract)
    //             // 2: DepositedValidator (BloxStaking)
    //             // 3: Transfer (erc20)
    //             // 4: Transfer (erc20) burn
    //             // 5: FeePaid (BloxStaking)
    //             expect(res.receipt.rawLogs).to.have.lengthOf(5);
    //
    //             // those are just the logs in BloxStaking
    //             expect(res.logs).to.have.lengthOf(2);
    //
    //             // DepositedValidator event
    //             event0 = res.logs[0];
    //             expect(event0.event).to.be.equal('DepositedValidator');
    //             expect(event0.args['0']).to.equal('0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c'); // pub key
    //             expect(event0.args['1']).to.equal('0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b'); // withdrawal cred
    //             expect(event0.args['2'].toString()).to.equal('32000000000000000000'); // amount
    //             expect(event0.args['3'].toString()).to.equal('64000000000000000000'); // total staked
    //
    //             // FeeBurned event
    //             event1 = res.logs[1];
    //             expect(event1.event).to.be.equal('FeeBurned');
    //             expect(event1.args['0'].toString()).to.equal('909090909090909090909'); // fee paid in CDT, should be 909 CDT for 1 eth (with 18 decimals)
    //         })
    //         .catch (e => {
    //             console.log(e);
    //             expect(e).to.be.null;
    //         });
    // });
    //
    //
    // it("test total staked updated", async () => {
    //     let instance = await bloxStaking.deployed();
    //
    //     const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
    //     value = Web3.utils.toBN(32).mul(decimals);
    //     fee = Web3.utils.toBN(1).mul(decimals);
    //
    //     return instance
    //         .depositAndFee
    //         .sendTransaction(
    //             web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
    //             web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
    //             web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
    //             web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
    //             fee,
    //             {from: accounts[1], value: value.add(fee)}
    //         )
    //         .then(res => {
    //             // DepositedValidator event
    //             event0 = res.logs[0];
    //             expect(event0.args['3'].toString()).to.equal('96000000000000000000'); // total staked
    //
    //             return instance
    //                 .depositAndFee
    //                 .sendTransaction(
    //                     web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
    //                     web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
    //                     web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
    //                     web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
    //                     fee,
    //                     {from: accounts[1], value: value.add(fee)}
    //                 )
    //         })
    //         .then(res => {
    //                 // DepositedValidator event
    //                 event0 = res.logs[0];
    //             expect(event0.args['3'].toString()).to.equal('128000000000000000000'); // total staked
    //         })
    //         .catch (e => {
    //                 console.log(e);
    //             expect(e).to.be.null;
    //         });
    // });
});