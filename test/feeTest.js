const Web3 = require('web3');
const bloxStaking = artifacts.require("BloxStaking");
var cdtContract = artifacts.require("CDTToken");

contract("Fee testing", async accounts => {
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

    it("test fee in CDT", async () => {
        let staking = await bloxStaking.deployed();
        let cdt = await cdtContract.deployed();

        const decimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));
        fee = Web3.utils.toBN(50).mul(decimals);

        return cdt
            .approve(staking.address, fee, {from: accounts[0]})
            .then(res => {
            return staking
                .payFeeInCDT
                .sendTransaction(
                    fee,
                    {from: accounts[0]}
                )
            })
            .then(res => {
                // 1: Approve (erc20)
                // 2: Transfer (erc20)
                // 3: Transfer (erc20) burn
                // 4: FeePaid (BloxStaking)
                expect(res.receipt.rawLogs).to.have.lengthOf(4);

                // those are just the logs in BloxStaking
                expect(res.logs).to.have.lengthOf(1);

                // FeeBurned event
                event0 = res.logs[0];
                expect(event0.event).to.be.equal('FeeBurned');
                expect(event0.args['0'].toString()).to.equal('50000000000000000000'); // fee paid in CDT, should be 909 CDT for 1 eth (with 18 decimals)
            })
            .catch (e => {
                expect(e).to.be.null;
            });
    });
});