import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>TokenizedAsset Platform</h1>
        <p>Manage and transfer your LuxuryApartment tokens with ease</p>
        <Link to="/dashboard" className="btn btn-primary">
          Launch App
        </Link>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Token Management</h3>
          <p>View your balance and transfer tokens securely</p>
        </div>

        <div className="feature-card">
          <h3>Dividend Distribution</h3>
          <p>Receive and claim your rewards automatically</p>
        </div>

        <div className="feature-card">
          <h3>Secure Platform</h3>
          <p>Built on Ethereum blockchain with smart contract security</p>
        </div>
      </div>

      <style>{`
        .home {
          padding: 2rem 0;
          text-align: center;
        }

        .hero {
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border-radius: 10px;
          margin-bottom: 3rem;
        }

        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }

        .feature-card {
          background: var(--card-background);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-card h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Home;