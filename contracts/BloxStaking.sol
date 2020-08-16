// SPDX-License-Identifier: GNU
// contracts/BloxStaking.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import './DemoValidatorDeposit.sol';
import './ExchangeRouter.sol';

contract BloxStaking {
    address public cdt;
    address public deposit_contract;
    address public exchange;

    uint256 internal total_staked;

    event DepositedValidator(bytes pubkey, bytes withdrawal_credentials, uint256 amount, uint256 updated_total_staked);
    event DepositFailed(string error);
    event FeeBurned(uint256 cdt_amount);
    event FeePurchaseFailed(string error);

    constructor(address _cdt, address _exchange, address _deposit_contract) public {
        cdt = _cdt;
        deposit_contract = _deposit_contract;
        exchange = _exchange;

        total_staked = 0;
    }

    function getTotalStaked() external view returns (uint256) {
        return total_staked;
    }

    function depositAndFee(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root,
        uint256 fee_amount_eth
    ) external payable {
        require(msg.value == (32 ether + fee_amount_eth), "not enough eth to cover deposit and fee");
        this.validatorDeposit{value: 32 ether}(pubkey, withdrawal_credentials, signature, deposit_data_root);
        this.payFeeInETH{value:fee_amount_eth}(fee_amount_eth);
    }

    function validatorDeposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root
    ) public payable {
        require(msg.value >= 32 ether, "insufficient funds");

        try DepositContract(deposit_contract).deposit{value: 32 ether}(pubkey, withdrawal_credentials, signature, deposit_data_root) {
            // update total staked
            total_staked += 32 ether;

            emit DepositedValidator(pubkey, withdrawal_credentials, 32 ether, total_staked);
        } catch Error(string memory _err) {
            emit DepositFailed(_err);
            return;
        }

    }

    function payFeeInETH(uint256 fee_amount_eth) public payable {
        require(msg.value > 0 ether, "insufficient funds");
        require(fee_amount_eth > 0 ether, "fee can't be 0");

        try ExchangeRouter(exchange).exchangeCDT{value:fee_amount_eth}('uniswap',fee_amount_eth) returns (uint256 cdt_bought) {
            // burn
//            bool success = ERC20(cdt).transfer(0x0000000000000000000000000000000000000001, cdt_bought);
//            require(success, "could not burn fee");
            emit FeeBurned(cdt_bought);
        } catch Error(string memory _err) {
            emit FeePurchaseFailed(_err);
        }
    }

    function payFeeInCDT(uint256 fee_amount_cdt) public {
        bool success0 = ERC20(cdt).transferFrom(msg.sender, address(this), fee_amount_cdt);
        require(success0, "CDT allowance not sufficient");

        // burn
        bool success1 = ERC20(cdt).transfer(0x0000000000000000000000000000000000000001, fee_amount_cdt);
        require(success1, "could not burn fee");

        emit FeeBurned(fee_amount_cdt);
    }
}