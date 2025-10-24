import { useState } from 'react';
import { ethers } from 'ethers';
import TokenizedAssetABI from '../contracts/TokenizedAsset.json';

const TokenTransfer = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const TOKEN_ADDRESS = ''; // Add your deployed TokenizedAsset contract address

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!ethers.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }

      const { ethereum } = window;
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenizedAssetABI.abi, signer);

      const parsedAmount = ethers.parseEther(amount);
      const tx = await tokenContract.transfer(recipient, parsedAmount);
      await tx.wait();

      setSuccess('Transfer successful!');
      setRecipient('');
      setAmount('');
    } catch (err) {
      console.error('Error transferring tokens:', err);
      setError(err.message || 'Error transferring tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-page">
      <h1>Transfer Tokens</h1>

      <form onSubmit={handleTransfer} className="transfer-form">
        <div className="form-group">
          <label htmlFor="recipient" className="form-label">Recipient Address</label>
          <input
            type="text"
            id="recipient"
            className="input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="form-label">Amount (LPT)</label>
          <input
            type="number"
            id="amount"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000000000000000001"
            min="0"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </form>

      <style>{`
        .transfer-page {
          padding: 2rem 0;
        }

        h1 {
          margin-bottom: 2rem;
          text-align: center;
        }

        .transfer-form {
          max-width: 500px;
          margin: 0 auto;
          background: var(--card-background);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default TokenTransfer;