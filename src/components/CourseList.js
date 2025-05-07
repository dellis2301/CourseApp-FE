import React from 'react';
import { Link } from 'react-router-dom';

function CourseList({ courses = [], onDelete }) {
  // Handle cases where `courses` is not an array or fails to load properly
  const isLoggedOut = !Array.isArray(courses);

  return (
    <div className="course-list-container">
      <h2 className="course-list-title">All Courses</h2>

      {isLoggedOut && (
        <p>Error loading courses. Please make sure you're logged in.</p>
      )}

      {!isLoggedOut && courses.length === 0 && (
        <p>No courses available. Please add some courses.</p>
      )}

      {!isLoggedOut && courses.length > 0 && (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course?._id} className="course-item">
              <h3 className="course-title">{course?.name}</h3>
              <p className="course-description">{course?.description}</p>
              <p><strong>Subject:</strong> {course?.subjectArea}</p>
              <p><strong>Credits:</strong> {course?.credits}</p>
              <p><strong>Teacher:</strong> {course?.teacher}</p>
              <div className="course-actions">
                <Link to={`/view-course/${course?._id}`} className="view-link">View Details</Link> | 
                <Link to={`/edit-course/${course?._id}`} className="edit-link">Edit</Link> | 
                <button onClick={() => onDelete(course?._id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;