import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AccountStatement = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatement();
  }, []);

  const fetchStatement = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/account/statement');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch statement', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="section">
        <h1 className="text-center mb-4">Account Statement</h1>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Transaction Type</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Amount (₹)</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>From</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>To</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>
                    <span className="text-muted">Loading transactions...</span>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>
                    <span className="text-muted">No transactions found.</span>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isDebit = tx.transaction_type === 'debit';
                  const senderName = tx.sender?.name || 'System';
                  const receiverName = tx.receiver?.name || 'System';

                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: isDebit ? 'var(--error)' : 'var(--success)'
                          }}
                        >
                          {tx.transaction_type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: isDebit ? 'var(--error)' : 'var(--success)'
                          }}
                        >
                          {isDebit ? '-' : '+'}₹{Number(tx.amount).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="text-muted">{senderName}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="text-muted">{receiverName}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountStatement;
