import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from './authUtils';

const ProtectedRoute = ({ element, requiredRoles, ...rest }) => {
  const userRole = getUserRole(); // Get user role from the token
  
  console.log("User role:", userRole); // Add this for debugging
  console.log("Required roles:", requiredRoles); // Add this for debugging

  // If the user is not authenticated, redirect to login
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  // If requiredRoles is an array, check if userRole is included in it
  if (Array.isArray(requiredRoles) && !requiredRoles.includes(userRole)) {
    console.log("Role mismatch - redirecting to home");
    return <Navigate to="/" />;
  }

  // If requiredRoles is a string, check if userRole matches it
  if (typeof requiredRoles === 'string' && requiredRoles !== userRole) {
    console.log("Role mismatch - redirecting to home");
    return <Navigate to="/" />;
  }

  // If the user is authenticated and has the correct role, render the requested component
  return element; // Render the element directly
};

export default ProtectedRoute;


