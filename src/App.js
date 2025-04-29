import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';  // Import Link for client-side navigation
import AddCourse from './components/AddCourse';
import CourseList from './components/CourseList';
import ViewCourse from './components/ViewCourse';
import EditCourse from './components/EditCourse';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch courses from backend on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    fetchCourses();
  }, []);

  // Add a new course to backend
  const handleCourseCreated = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
    navigate('/');
  };

  // Update course in state
  const handleCourseUpdated = (updatedCourse) => {
    const updatedCourses = courses.map(course =>
      course._id === updatedCourse._id ? updatedCourse : course
    );
    setCourses(updatedCourses);
    navigate('/');
  };

  // Delete course from backend and state
  const handleCourseDeleted = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE' });
      setCourses(prev => prev.filter(course => course._id !== id));
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li> {/* Use Link instead of <a> */}
          <li><Link to="/add-course">Add Course</Link></li> {/* Use Link instead of <a> */}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<CourseList courses={courses} onDelete={handleCourseDeleted} />} />
        <Route path="/add-course" element={<AddCourse onCourseCreated={handleCourseCreated} />} />
        <Route path="/view-course/:id" element={<ViewCourse courses={courses} />} />
        <Route path="/edit-course/:id" element={<EditCourse courses={courses} onCourseUpdated={handleCourseUpdated} />} />
      </Routes>
    </div>
  );
}

export default App;
