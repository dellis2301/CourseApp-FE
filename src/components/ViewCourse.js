import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ViewCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
        navigate('/'); // Redirect to courses list if an error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      navigate('/'); // After deletion, go back to the course list
    } catch (error) {
      alert('There was an error deleting the course');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="view-course-container">
      <div className="view-course-card">
        <h2 className="course-title">{course.title}</h2>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Subject:</strong> {course.subject}</p>
        <p><strong>Credits:</strong> {course.credits}</p>
        <p><strong>Teacher:</strong> {course.teacher}</p>

        <div className="view-course-actions">
          <button onClick={() => navigate('/')} className="btn">← Back to Courses</button>
          <button onClick={handleDelete} className="btn delete">Delete Course</button>
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;


