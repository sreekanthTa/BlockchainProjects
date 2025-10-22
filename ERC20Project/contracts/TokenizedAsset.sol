// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TokenizedAsset is Initializable, ERC20Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant WHITELISTER_ROLE = keccak256("WHITELISTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(address => bool) private _whitelisted;
    bool public whitelistEnabled;

    event Whitelisted(address indexed who);
    event Dewhitelisted(address indexed who);
    event WhitelistEnabled(bool enabled);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(string memory name_, string memory symbol_, address admin) public initializer {
        __ERC20_init(name_, symbol_);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(WHITELISTER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        whitelistEnabled = true;
    }

    // Whitelist functions
    function whitelist(address who) external onlyRole(WHITELISTER_ROLE) {
        _whitelisted[who] = true;
        emit Whitelisted(who);
    }

    function dewhitelist(address who) external onlyRole(WHITELISTER_ROLE) {
        _whitelisted[who] = false;
        emit Dewhitelisted(who);
    }

    function isWhitelisted(address who) public view returns (bool) {
        if (!whitelistEnabled) return true;
        return _whitelisted[who];
    }

    function setWhitelistEnabled(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistEnabled = enabled;
        emit WhitelistEnabled(enabled);
    }

    // Mint & Burn
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(isWhitelisted(to), "Recipient not whitelisted");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(MINTER_ROLE) {
        _burn(from, amount);
    }

    function burnSelf(uint256 amount) external {
        _burn(msg.sender, amount);
    }

  

    // // Transfer hook
    // function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
    //     super._beforeTokenTransfer(from, to, amount);
    //     if (to != address(0)) {
    //         require(isWhitelisted(to), "Recipient not whitelisted");
    //     }
    //     if (from != address(0)) {
    //         require(isWhitelisted(from), "Sender not whitelisted");
    //     }
    // }

    // UUPS upgrade authorization
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
}
