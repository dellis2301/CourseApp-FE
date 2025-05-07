// Helper function to check if the user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;  // Return true if token exists, false otherwise
};

// Helper function to get the user's role from the token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;  // If there's no token, return null

  const decoded = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT
  return decoded.role;  // Return the role from the decoded token
};

// Helper function to check if the user is a teacher
export const isTeacher = () => {
  const role = getUserRole();
  return role === 'teacher';  // Check if the role is teacher
};
