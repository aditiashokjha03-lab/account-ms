import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null; // Don't show navbar if not logged in

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem',
      background: '#333',
      color: '#fff'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Dashboard</Link>
        {/* <Link to="/transfer" style={{ color: '#fff', textDecoration: 'none' }}>Send Money</Link> */}
      </div>
      <div>
        <span style={{ marginRight: '15px' }}>Hi, {user?.name}</span>
        <button onClick={logout} style={{ background: 'red', color: 'white', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
