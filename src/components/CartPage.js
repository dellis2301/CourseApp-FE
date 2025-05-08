import React from 'react';
import { useCart } from './CartContext'; // Fixed import path

function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map(course => (
            <li key={course._id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <button onClick={() => removeFromCart(course._id)}>Remove from Cart</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
