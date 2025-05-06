import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const API_BASE = "https://sky-pineapple-trumpet.glitch.me";

function AddCourse({ onCourseCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const [credits, setCredits] = useState('');
  const [teacher, setTeacher] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newCourse = {
      name,
      description,
      subjectArea,
      credits,
      teacher,
    };
  
    try {
      const response = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });
  
      if (!response.ok) throw new Error('Failed to add course');
  
      const createdCourse = await response.json();
      onCourseCreated(createdCourse);
  
      setName('');
      setDescription('');
      setSubjectArea('');
      setCredits('');
      setTeacher('');
  
      navigate('/');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('There was an error adding the course');
    }
  };
  
  

  return (
    <div className="add-course-container">
      <h2 className="course-list-title">Add a New Course</h2>
      <form className="add-course-form" onSubmit={handleSubmit}>
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

        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default AddCourse;
