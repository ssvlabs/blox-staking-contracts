// contracts/BloxStaking.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import './DemoValidatorDeposit.sol';
import './TestExchangeFactory.sol';

contract BloxStaking {
    address  public cdt;
    address  public deposit_contract;
    address  public exchange;

    event DepositedValidator(bytes pubkey, bytes withdrawal_credentials, uint256 amount);
    event DepositFailed(string error);
    event FeePaid(uint256 cdt_amount);
    event FeePurchaseFailed(string error);

    constructor(address _cdt, address _exchange, address _deposit_contract) public {
        cdt = _cdt;
        deposit_contract = _deposit_contract;
        exchange = _exchange;
    }

    function depositAndFee(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root,
        uint256 fee_amount_eth
    ) external payable {
        require(msg.value == (32 ether + fee_amount_eth), "not enough eth to cover deposit and fee");
        this.validatorDeposit.value(32 ether)(pubkey, withdrawal_credentials, signature, deposit_data_root);
        this.payFee.value(fee_amount_eth)(fee_amount_eth);
    }

    function validatorDeposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root
    ) public payable {
        require(msg.value >= 32 ether, "insufficient funds");

        try DepositContract(deposit_contract).deposit.value(32 ether)(pubkey, withdrawal_credentials, signature, deposit_data_root) {
            emit DepositedValidator(pubkey, withdrawal_credentials, 32 ether);
        } catch Error(string memory _err) {
            emit DepositFailed(_err);
            return;
        }
    }

    function payFee(uint256 fee_amount_eth) public payable {
        require(msg.value > 0 ether, "insufficient funds");
        require(fee_amount_eth > 0 ether, "fee can't be 0");

        try TestExchangeFactory(exchange).exchangeCDT.value(fee_amount_eth)(fee_amount_eth) returns (uint256 cdt_bought) {
            emit FeePaid(cdt_bought);
        } catch Error(string memory _err) {
            emit FeePurchaseFailed(_err);
        }
    }
}