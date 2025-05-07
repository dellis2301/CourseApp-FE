import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || "https://sky-pineapple-trumpet.glitch.me";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginData = { username, password };

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      
  

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid login');
        return;
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);


      // Decode the token to get user role
      const decoded = JSON.parse(atob(data.token.split('.')[1]));
      const userRole = decoded.role;

      // Save role to localStorage
      localStorage.setItem('role', userRole);

      // Redirect based on role
      if (userRole === 'teacher') {
        navigate('/');  // Redirect to teacher dashboard or home
      } else if (userRole === 'student') {
        navigate('/student-dashboard');  // Redirect to student dashboard (or other page)
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
