"use client";
import React from "react";
import ProductsCarousel from "@/components/features/shop/ProductsCarousel";
import { Button, Form } from "react-bootstrap";
import { useCartStore } from "@/store/useCartStore"; // Changed import

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import

const CartPage: React.FC = () => {
  const router = useRouter();
  const { isClientAuthenticated } = useAuthStore(); // Changed usage
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isLoading
  } = useCartStore(); // Changed usage

  React.useEffect(() => {
    // If not authenticated, redirect to login
    if (!isClientAuthenticated) {
      router.push("/sign-in");
    }
  }, [isClientAuthenticated, router]);

  // If redirecting, show nothing or spinner
  if (!isClientAuthenticated) {
    return null;
  }

  const handleQuantityChange = async (id: number, delta: number) => {
    // Find the item to get current quantity
    const item = cartItems.find(i => i.productId === id);
    if (item) {
      await updateQuantity(id, item.quantity + delta);
    }
  };

  const handleRemoveItem = async (id: number) => {
    await removeFromCart(id);
  };

  const subtotal = cartTotal;
  const shipping = 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + shipping + tax;

  if (isLoading && cartItems.length === 0) {
    return <div className="container py-5">Loading cart...</div>;
  }

  return (
    <div>
      <div className="container py-5">
        {/* Title */}
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-shopping-cart me-2 text-dark fs-4"></i>
          <h2 className="fw-semibold mb-0">Your Shopping Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="alert alert-info">Your cart is empty.</div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="bg-white rounded shadow-sm p-4">
                {cartItems.map((item) => {
                  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
                  const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

                  // Handle property mismatch (backend might send 'image' or 'imageUrl')
                  const productImg = item.product?.image || (item.product as any)?.imageUrl;

                  const imageUrl = productImg
                    ? productImg.startsWith("http")
                      ? productImg
                      : productImg.startsWith("/uploads/")
                        ? `${cleanApiUrl}${productImg}`
                        : productImg.startsWith("/")
                          ? productImg
                          : `/uploads/${productImg}`
                    : "/images/image-not-found.png";

                  return (
                    <div
                      key={item.productId || item.product?.id}
                      className="d-flex align-items-center justify-content-between py-3 border-bottom"
                    >
                      {/* Image & Title */}
                      <div className="d-flex align-items-center">
                        <img
                          src={imageUrl}
                          alt={item.product?.name || "Product"}
                          onError={(e) => (e.currentTarget.src = "/images/image-not-found.png")}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                          className="me-3 rounded border"
                        />
                        <div>
                          <h6 className="mb-1 fw-semibold">{item.product?.name || "Product Name"}</h6>
                          <span className="text-muted small">₹{item.product?.sale_price || item.product?.price}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleQuantityChange(item.productId || item.product?.id || 0, -1)}
                          disabled={isLoading}
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
                          onClick={() => handleQuantityChange(item.productId || item.product?.id || 0, 1)}
                          disabled={isLoading}
                        >
                          <i className="fas fa-plus"></i>
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="fw-semibold text-dark mx-3">
                        ₹{(item.product?.sale_price || item.product?.price || 0) * item.quantity}
                      </div>

                      {/* Remove */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => handleRemoveItem(item.productId || item.product?.id || 0)}
                        disabled={isLoading}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="col-lg-4">
              <div className="p-4 rounded shadow-sm bg-white">
                <h4 className="fw-semibold mb-3">Order Summary</h4>
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
                    <span className="fw-semibold fs-5">
                      ₹{grandTotal.toFixed(0)}
                    </span>
                  </li>
                </ul>
                <Button
                  variant="warning"
                  className="w-100 text-white fw-semibold py-2"
                  style={{ background: "#d9a03d", border: "none" }}
                  onClick={() => router.push("/checkout?type=order")}
                >
                  Proceed to Checkout{" "}
                  <i className="fas fa-arrow-right ms-2"></i>
                </Button>
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


