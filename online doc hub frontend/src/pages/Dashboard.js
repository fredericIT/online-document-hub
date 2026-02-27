import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authService';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Document Hub, {user?.username}!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Manage your documents with ease
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          padding: '2rem', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>📄 Upload Document</h3>
          <p>Upload new documents to your repository</p>
          <Link 
            to="/upload"
            style={{ 
              display: 'inline-block', 
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Upload Now
          </Link>
        </div>
        
        <div style={{ 
          padding: '2rem', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>📁 My Documents</h3>
          <p>View and manage your uploaded documents</p>
          <Link 
            to="/documents"
            style={{ 
              display: 'inline-block', 
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            View Documents
          </Link>
        </div>
        
        {user?.role === 'ADMIN' && (
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: '#fff3cd'
          }}>
            <h3>⚙️ Admin Panel</h3>
            <p>Manage users and system settings</p>
            <Link 
              to="/admin"
              style={{ 
                display: 'inline-block', 
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ffc107',
                color: '#212529',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
