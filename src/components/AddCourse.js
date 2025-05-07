import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || "https://sky-pineapple-trumpet.glitch.me";

function AddCourse({ onCourseCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const [credits, setCredits] = useState('');
  const [teacher, setTeacher] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newCourse = {
      name,
      description,
      subjectArea,
      credits,
      teacher,
    };

    try {
      const token = localStorage.getItem('token');  // Check if the user is logged in
      if (!token) {
        setError('You must be logged in to add a course');
        navigate('/login');  // Redirect to login if no token
        return;
      }

      const response = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Pass token in the Authorization header
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add course');
        return;
      }

      const createdCourse = await response.json();
      onCourseCreated(createdCourse);  // Pass newly created course to parent
      setName('');
      setDescription('');
      setSubjectArea('');
      setCredits('');
      setTeacher('');

      navigate('/');  // Redirect to course list after adding the course
    } catch (error) {
      console.error('Error adding course:', error);
      setError('There was an error adding the course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-container">
      <h2 className="course-list-title">Add a New Course</h2>
      <form className="add-course-form" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>Course Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Subject Area</label>
        <input
          type="text"
          value={subjectArea}
          onChange={(e) => setSubjectArea(e.target.value)}
          required
        />

        <label>Credits</label>
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          required
        />

        <label>Teacher</label>
        <input
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
