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
  const [loading, setLoading] = useState(true);  // New state for loading
  const [error, setError] = useState(null);      // New state for error
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
      setLoading(true);    // Set loading to true when fetching starts
      setError(null);      // Reset error state

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCourses([]);
          setLoading(false);  // Set loading to false after the fetch completes
          return;
        }

        const res = await fetch(`${API_BASE}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          console.warn('Course fetch failed:', error);
          setCourses([]);
          setLoading(false);  // Set loading to false after the fetch completes
          setError('Failed to load courses');
          return;
        }

        const data = await res.json();
        console.log('Fetched courses:', data);
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);  // Set loading to false after the fetch completes
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCourses([]);
        setLoading(false);  // Set loading to false after the fetch completes
        setError('Error fetching courses');
      }
    };

    fetchCourses();
  }, []); // Empty dependency array means this runs once when the component mounts

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
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Courses</Link></li>
          {isAuthenticated() && isTeacher() && <li><Link to="/add-course">Add Course</Link></li>}
          {!isAuthenticated() && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {isAuthenticated() && (
            <li>
              <button onClick={handleLogout}>Logout ({user.username})</button>
            </li>
          )}
        </ul>
      </nav>

      {/* Display loading or error message */}
      {loading && <p>Loading courses...</p>}
      {error && <p>{error}</p>}

      <Routes>
        <Route
          path="/"
          element={
            <CourseList
              courses={courses}
              onDelete={isTeacher() ? handleCourseDeleted : null}
            />
          }
        />
        {isAuthenticated() && isTeacher() && (
          <>
            <Route path="/add-course" element={<AddCourse onCourseCreated={handleCourseCreated} />} />
            <Route path="/edit-course/:id" element={<EditCourse onCourseUpdated={handleCourseUpdated} />} />
          </>
        )}
        <Route path="/view-course/:id" element={<ViewCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/protected" element={<ProtectedRoute />} />
      </Routes>
    </div>
  );
}

export default App;

