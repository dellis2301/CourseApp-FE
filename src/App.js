import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import AddCourse from './components/AddCourse';
import CourseList from './components/CourseList';
import ViewCourse from './components/ViewCourse';
import EditCourse from './components/EditCourse';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || "https://sky-pineapple-trumpet.glitch.me";

function App() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load token and decode user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const isExpired = decoded.exp * 1000 < Date.now(); // Check token expiration
        if (isExpired) {
          localStorage.removeItem('token'); // Remove expired token
          setUser(null); // Reset user state
          navigate('/login'); // Redirect to login
          return;
        }
        setUser({
          username: decoded.username,
          role: decoded.role,
        });
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  // Fetch courses with the token in the headers
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCourses([]); // No token, empty courses
          return;
        }
        const res = await fetch(`${API_BASE}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          console.warn('Course fetch failed:', error);
          setCourses([]); // fallback to empty array
          return;
        }

        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  // Handle course actions (create, update, delete)
  const handleCourseCreated = (newCourse) => {
    setCourses((prev) => [...prev, newCourse]);
    navigate('/');
  };

  const handleCourseUpdated = (updatedCourse) => {
    const updatedCourses = courses.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    );
    setCourses(updatedCourses);
    navigate('/');
  };

  const handleCourseDeleted = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert('Unauthorized. Please log in as a teacher.');
        return;
      }

      if (res.ok) {
        setCourses((prev) => prev.filter((course) => course._id !== id));
      } else {
        console.error('Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  // Authentication helpers
  const isAuthenticated = () => !!user;
  const getUserRole = () => user?.role || null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated() && <li><button onClick={handleLogout}>Logout</button></li>}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<CourseList courses={courses} onDelete={handleCourseDeleted} />} />
        <Route path="/add-course" element={<AddCourse onCourseCreated={handleCourseCreated} />} />
        <Route path="/view-course/:id" element={<ViewCourse />} />
        <Route path="/edit-course/:id" element={<EditCourse onCourseUpdated={handleCourseUpdated} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/protected" element={<ProtectedRoute />} />
      </Routes>
    </div>
  );
}

export default App;
