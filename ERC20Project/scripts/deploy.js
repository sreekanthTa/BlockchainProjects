// scripts/deploy.js
import { ethers, upgrades } from "hardhat";

async function main() {
  // 1️⃣ Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 2️⃣ Deploy Investors (Upgradeable ERC20)
  const Investors = await ethers.getContractFactory("Investors");
  const investors = await upgrades.deployProxy(
    Investors,
    ["LuxuryApartmentToken", "LPT", deployer.address], // name, symbol, admin
    { initializer: "initialize" }
  );
  await investors.deployed();
  console.log("Investors deployed at:", investors.address);

  // 3️⃣ Deploy DividendDistributor (Upgradeable)
  const DividendDistributor = await ethers.getContractFactory("DividendDistributor");
  const rewardTokenAddress = "0x..."; // Replace with actual reward token address
  const dividendDistributor = await upgrades.deployProxy(
    DividendDistributor,
    [investors.address, rewardTokenAddress, deployer.address], // assetToken, rewardToken, admin
    { initializer: "initialize" }
  );
  await dividendDistributor.deployed();
  console.log("DividendDistributor deployed at:", dividendDistributor.address);
}

// Execute
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
