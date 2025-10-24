import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenizedAssetABI from '../contracts/TokenizedAsset.json';
import DividendDistributorABI from '../contracts/DividendDistributor.json';

const Dashboard = () => {
  const [tokenBalance, setTokenBalance] = useState('0');
  const [rewardBalance, setRewardBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [isWhitelisted_, setIsWhitelisted] = useState(false);
  const[address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const [roleName, setRoleName] = useState('');
const [accountAddress, setAccountAddress] = useState('');
// Deploying contracts with account: 0x662c69f27d790a85c88E2e1c9b6708813d68eB40
// ERC20 Token deployed to: 0xf0AD37A6536BEF84f9D3B6D1C83B2Ef381922991
// Dividend Contract deployed to: 0x89aD19b1bB0D2ede545B24d997f5F7BCd277F93B

  const TOKEN_ADDRESS = '0x14E63a29E63A94cb0D4DA16C2887Ca009c378Eea'; // Latest deployed TokenizedAsset proxy address
  const DISTRIBUTOR_ADDRESS = '0x5444a5551bB074C2ca727cCd9BCa18BD17Cfba0F'; // Latest deployed DividendDistributor address

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log('Fetching data for address:', address);
      console.log('Using TOKEN_ADDRESS:', TOKEN_ADDRESS);

      // Initialize contracts
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenizedAssetABI.abi, signer);
      const distributorContract = new ethers.Contract(DISTRIBUTOR_ADDRESS, DividendDistributorABI.abi, signer);

      console.log("Initialized contracts:", { tokenContract, distributorContract });    

      // Fetch token data
      const balance = await tokenContract.balanceOf(address);
      const supply = await tokenContract.totalSupply();
      const whitelist = await tokenContract.isWhitelisted(address);
      
      console.log('Whitelist status for', address, ':', whitelist);
      
      // Calculate available rewards
      const totalRewards = await distributorContract.totalDistributed();
      const claimed = await distributorContract.claimedRewards(address);
      const myTokens = await tokenContract.balanceOf(address);
      const totalTokens = await tokenContract.totalSupply();
      
      // Calculate unclaimed rewards: (myTokens / totalTokens) * totalRewards - claimed
      const unclaimedRewards = totalTokens ==0 ? 
        0n : 
        (myTokens * totalRewards / totalTokens) - claimed;

      setTokenBalance(ethers.formatEther(balance));
      setTotalSupply(ethers.formatEther(supply));
      setIsWhitelisted(whitelist);
      setRewardBalance(ethers.formatEther(unclaimedRewards));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again.');
      setLoading(false);
    }
  };



  const claimRewards = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const distributorContract = new ethers.Contract(DISTRIBUTOR_ADDRESS, DividendDistributorABI.abi, signer);

      const tx = await distributorContract.claimRewards();
      await tx.wait();
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError('Error claiming rewards. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const whiteListAddress = async () => {

    try {
        if (!ethers.isAddress(address)) {
  console.log("Please enter a valid Ethereum address");
  return;
}
console.log("ethers.isAddress(address)", ethers.isAddress(address));
      const { ethereum } = window;
      if (!ethereum) return;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        console.log("Signer address:", signer);
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenizedAssetABI.abi, signer);
        console.log("Whitelisting address:", address);
        const tx = await tokenContract.whitelist(address);
        await tx.wait();
        fetchData();
    } catch (err) {
      console.error('Error whitelisting address:', err);
      setError('Error whitelisting address. Please try again.');
    }
}

const deWhiteListAddress = async () => {

    try {   
        const { ethereum } = window;
        if (!ethereum) return;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenizedAssetABI.abi, signer);
                console.log("De-whitelisting address:", signer);

        const tx = await tokenContract.dewhitelist(address);
        await tx.wait();
        fetchData();
    }   catch (err) {
        console.error('Error de-whitelisting address:', err);
        setError('Error de-whitelisting address. Please try again.');
    }
}

const isWhiteListed = async () => {
    try {
        console.log('Checking whitelist status...');
        const { ethereum } = window;
        if (!ethereum) return;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenizedAssetABI.abi, signer);
        const whitelist = await tokenContract.isWhitelisted(address);
        console.log("whitelist response", whitelist)
        setIsWhitelisted(whitelist);
    } catch (err) {
        console.error('Error checking whitelist status:', err);
        setError('Error checking whitelist status. Please try again.');
    }
}




