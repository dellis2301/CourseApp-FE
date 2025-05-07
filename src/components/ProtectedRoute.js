import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './authUtils'; // Assuming you have an authUtils file for utility functions

const ProtectedRoute = ({ element, requiredRole, ...rest }) => {
  const userRole = getUserRole(); // Get the role of the authenticated user

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // If the user doesn't have the required role (e.g., 'teacher'), redirect to home
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />; // Or redirect to an error page, depending on your logic
  }

  // If the user is authenticated and has the correct role, render the requested component
  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;

