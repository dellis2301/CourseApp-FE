import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext'; // Import the useCart hook

function CourseList({ courses = [], onDelete, isTeacher }) {
  const { addToCart, removeFromCart, isInCart } = useCart(); // Access cart functions
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courses) {
      setError('Failed to load courses.');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [courses]);

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course?.name?.toLowerCase().includes(term) ||
      course?._id?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="course-list-container">
      <h2 className="course-list-title">All Courses</h2>

      <input
        type="text"
        placeholder="Search by course name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          borderRadius: '5px',
          border: '1px solid #ddd',
          fontSize: '1rem',
        }}
      />

      {loading && <p>Loading courses...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && !Array.isArray(courses) && (
        <p>Error loading courses. Please make sure you're logged in.</p>
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <p>No matching courses found.</p>
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <ul className="course-list">
          {filteredCourses.map((course) => (
            <li key={course?._id} className="course-item">
              <h3 className="course-title">{course?.name}</h3>
              <p className="course-description">{course?.description}</p>
              <p><strong>Subject:</strong> {course?.subjectArea}</p>
              <p><strong>Credits:</strong> {course?.credits}</p>
              <p><strong>Teacher:</strong> {course?.teacher}</p>
              <div className="course-actions">
                <Link to={`/view-course/${course?._id}`} className="view-link">View Details</Link>

                {!isTeacher && (
                  <>
                    {!isInCart(course._id) ? (
                      <button onClick={() => addToCart(course)} className="add-to-cart-btn">
                        Add to Cart
                      </button>
                    ) : (
                      <button onClick={() => removeFromCart(course._id)} className="remove-from-cart-btn">
                        Remove from Cart
                      </button>
                    )}
                  </>
                )}

                {isTeacher && (
                  <>
                    | <Link to={`/edit-course/${course?._id}`} className="edit-link">Edit</Link> 
                    | <button onClick={() => onDelete(course?._id)} className="delete-btn">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;
