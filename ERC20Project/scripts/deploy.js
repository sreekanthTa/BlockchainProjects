import hre from "hardhat";
import "@openzeppelin/hardhat-upgrades";

async function main() {
  const { ethers, upgrades } = hre;

  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with account:", deployer.address);

  // --- 1️⃣ Deploy TokenizedAsset as UUPS proxy ---
  const TokenizedAsset = await ethers.getContractFactory("TokenizedAsset");
  const token = await upgrades.deployProxy(
    TokenizedAsset,
    ["MyToken", "MTK", deployer.address], // initializer args
    { initializer: "initialize", kind: "uups" }
  );
  await token.waitForDeployment();
  console.log("✅ TokenizedAsset proxy deployed to:", await token.getAddress());

  // --- 2️⃣ Deploy DividendDistributor as UUPS proxy ---
  const DividendDistributor = await ethers.getContractFactory("DividendDistributor");
  // Assuming constructor takes [tokenAddress, someOtherAddress, admin]
  const dividend = await upgrades.deployProxy(
    DividendDistributor,
    [await token.getAddress(), "0x0000000000000000000000000000000000000000", deployer.address],
    { initializer: "initialize", kind: "uups" }
  );
  await dividend.waitForDeployment();
  console.log("✅ DividendDistributor proxy deployed to:", await dividend.getAddress());

  // --- 3️⃣ Done, contracts ready ---
  console.log("🎯 Both contracts deployed and ready.");
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
