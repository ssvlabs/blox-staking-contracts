const Web3 = require('web3');
const bloxStaking = artifacts.require("BloxStaking");

contract("Deposit testing", async accounts => {
    it("valid deposit", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);

        return instance
            .validatorDeposit
            .sendTransaction(
                web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                {from: accounts[0], value: value}
            )
            .then(res => {
                // 1: DepositEvent (from the eth deposit contract)
                // 2: DepositedValidator
                expect(res.receipt.rawLogs).to.have.lengthOf(2);

                // DepositedValidator event
                event = res.logs[0];
                expect(event.event).to.be.equal('DepositedValidator');
                expect(event.args['0']).to.equal('0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c'); // pub key
                expect(event.args['1']).to.equal('0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b'); // withdrawal cred
                expect(event.args['2'].toString()).to.equal('32000000000000000000'); // amount
                expect(event.args['3'].toString()).to.equal('32000000000000000000'); // total staked
            })
            .catch (e => {
                console.log(e);
                expect(e).to.be.null;
            })
    });

    it("valid deposit + fee", async () => {
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
                // 1: DepositEvent (from the eth deposit contract)
                // 2: DepositedValidator (BloxStaking)
                // 3: Transfer (erc20)
                // 4: Transfer (erc20) burn
                // 5: FeeBurned (BloxStaking)
                expect(res.receipt.rawLogs).to.have.lengthOf(5);

                // those are just the logs in BloxStaking
                expect(res.logs).to.have.lengthOf(2);

                // DepositedValidator event
                event0 = res.logs[0];
                expect(event0.event).to.be.equal('DepositedValidator');
                expect(event0.args['0']).to.equal('0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c'); // pub key
                expect(event0.args['1']).to.equal('0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b'); // withdrawal cred
                expect(event0.args['2'].toString()).to.equal('32000000000000000000'); // amount
                expect(event0.args['3'].toString()).to.equal('64000000000000000000'); // total staked

                // FeeBurned event
                event1 = res.logs[1];
                expect(event1.event).to.be.equal('FeeBurned');
                expect(event1.args['0'].toString()).to.equal('909090909090909090909'); // fee paid in CDT, should be 909 CDT for 1 eth (with 18 decimals)
            })
            .catch (e => {
                console.log(e);
                expect(e).to.be.null;
            });
    });

    it("invalid deposit - wrong pub key", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);

        let res;
        try {
            res = await instance
                .validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xb342c3f98a0eeb7bcd17c7d5ef351eae0d472436267960405ff3b3142be59589e6f12f99ffdd5ed69c62ae8063d10bdc"), // wrong
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                    web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                    {from: accounts[1], value: value}
                );
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("Error: Returned error: VM Exception while processing transaction: revert");
    });

    it("invalid deposit - invalid withdrawal creds", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);

        let res;
        try {
            res = await instance
                .validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"), // invalid
                    web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                    {from: accounts[1], value: value}
                );
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("Error: Returned error: VM Exception while processing transaction: revert");
    });

    it("invalid deposit - invalid signature", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);

        let res;
        try {
            res = await instance
                .validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"), // invalid
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                    {from: accounts[1], value: value}
                );
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("Error: Returned error: VM Exception while processing transaction: revert");
    });

    it("invalid deposit - wrong signature", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);

        let res;
        try {
            res = await instance
                .validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                    web3.utils.hexToBytes("0x89d1ffb6bb53393c408656a05fd8f148eef5985d14b5e09d8e1895e320a40d4ff2718558a0d00c55c43e8eba83a392180aea738feedc2d99e8cee7fe5f9e10813a5d60f6a8dbd8b8ea180aa90acc7910bdc6b9a8389aafa85d7c27d3d335117d"), // wrong
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                    {from: accounts[1], value: value}
                );
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("Error: Returned error: VM Exception while processing transaction: revert");
    });

    it("invalid deposit - wrong root", async () => {
        let instance = await bloxStaking.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        value = Web3.utils.toBN(32).mul(decimals);

        let res ;
        try {
            res = await instance
                .validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                    web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d78"), // wrong
                    {from: accounts[1], value: value}
                )
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("Error: Returned error: VM Exception while processing transaction: revert");
    });

    it("invalid deposit - value too small", async () => {
        let instance = await bloxStaking.deployed();

        value = Web3.utils.toBN(31900000000000000000); // 31.9 eth
        let res;
        try {
            res = await instance.validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                    web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                    {from: accounts[1], value: value}
                );
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("validator deposit should be exactly 32 eth");

    });

    it("invalid deposit - value too high", async () => {
        let instance = await bloxStaking.deployed();

        value = Web3.utils.toBN(32100000000000000000); // 32.1 eth

        let res;
        try {
            res = await instance.validatorDeposit
                .sendTransaction(
                    web3.utils.hexToBytes("0xa70360aa20eb09a00019e47c9775ba8e655b934b86de409a49a25e4196663c5f10dffe29b12b7cf782e4561a43c5c62c"),
                    web3.utils.hexToBytes("0x00c76a029adcac82fe161b34f44de3c8c94182ffe75bf29a938691ebfd66bf6b"),
                    web3.utils.hexToBytes("0x88ff6c5a44b85db96b684cee772506489ae388838fe4d13435bf415de23ce14a9b4f254dd1f456cffbb581d87f4a6ce806f559e8d1afa28cdbde84a5fba6526e9f948ddde7166d8ba8218478e5e681833492d61a7b49d11ced0718ac317218df"),
                    web3.utils.hexToBytes("0x6255505dc4c2ba5828cc6ad8f47bd122f02d8c840fc1aa81abd817f3971c2d79"),
                    {from: accounts[1], value: value}
                );
        }
        catch (err) {
            res = err;
        }
        expect(res).to.be.instanceOf(Error);
        expect(res.toString()).to.have.string("validator deposit should be exactly 32 eth");

    });
})