const checkRole = async function() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.chainId, network.name);
    
    const signer = await provider.getSigner();
    const user = await signer.getAddress();

    console.log("Contract address:", TOKEN_ADDRESS);
    console.log("Connected user address:", user);
    
    const contract = new ethers.Contract(TOKEN_ADDRESS, TokenizedAssetABI.abi, signer);
    
    // Use the hardcoded WHITELISTER_ROLE hash
    const WHITELISTER_ROLE = "0x8619cecd8b9e095ab43867f5b69d492180450fe862e6b50bfbfb24b75dd84c8a";
    console.log("Using WHITELISTER_ROLE hash:", WHITELISTER_ROLE);
    
    // Use hasRole directly
    const hasRole = await contract.hasRole(WHITELISTER_ROLE, user);
    console.log("Has WHITELISTER_ROLE:", hasRole);
    return hasRole;
  } catch (err) {
    console.error("Error checking role status:", err);
    console.log("Error details:", {
      message: err.message,
      code: err.code,
      transaction: err.transaction
    });
    setError('Error checking role status. Please try again.');
    return false;
  }
}



  return (
    <div className="dashboard">
      <h1>Token Dashboard</h1>
      
      {error && <div className="error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Your Token Balance</h3>
          <div className="stat-value">{tokenBalance} LPT</div>
        </div>

        <div className="stat-card">
          <h3>Total Supply</h3>
          <div className="stat-value">{totalSupply} LPT</div>
        </div>

        <div className="stat-card">
          <h3>Claimable Rewards</h3>
          <div className="stat-value">{rewardBalance} USDC</div>
          <button 
            onClick={claimRewards} 
            className="btn btn-primary"
            disabled={rewardBalance === '0'}
          >
            Claim Rewards
          </button>
        </div>
      </div>

      <div className="card whitelist-section">
        <h3>Whitelist Management</h3>
        
        <div className="whitelist-status mb-4">
          <h4>Your Status</h4>
          <div className={`status ${isWhitelisted_ ? 'success' : 'error'}`}>
            {isWhitelisted_ ? 'Whitelisted' : 'Not Whitelisted'}
          </div>
          <div className="button-group mt-3">
            <button 
              onClick={whiteListAddress} 
              className="btn btn-primary"
            //   disabled={loading || isWhitelisted}
            >
              Whitelist Below Address
            </button>
            <button 
              onClick={deWhiteListAddress} 
              className="btn btn-secondary ml-2"
              disabled={loading || !isWhitelisted_}
            >
              Remove Address from Whitelist
            </button>
            <button 
              onClick={isWhiteListed} 
              className="btn btn-secondary ml-2"
              disabled={loading}
            >
              Check Status for Below Address ({isWhitelisted_ ? "True": "False"})
            </button>
          </div>
        </div>

        {/* Remove from Whitelist */}
        <form onSubmit={deWhiteListAddress} className="form-group">
          <label>Address</label>
          <div className="flex">
            <input
              type="text"
              className="form-control"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {/* <button type="submit" className="btn btn-secondary ml-2" disabled={loading || !address}>
              Remove
            </button> */}
          </div>
        </form>

        <div>
            <button onClick={checkRole}> Check Role for address</button>
             <div>Role</div>
            <input onChange={e=>setRoleName(e?.target?.value)}></input>
            <div>Address</div>
            <input onChange={e=>setAccountAddress(e?.target?.value)}></input>
        </div>
      </div>

      <style>{`
        .dashboard {
          padding: 2rem 0;
        }

        h1 {
          margin-bottom: 2rem;
          color: var(--text-color);
        }

        .loading {
          text-align: center;
          padding: 2rem;
        }

        .whitelist-status {
          margin-top: 2rem;
          padding: 1rem;
          background: var(--card-background);
          border-radius: 10px;
        }

        .status {
          padding: 0.5rem;
          border-radius: 5px;
          margin-top: 0.5rem;
          text-align: center;
        }

        .status.success {
          background: var(--success-color);
          color: white;
        }

        .status.error {
          background: var(--error-color);
          color: white;
        }

        .whitelist-section {
          margin-top: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .flex {
          display: flex;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-control {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .ml-2 {
          margin-left: 0.5rem;
        }

        .mb-4 {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;