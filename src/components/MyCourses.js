import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view your courses.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('https://sky-pineapple-trumpet.glitch.me/api/courses/my-courses', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure the token is passed correctly
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || 'Failed to fetch courses');
        } else {
          const data = await res.json();
          console.log('Courses:', data);
          setMyCourses(data); // Assuming data is an array of courses
        }
      } catch (err) {
        setError('Error fetching courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);  // Empty dependency array to fetch courses on mount

  if (loading) {
    return <p>Loading your courses...</p>;
  }

  return (
    <div className="my-courses">
      <h2>Your Enrolled Courses</h2>
      {error && <p>{error}</p>}
      {myCourses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <ul>
          {myCourses.map((course) => (
            <li key={course._id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p><strong>Subject:</strong> {course.subjectArea}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
              <Link to={`/view-course/${course._id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCourses;
