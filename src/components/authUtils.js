
// Helper function to check if the user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  } catch (err) {
    console.error('Invalid token in isAuthenticated():', err);
    return false;
  }
};

// Helper function to get the user's role from the token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded token:', decoded); 
    return decoded?.role || 'user';  
  } catch (err) {
    console.error('Error decoding token in getUserRole():', err);
    return null;
  }
};




export const isTeacher = () => getUserRole() === 'teacher';
