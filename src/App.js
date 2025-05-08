import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import AddCourse from './components/AddCourse';
import CourseList from './components/CourseList';
import ViewCourse from './components/ViewCourse';
import EditCourse from './components/EditCourse';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './components/CartContext';
import Cart from './components/Cart'; // Import the Cart component
import MyCourses from './components/MyCourses'; // Add this import

import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || "https://sky-pineapple-trumpet.glitch.me";

function App() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCourses([]);
          return;
        }

        const res = await fetch(`${API_BASE}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          console.warn('Course fetch failed:', error);
          setCourses([]);
          return;
        }

        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const isAuthenticated = () => !!user;
  const isTeacher = () => user?.role === 'teacher';

  return (
    <CartProvider>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Courses</Link></li>
            <li><Link to="/cart">View Cart</Link></li> {/* Link to Cart page */}
            {isAuthenticated() && isTeacher() && <li><Link to="/add-course">Add Course</Link></li>}
            {!isAuthenticated() && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/my-courses">My Courses</Link></li>
              </>
            )}
            {isAuthenticated() && (
              <li>
                <button onClick={handleLogout}>Logout ({user.username})</button>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <CourseList
                courses={courses}
                onDelete={isTeacher() ? handleCourseDeleted : null}
                isTeacher={isTeacher()}  
              />
            }
          />
          <Route
            path="/add-course"
            element={
              <ProtectedRoute requiredRole="teacher" element={<AddCourse onCourseCreated={handleCourseCreated} />} />
            }
          />
          <Route
            path="/edit-course/:id"
            element={
              <ProtectedRoute requiredRoles="teacher" element={<EditCourse onCourseUpdated={handleCourseUpdated} />} />
            }
          />
          <Route path="/view-course/:id" element={<ViewCourse />} />
          <Route path="/cart" element={<Cart />} /> {/* Cart route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-courses" element={<MyCourses />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;

