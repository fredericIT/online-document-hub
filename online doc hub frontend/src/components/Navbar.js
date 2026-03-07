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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              <svg className="h-8 w-8 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Document Hub
            </Link>
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link to="/documents" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Documents</Link>
                <Link to="/upload" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Upload</Link>
                {user.roles?.some(r => r.name === 'ROLE_ADMIN') && (
                  <Link to="/admin" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin</Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-inner">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-danger px-3 py-1.5 text-xs">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;