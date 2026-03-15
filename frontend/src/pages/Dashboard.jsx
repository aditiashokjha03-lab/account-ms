import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/account/balance');
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Welcome Section */}
      <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', border: 'none' }}>
          Welcome, {user?.name}
        </h1>
      </div>

      {/* Balance Panel */}
      <div 
        style={{ 
          background: '#f1f5f9', 
          padding: '2.5rem', 
          borderRadius: '16px', 
          maxWidth: '500px', 
          margin: '0 auto 2.5rem auto',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Balance
        </p>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
          ₹{loading ? '...' : Number(balance).toLocaleString()}
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Link to="/send-money" className="card text-center" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Send Money</h3>
          <p className="text-muted mt-2 text-sm">Transfer funds</p>
        </Link>

        <Link to="/statement" className="card text-center" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Account Statement</h3>
          <p className="text-muted mt-2 text-sm">Transaction history</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
