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

    uint256 internal totalStaked;

    event DepositedValidator(bytes pubkey, bytes withdrawalCredentials, uint256 amount, uint256 updatedTotalStaked);
    event DepositFailed(string error);
    event FeeBurned(uint256 cdt_amount);
    event FeePurchaseFailed(string error);

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

        try IDepositContract(depositContract).deposit{value: 32 ether}(pubkey, withdrawal_credentials, signature, deposit_data_root) {
            // update total staked
            totalStaked += 32 ether;

            emit DepositedValidator(pubkey, withdrawal_credentials, 32 ether, totalStaked);
        } catch Error(string memory _err) {
            emit DepositFailed(_err);
            return;
        }

    }

    function payFeeInETH(uint256 feeAmountETH) public payable {
        require(msg.value > 0 ether, "insufficient funds");
        require(feeAmountETH > 0 ether, "fee can't be 0");

        try ExchangeRouter(exchange).exchangeCDT{value:feeAmountETH}('uniswap',feeAmountETH) returns (uint256 cdtBought) {
            // burn
            require(ERC20(cdt).transfer(0x0000000000000000000000000000000000000001, cdtBought), "could not burn fee");
            emit FeeBurned(cdtBought);
        } catch Error(string memory _err) {
            emit FeePurchaseFailed(_err);
        }
    }

    function payFeeInCDT(uint256 feeAmountCDT) public {
        bool success0 = ERC20(cdt).transferFrom(msg.sender, address(this), feeAmountCDT);
        require(success0, "CDT allowance not sufficient");

        // burn
        bool success1 = ERC20(cdt).transfer(0x0000000000000000000000000000000000000001, feeAmountCDT);
        require(success1, "could not burn fee");

        emit FeeBurned(feeAmountCDT);
    }
}