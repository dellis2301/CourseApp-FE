// Helper function to check if the user is logged in
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  };
  
  // Helper function to check if the user is a teacher
  export const isTeacher = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return decoded.role === 'teacher'; // Check if role is teacher
  };
  