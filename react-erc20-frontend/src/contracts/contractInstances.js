import { ethers } from "ethers";
import TokenizedAssetABI from "../contracts/TokenizedAsset.json";
import DividendDistributorABI from "../contracts/DividendDistributor.json";

// Update these with your deployed contract addresses
const TOKENIZED_ASSET_ADDRESS = "YOUR_TOKENIZED_ASSET_ADDRESS";
const DIVIDEND_DISTRIBUTOR_ADDRESS = "YOUR_DIVIDEND_DISTRIBUTOR_ADDRESS";

export const getTokenContract = (signer) => {
  return new ethers.Contract(
    TOKENIZED_ASSET_ADDRESS,
    TokenizedAssetABI.abi,
    signer
  );
};

export const getDistributorContract = (signer) => {
  return new ethers.Contract(
    DIVIDEND_DISTRIBUTOR_ADDRESS,
    DividendDistributorABI.abi,
    signer
  );
};