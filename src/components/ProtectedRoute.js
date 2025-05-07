import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './authUtils';

const ProtectedRoute = ({ element, requiredRole }) => {
  const userRole = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;

