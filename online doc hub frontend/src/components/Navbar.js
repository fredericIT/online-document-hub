import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      padding: '1rem', 
      backgroundColor: '#333', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          Document Hub
        </Link>
        {user && (
          <>
            <Link to="/documents" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
              Documents
            </Link>
            <Link to="/upload" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
              Upload
            </Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
                Admin
              </Link>
            )}
          </>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Welcome, {user.username}</span>
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
