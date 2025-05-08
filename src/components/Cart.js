import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items from local storage or state
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);
  }, []);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to checkout.');
        return;
      }

      const courseIds = cart.map(course => course._id); // Extract the course IDs

      const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/courses/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseIds }), // Send course IDs to the backend
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Error: ' + error.message);
        return;
      }

      // After successful checkout, redirect to "MyCourses"
      alert('Successfully enrolled in selected courses!');
      navigate('/my-courses');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to checkout. Please try again.');
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cart.map(course => (
          <li key={course._id}>
            <span>{course.name}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;
