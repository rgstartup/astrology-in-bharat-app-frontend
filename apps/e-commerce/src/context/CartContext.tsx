"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartTotal: number;
  openCart: () => void;
  closeCart: () => void;
  isCartOpen: boolean;
  history: any[];
  addToHistory: (order: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("aib_cart");
    const savedHistory = localStorage.getItem("aib_history");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("aib_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("aib_history", JSON.stringify(history));
  }, [history]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const addToHistory = (order: any) => {
    setHistory((prev) => [order, ...prev]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isCartOpen,
        history,
        addToHistory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

