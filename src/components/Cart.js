import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // Import the Cart context

const Cart = () => {
  const [userRole, setUserRole] = useState(null); // To store user role
  const { cart, removeFromCart } = useCart(); // Using the Cart context
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem('role'); // Assuming role is stored in localStorage
    setUserRole(storedRole);
  }, []);

  // Ensure only students can access the cart
  if (userRole !== 'student') {
    return <p>You do not have access to the cart.</p>;
  }

  // Handle the checkout functionality
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
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="cart-items">
          {cart.map(course => (
            <div className="cart-item" key={course._id}>
              <span>{course.name}</span>
              <div className="item-actions">
                <button onClick={() => removeFromCart(course._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        {cart.length > 0 && (
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;

