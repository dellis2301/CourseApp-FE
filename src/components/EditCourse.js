import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const API_BASE = "https://sky-pineapple-trumpet.glitch.me";

function EditCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState({
    name: '',
    description: '',
    subjectArea: '',
    credits: '',
    teacher: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/courses/${id}`);
        if (!response.ok) throw new Error('Course not found');
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedCourse = {
        ...course,
        credits: Number(course.credits),
      };

      const response = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) throw new Error('Failed to update course');

      navigate('/');
    } catch (error) {
      setError('There was an error updating the course');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit} className="add-course-form">
        <div>
          <label>Course Name</label>
          <input
            type="text"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Subject Area</label>
          <input
            type="text"
            value={course.subjectArea}
            onChange={(e) => setCourse({ ...course, subjectArea: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Credits</label>
          <input
            type="number"
            value={course.credits}
            onChange={(e) => setCourse({ ...course, credits: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Teacher</label>
          <input
            type="text"
            value={course.teacher}
            onChange={(e) => setCourse({ ...course, teacher: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Course</button>
      </form>
    </div>
  );
}

export default EditCourse;
