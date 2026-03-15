import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SendMoney = () => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!receiverEmail || !amount || amount <= 0) {
      setError('Please provide a valid email and amount.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/account/transfer', {
        receiverEmail: receiverEmail.trim(),
        amount: Number(amount)
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="card text-center">
          <h2 className="text-success">Success!</h2>
          <p className="mt-4">₹{Number(amount).toLocaleString()} sent to {receiverEmail}</p>
          <p className="text-muted text-sm mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 className="text-center mb-4">Send Money</h1>

      {error && <p className="text-error text-center mb-4">{error}</p>}

      <form onSubmit={handleTransfer}>
        <div className="joint-grid">
          {/* Header Row */}
          <div className="joint-row joint-header">
            <div className="joint-cell" style={{ flex: '2' }}>Receiver Email</div>
            <div className="joint-cell">Amount (₹)</div>
            <div className="joint-cell" style={{ flex: '0.8', textAlign: 'center' }}>Action</div>
          </div>

          {/* Input Row */}
          <div className="joint-row">
            <div className="joint-cell" style={{ flex: '2' }}>
              <input
                type="email"
                placeholder="Enter recipient email"
                className="joint-input"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                required
              />
            </div>
            <div className="joint-cell">
              <input
                type="number"
                placeholder="0"
                className="joint-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="joint-cell" style={{ flex: '0.8', display: 'flex', justifyContent: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? '...' : 'Transfer'}
              </button>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
};

export default SendMoney;
