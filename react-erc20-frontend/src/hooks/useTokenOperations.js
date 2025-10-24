import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

export const useTokenOperations = () => {
  const {
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    getTokenBalance,
    transferTokens,
    claimRewards,
    getClaimableRewards
  } = useContext(WalletContext);

  const formatAccount = (account) => {
    if (!account) return '';
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4);
  };

  const handleTransfer = async (to, amount) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet first');
    }
    return await transferTokens(to, amount);
  };

  const handleClaimRewards = async () => {
    if (!isConnected) {
      throw new Error('Please connect your wallet first');
    }
    return await claimRewards();
  };

  const refreshBalances = async () => {
    if (!isConnected) return;
    const tokenBalance = await getTokenBalance();
    const claimable = await getClaimableRewards();
    return { tokenBalance, claimable };
  };

  return {
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    formatAccount,
    formatBalance,
    handleTransfer,
    handleClaimRewards,
    refreshBalances,
  };
};