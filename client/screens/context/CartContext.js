import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart with unique ID for each cart item
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item._id === product._id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + product.quantity
        };
        return newItems;
      } else {
        // Add new product with a unique cart item ID
        return [...prevItems, {
          ...product,
          cartItemId: `${product._id}-${Date.now()}` // Create unique ID
        }];
      }
    });
  };

  // Increase quantity of item in cart
  const increaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.cartItemId === itemId || item._id === itemId)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity of item in cart
  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.cartItemId === itemId || item._id === itemId) && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Delete item from cart
  const deleteProduct = (itemId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.cartItemId !== itemId && item._id !== itemId)
    );
  };
  const clearCart = () => {
    setCartItems([]);
  };
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      deleteProduct,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};