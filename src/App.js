import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import AddCourse from './components/AddCourse';
import CourseList from './components/CourseList';
import ViewCourse from './components/ViewCourse';
import EditCourse from './components/EditCourse';
import './App.css';


const API_BASE = "https://sky-pineapple-trumpet.glitch.me";

function App() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseCreated = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
    navigate('/');
  };

  const handleCourseUpdated = (updatedCourse) => {
    const updatedCourses = courses.map(course =>
      course._id === updatedCourse._id ? updatedCourse : course
    );
    setCourses(updatedCourses);
    navigate('/');
  };

  const handleCourseDeleted = async (id) => {
    try {
      await fetch(`${API_BASE}/api/courses/${id}`, { method: 'DELETE' });
      setCourses(prev => prev.filter(course => course._id !== id));
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-course">Add Course</Link></li>
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
