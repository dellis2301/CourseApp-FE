import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isTeacher } from './authUtils';

const TeacherRoute = ({ element, ...rest }) => {
  if (!isTeacher()) {
    // Redirect to home or other page if the user is not a teacher
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />;
};

export default TeacherRoute;
