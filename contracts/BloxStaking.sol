// contracts/BloxStaking.sol
pragma solidity ^0.6.2;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";

contract BloxStaking is Initializable {
    IERC20 public cdt_token;

    // Initializer function (replaces constructor)
    function initialize(IERC20 _cdt_token) public initializer {
        cdt_token = _cdt_token;
    }

    receive() external payable {
    }
}