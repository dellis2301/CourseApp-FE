import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = "https://sky-pineapple-trumpet.glitch.me"; // Add your API base URL

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default to student, or handle accordingly
  const [error, setError] = useState(''); // Initialize error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are being passed correctly
    if (!email || !password || !role) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }), // Ensure this is correctly passed
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Something went wrong');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store the token
      // You can also save user details here if needed
      navigate('/'); // Redirect to home or another protected route
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Something went wrong');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email} // Use email here, not username
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
