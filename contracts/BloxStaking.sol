// contracts/BloxStaking.sol
pragma solidity ^0.6.2;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import './DemoValidatorDeposit.sol';

contract BloxStaking {
    address  public cdt;
    address  public deposit_contract;
    uint counter;

    event DepositedValidator(bytes pubkey, bytes withdrawal_credentials, uint256 amount);
    event DepositFailed(string error);
    event FeePaid(bytes pubkey, uint256 cdt_amount);

    constructor(address _cdt, address _deposit_contract) public {
        cdt = _cdt;
        deposit_contract = _deposit_contract;
        counter = 0;
    }

    function increment() public {
        counter += 1;
    }

    function getCount() public view returns (uint) {
        return counter;
    }

    function depositAndFee(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root,
        uint256 fee_amount_eth
    ) external payable {

    }

    function validatorDeposit(
        bytes memory pubkey,
        bytes memory withdrawal_credentials,
        bytes memory signature,
        bytes32 deposit_data_root
    ) public payable {
        require(msg.value > 32 ether, "insufficient funds");

        try DepositContract(deposit_contract).deposit.value(32 ether)(pubkey, withdrawal_credentials, signature, deposit_data_root) {
            emit DepositedValidator(pubkey, withdrawal_credentials, 32 ether);
        } catch Error(string memory _err) {
            emit DepositFailed(_err);
            return;
        }
    }

    function payFee(uint256 fee_amount_eth) public payable {

    }
}