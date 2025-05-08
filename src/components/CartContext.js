import React, { createContext, useState, useContext } from 'react';

// Create a Context for the Cart
const CartContext = createContext();

// Custom hook to use the Cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component to wrap your app with cart functionality
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add course to the cart
  const addToCart = (course) => {
    setCart((prevCart) => [...prevCart, course]);
  };

  // Remove course from the cart by ID
  const removeFromCart = (courseId) => {
    setCart((prevCart) => prevCart.filter((course) => course._id !== courseId));
  };

  // Check if course is in the cart
  const isInCart = (courseId) => {
    return cart.some((course) => course._id === courseId);
  };

  return (
    <CartContext.Provider value={{ addToCart, removeFromCart, isInCart, cart }}>
      {children}
    </CartContext.Provider>
  );
};
