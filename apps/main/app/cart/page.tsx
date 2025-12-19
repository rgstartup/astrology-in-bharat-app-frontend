"use client";
import ProductsCarousel from "@/components/ProductsCarousel";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Crystal Healing Bracelet",
      price: 349,
      image: "/images/product-1.webp",
      quantity: 2,
    },
    {
      id: 2,
      name: "Rose Quartz Pendant",
      price: 499,
      image: "/images/product-2.webp",
      quantity: 1,
    },
    {
      id: 3,
      name: "Rose Quartz Pendant",
      price: 499,
      image: "/images/product-2.webp",
      quantity: 1,
    },
    {
      id: 4,
      name: "Rose Quartz Pendant",
      price: 499,
      image: "/images/product-2.webp",
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="bg-cream">
      <div className="container py-5">
        {/* Title */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <i className="fas fa-shopping-cart me-2 text-dark fs-4"></i>
            <h2 className="fw-semibold mb-0">Your Shopping Cart</h2>
          </div>
          <span className="subtle-tag d-none d-md-inline">Free shipping over ₹1000</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="alert alert-info">Your cart is empty.</div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="glass p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between py-3 border-bottom"
                  >
                    {/* Image & Title */}
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                        className="me-3 rounded border"
                      />
                      <div>
                        <h6 className="mb-1 fw-semibold">{item.name}</h6>
                        <span className="text-muted small">₹{item.price}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <i className="fas fa-minus"></i>
                      </Button>
                      <Form.Control
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="mx-2 text-center border-0 fw-semibold"
                        style={{
                          width: "45px",
                          background: "#f1f3f5",
                          borderRadius: "8px",
                        }}
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="fw-semibold text-dark mx-3">
                      ₹{item.price * item.quantity}
                    </div>

                    {/* Remove */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-circle"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="col-lg-4">
              <div className="p-4 rounded shadow-sm bg-white card-surface">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-semibold mb-0">Order Summary</h4>
                  <span className="pill-badge">
                    <i className="fas fa-shield-alt"></i> Secure checkout
                  </span>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>₹{subtotal}</strong>
                  </li>
                  <li className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
                  </li>
                  <li className="d-flex justify-content-between mb-2">
                    <span>Tax (10%)</span>
                    <strong>₹{tax.toFixed(0)}</strong>
                  </li>
                  <hr />
                  <li className="d-flex justify-content-between mb-3">
                    <span className="fw-semibold">Total</span>
                    <span className="fw-semibold fs-5">₹{grandTotal.toFixed(0)}</span>
                  </li>
                </ul>
                <Button
                  className="w-100 text-white fw-semibold py-2"
                  style={{
                    background: "linear-gradient(45deg, #d08830, #daa23e)",
                    border: "none",
                    boxShadow: "0 12px 30px rgba(218,162,62,0.3)",
                  }}
                >
                  Proceed to Checkout <i className="fas fa-arrow-right ms-2"></i>
                </Button>
                <p className="text-muted small mt-3 mb-0">
                  By placing your order, you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Products */}
        <div className="mt-5">
          <h2 className="fw-semibold mb-3">You may also like</h2>
          <ProductsCarousel />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
