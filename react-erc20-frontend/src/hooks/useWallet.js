import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTokenContract, getDistributorContract } from "../contracts/contractInstances";

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Initial check
      checkConnection();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        const signer = await provider.getSigner();
        
        setAccount(accounts[0]);
        setChainId(chainId);
        setSigner(signer);
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const signer = await provider.getSigner();

      setAccount(accounts[0]);
      setChainId(chainId);
      setSigner(signer);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    window.location.reload();
  };

  // Contract interactions
  const getTokenBalance = async () => {
    try {
      if (!signer) throw new Error("No signer available");
      const contract = getTokenContract(signer);
      const balance = await contract.balanceOf(account);
      return ethers.formatUnits(balance, 18);
    } catch (err) {
      setError(err.message);
      return "0";
    }
  };

  const transferTokens = async (to, amount) => {
    try {
      if (!signer) throw new Error("No signer available");
      const contract = getTokenContract(signer);
      const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const claimRewards = async () => {
    try {
      if (!signer) throw new Error("No signer available");
      const contract = getDistributorContract(signer);
      const tx = await contract.claimReward();
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const getClaimableRewards = async () => {
    try {
      if (!signer) throw new Error("No signer available");
      const contract = getDistributorContract(signer);
      const rewards = await contract.getClaimable(account);
      return ethers.formatUnits(rewards, 18);
    } catch (err) {
      setError(err.message);
      return "0";
    }
  };

  return {
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    getTokenBalance,
    transferTokens,
    claimRewards,
    getClaimableRewards,
  };
};