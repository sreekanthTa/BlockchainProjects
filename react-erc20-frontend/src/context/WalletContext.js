import { createContext } from 'react';
import { useWallet } from '../hooks/useWallet';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const walletData = useWallet();

  return (
    <WalletContext.Provider value={walletData}>
      {children}
    </WalletContext.Provider>
  );
};