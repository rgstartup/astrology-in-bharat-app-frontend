"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { loadRazorpay } from "@/lib/razorpay";
import { useRouter } from "next/navigation";
import { useClientAuth, api } from "@repo/ui";

const CartModal = () => {
  const {
    cart,
    removeFromCart,
    cartTotal,
    closeCart,
    isCartOpen,
    clearCart,
    addToHistory,
  } = useCart();
  const { isClientAuthenticated, clientBalance, refreshBalance, clientUser } = useClientAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "razorpay">("wallet");
  const [shippingAddress, setShippingAddress] = useState({
    street: "123 Cosmic Way",
    city: "New Delhi",
    state: "Delhi",
    zip: "110001",
    country: "India"
  });
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!isClientAuthenticated) {
      alert("Please login to place an order");
      router.push("/sign-in");
      closeCart();
      return;
    }

    setLoading(true);

    if (paymentMethod === "wallet") {
      if (clientBalance < cartTotal) {
        alert("Insufficient wallet balance. Please top up your wallet.");
        setLoading(false);
        return;
      }

      const [res, error] = await api.post<any>("/orders", {
        payment_method: "wallet",
        shipping_address: shippingAddress,
      });

      if (error) {
        console.error("Checkout error:", error);
        alert((error as any)?.message || "Something went wrong during checkout");
        setLoading(false);
        return;
      }

      const savedOrder = res;
      const orderData = {
        id: savedOrder.id || `ORDER_${Date.now()}`,
        items: cart,
        total: cartTotal,
        date: new Date().toISOString(),
        status: "Paid",
      };
      addToHistory(orderData);
      await refreshBalance();
      clearCart();
      closeCart();
      router.push("/orders");
      setLoading(false);
      return;
    }

    // Razorpay Flow
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // Mock Options for Razorpay - In a real app, we'd call backend to create a pending order first
    const options = {
      key: "rzp_test_1234567890", // Mock Key
      amount: cartTotal * 100, // Amount in paise
      currency: "INR",
      name: "Astrology in Bharat",
      description: "Purchase of Astrology Products",
      image: "/images/web-logo.png",
      handler: async function (response: any) {
        // In a real app, we'd verify payment and create/update order on backend
        const [_, error] = await api.post("/orders", {
          payment_method: "razorpay",
          shipping_address: shippingAddress,
          razorpay_payment_id: response.razorpay_payment_id
        });

        if (error) {
          alert("Order created but payment verification pending.");
          router.push("/orders");
          return;
        }

        const orderData = {
          id: response.razorpay_payment_id || `ORDER_${Date.now()}`,
          items: cart,
          total: cartTotal,
          date: new Date().toISOString(),
          status: "Paid",
        };
        addToHistory(orderData);
        clearCart();
        closeCart();
        router.push("/orders");
      },
      prefill: {
        name: clientUser?.name || "Test User",
        email: clientUser?.email || "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#fd6410",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-bounce-in">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-theme-orange rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Processing Payment
          </h3>
          <p className="text-gray-500 text-sm">
            Securely connecting to Razorpay Gateway...
          </p>
          <img
            src="/images/razorpay-logo.png"
            alt="Razorpay"
            className="h-6 mx-auto mt-6 opacity-50"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-pl">My Cart ({cart.length})</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-red-500 p-2"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <i className="fa-solid fa-cart-shopping text-6xl mb-4 opacity-50"></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 border rounded-xl hover:shadow-md transition bg-white"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-theme-orange font-bold">₹{item.price}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50 space-y-4">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className={`py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                    paymentMethod === "wallet"
                      ? "border-theme-orange bg-orange-50 text-theme-orange"
                      : "border-gray-100 bg-white text-gray-500"
                  }`}
                >
                  <i className="fa-solid fa-wallet"></i>
                  Wallet
                </button>
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                    paymentMethod === "razorpay"
                      ? "border-theme-orange bg-orange-50 text-theme-orange"
                      : "border-gray-100 bg-white text-gray-500"
                  }`}
                >
                  <i className="fa-solid fa-credit-card"></i>
                  Razorpay
                </button>
              </div>
              {paymentMethod === "wallet" && isClientAuthenticated && (
                <div className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-dashed">
                  <span className="text-gray-500">Available Balance:</span>
                  <span className={`font-bold ${clientBalance >= cartTotal ? "text-green-600" : "text-red-500"}`}>
                    ₹{clientBalance.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-theme-orange text-white rounded-full font-bold hover:bg-theme-orange-dark transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <>
                  {paymentMethod === "wallet" ? "Pay with Wallet" : "Checkout with Razorpay"}{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

