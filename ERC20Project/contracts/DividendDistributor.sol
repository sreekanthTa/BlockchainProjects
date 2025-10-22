// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";


/**
 * @title DividendDistributor
 * @dev Distributes stablecoin rewards proportionally to TokenizedAsset holders
 */
contract DividendDistributor is Initializable, AccessControlUpgradeable {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    // Reference to the TokenizedAsset
    ERC20Upgradeable public assetToken;

    // Reward token (stablecoin)
    ERC20Upgradeable public rewardToken;

    uint256 public totalDistributed;

    mapping(address => uint256) public claimedRewards;

    event RewardDeposited(uint256 totalAmount);
    event Claimed(address indexed investor, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        address _assetToken,
        address _rewardToken,
        address admin
    ) public initializer {
        __AccessControl_init();

        assetToken = ERC20Upgradeable(_assetToken);
        rewardToken = ERC20Upgradeable(_rewardToken);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DISTRIBUTOR_ROLE, admin);
    }

    // Deposit reward tokens into the contract
    function depositRewards(uint256 amount) external onlyRole(DISTRIBUTOR_ROLE) {
        require(amount > 0, "Amount must be > 0");
        rewardToken.transferFrom(msg.sender, address(this), amount);
        totalDistributed += amount;
        emit RewardDeposited(amount);
    }

    // Claim rewards proportional to TokenizedAsset holdings
    function claimReward() external {
        uint256 holderBalance = assetToken.balanceOf(msg.sender);
        require(holderBalance > 0, "No asset tokens held");

        uint256 totalSupply = assetToken.totalSupply();
        require(totalSupply > 0, "No tokens minted");

        uint256 claimable = (totalDistributed * holderBalance) / totalSupply;
        uint256 pending = claimable - claimedRewards[msg.sender];
        require(pending > 0, "No rewards to claim");

        claimedRewards[msg.sender] = claimable;
        rewardToken.transfer(msg.sender, pending);

        emit Claimed(msg.sender, pending);
    }

    // View claimable rewards
    function getClaimable(address account) external view returns (uint256) {
        uint256 holderBalance = assetToken.balanceOf(account);
        uint256 totalSupply = assetToken.totalSupply();

        if (totalSupply == 0) return 0;

        uint256 claimable = (totalDistributed * holderBalance) / totalSupply;
        return claimable - claimedRewards[account];
    }
}
