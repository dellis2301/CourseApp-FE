import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCourse({ onCourseCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [credits, setCredits] = useState('');
  const [teacher, setTeacher] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCourse = {
      title,
      description,
      subject,
      credits,
      teacher,
    };

    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) throw new Error('Failed to add course');

      const createdCourse = await response.json();
      onCourseCreated(createdCourse);

      setTitle('');
      setDescription('');
      setSubject('');
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
        <label>Course Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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
