import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const userRoleNames = user.roles ? user.roles.map(role => role.name) : [];
    const hasAnyRole = roles.some(role => userRoleNames.includes(role));
    
    if (!hasAnyRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default PrivateRoute;