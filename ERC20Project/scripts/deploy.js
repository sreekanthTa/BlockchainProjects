// scripts/deploy.js
import { network } from "hardhat";

async function main() {
    const { ethers } = await network.connect();

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Deploy ERC20 token
    const Token = await ethers.getContractFactory("TokenizedAsset"); // replace with your contract name
    const token = await Token.deploy();
    // await token.deployed();
    console.log("ERC20 Token deployed to:", token.target);

    // Deploy Dividend contract
    const Dividend = await ethers.getContractFactory("DividendDistributor"); // replace with your contract name
    const dividend = await Dividend.deploy([token.target, "0x0...", deployer.address]); // constructor param
    // await dividend.deployed();
    console.log("Dividend Contract deployed to:", dividend.target);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
