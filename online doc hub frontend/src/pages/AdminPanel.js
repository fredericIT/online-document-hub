import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>User Management</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '1rem', border: '1px solid #ddd', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '1rem', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', border: '1px solid #ddd', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '1rem', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{user.id}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{user.username}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{user.email}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: user.role === 'ADMIN' ? '#ffc107' : '#28a745',
                        color: user.role === 'ADMIN' ? '#212529' : 'white',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div>
        <h3>System Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            <h4>Total Users</h4>
            <p style={{ fontSize: '2rem', margin: '0', color: '#007bff' }}>{users.length}</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            <h4>Admin Users</h4>
            <p style={{ fontSize: '2rem', margin: '0', color: '#ffc107' }}>
              {users.filter(user => user.role === 'ADMIN').length}
            </p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            <h4>Regular Users</h4>
            <p style={{ fontSize: '2rem', margin: '0', color: '#28a745' }}>
              {users.filter(user => user.role === 'USER').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
