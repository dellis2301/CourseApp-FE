import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './authUtils';

const ProtectedRoute = ({ element, ...rest }) => {
  if (!isAuthenticated()) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
