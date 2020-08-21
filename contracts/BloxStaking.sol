// SPDX-License-Identifier: GNU
// contracts/BloxStaking.sol
pragma solidity ^0.6.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./IDepositContract.sol";
import "./ExchangeRouter.sol";

contract BloxStaking {
    address public cdt;
    address public depositContract;
    address public exchange;
    address constant public BURN_ADDRESS = 0x0000000000000000000000000000000000000001;

    uint256 internal totalStaked;

    event DepositedValidator(bytes pubkey, bytes withdrawalCredentials, uint256 amount, uint256 updatedTotalStaked);
    event FeeBurned(uint256 cdt_amount);

    constructor(address _cdt, address _exchange, address _depositContract) public {
        cdt = _cdt;
        depositContract = _depositContract;
        exchange = _exchange;

        totalStaked = 0;
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    function depositAndFee(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root,
        uint256 fee_amount_eth
    ) external payable {
        require(msg.value == (32 ether + fee_amount_eth), "not enough/ too much eth to cover deposit and fee");

        this.validatorDeposit{value: 32 ether}(pubkey, withdrawal_credentials, signature, deposit_data_root);
        this.payFeeInETH{value:fee_amount_eth}(fee_amount_eth);
    }

    function validatorDeposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root
    ) public payable {
        require(msg.value == 32 ether, "validator deposit should be exactly 32 eth");

        IDepositContract(depositContract).deposit{value: 32 ether}(pubkey, withdrawal_credentials, signature, deposit_data_root);
        totalStaked += 32 ether;
        emit DepositedValidator(pubkey, withdrawal_credentials, 32 ether, totalStaked);
    }

    function payFeeInETH(uint256 feeAmountETH) public payable {
        require(msg.value > 0 ether, "insufficient funds");
        require(feeAmountETH > 0 ether, "fee can't be 0");

        uint256 cdtBought = ExchangeRouter(exchange).exchangeCDT{value:feeAmountETH}('uniswap',feeAmountETH);
        require(ERC20(cdt).transfer(BURN_ADDRESS, cdtBought), "could not burn fee");
        emit FeeBurned(cdtBought);
    }

    function payFeeInCDT(uint256 feeAmountCDT) public {
        bool success0 = ERC20(cdt).transferFrom(msg.sender, address(this), feeAmountCDT);
        require(success0, "CDT allowance not sufficient");

        // burn
        require(ERC20(cdt).transfer(BURN_ADDRESS, feeAmountCDT), "could not burn fee");
        emit FeeBurned(feeAmountCDT);
    }
}