"use client";
import React, { useState, useEffect, Suspense } from "react";
import { getBasePath } from "@/utils/api-config";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore"; // Changed import
import apiClient, { getClientProfile, applyCoupon } from "@/libs/api-profile";
import { toast } from "react-toastify";
import { loadRazorpay } from "@/libs/razorpay";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import

const CheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal } = useCartStore(); // Changed usage
  const { clientUser } = useAuthStore(); // Changed usage
  const [isProcessing, setIsProcessing] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [directProduct, setDirectProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [buyNowInfo, setBuyNowInfo] = useState<{ productId: string | number, quantity: number } | null>(null);

  const isOrder = searchParams.get("type") === "order";
  const astrologerName = searchParams.get("name") || "Astrologer";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const duration = searchParams.get("duration") || "15";

  // 1. Initial Logic: Capture Buy Now info from URL or SessionStorage
  useEffect(() => {
    if (isOrder) {
      const urlProductId = searchParams.get("productId");
      const urlQuantity = searchParams.get("quantity");

      if (urlProductId) {
        setBuyNowInfo({ productId: urlProductId, quantity: parseInt(urlQuantity || "1") });
      } else {
        const stored = sessionStorage.getItem('buyNowItem');
        if (stored) {
          try {
            setBuyNowInfo(JSON.parse(stored));
          } catch (e) {
            console.error("Error parsing buyNowItem:", e);
          }
        }
      }
    }
  }, [isOrder, searchParams]);

  // Calculate base total based on whether it's a direct product buy or full cart
  const baseTotal = isOrder
    ? buyNowInfo
      ? (Number(directProduct?.sale_price || directProduct?.price || 0) * buyNowInfo.quantity)
      : cartTotal
    : (parseInt(searchParams.get("total") || "300"));

  const total = Math.max(0, baseTotal - discountAmount);

  // Fetch product if it's a direct buy
  useEffect(() => {
    if (isOrder && buyNowInfo?.productId) {
      const fetchDirectProduct = async () => {
        try {
          setLoadingProduct(true);
          const baseUrl = getBasePath();
          const res = await fetch(`${baseUrl}/api/v1/products/${buyNowInfo.productId}`);
          if (res.ok) {
            const data = await res.json();
            setDirectProduct(data.data || data);
          }
        } catch (error) {
          console.error("Failed to fetch product for direct buy:", error);
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchDirectProduct();
    }
  }, [isOrder, buyNowInfo?.productId]);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.warning("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    try {
      // Use the 'type' from URL or default to 'product'/'chat'
      const sType = searchParams.get("type") || (isOrder ? 'product' : 'chat');

      const res = await applyCoupon(
        couponCode.trim(),
        baseTotal,
        sType
      );

      const data = res.data || res;
      console.log("🎟️ Coupon Response:", data);

      const disc = data.discountAmount ?? data.discount_amount ?? data.discount ?? data.value;
      const isSuccess = data.success ?? data.is_valid ?? data.isValid ?? (disc !== undefined);

      if (isSuccess && disc !== undefined) {
        setDiscountAmount(Number(disc));
        setAppliedCoupon(data.coupon || { code: couponCode });
        toast.success(data.message || `Coupon applied! You saved ₹${disc}`);
      } else {
        toast.error(data.message || "This coupon cannot be applied to this order. Check minimum order value or expiry.");
      }
    } catch (error: any) {
      console.error("Coupon Error:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  // Shipping Address State
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    zipCode: ""
  });

  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch address from profile on mount
  useEffect(() => {
    const fetchProfileAddress = async () => {
      try {
        setLoadingProfile(true);
        const profile = await getClientProfile();
        if (profile && profile.addresses && profile.addresses.length > 0) {
          const defaultAddr = profile.addresses[0];
          setAddress({
            line1: defaultAddr.line1 || "",
            line2: defaultAddr.line2 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            country: defaultAddr.country || "India",
            zipCode: defaultAddr.zipCode || ""
          });
          console.log("📍 Auto-filled address from profile:", defaultAddr);
        }
      } catch (err) {
        console.error("Failed to load profile for address:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileAddress();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    // Basic validation for shipping address if it's a product order
    if (isOrder) {
      if (!address.line1 || !address.city || !address.state || !address.zipCode) {
        toast.error("Please fill in all required shipping address fields");
        return;
      }
    }

    setIsProcessing(true);
    try {
      // 1. Load Razorpay Script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 2. Pre-create Order on Backend (if Product Order)
      let dbOrderId = null;
      if (isOrder) {
        try {
          const orderPayload = {
            shippingAddress: address,
            productId: buyNowInfo ? Number(buyNowInfo.productId) : undefined,
            quantity: buyNowInfo ? Number(buyNowInfo.quantity) : undefined,
            couponCode: appliedCoupon?.code || undefined
          };
          console.log("📦 Sending Order Payload:", orderPayload);

          const createOrderRes = await apiClient.post<any>("/order", orderPayload);
          dbOrderId = createOrderRes.data.id;

          // Clear buyNowItem if order is successfully created
          sessionStorage.removeItem('buyNowItem');
          console.log("✅ Order created in DB:", dbOrderId);
        } catch (error: any) {
          console.error("Failed to create order:", error);
          toast.error(error.response?.data?.message || "Failed to create order. Please try again.");
          setIsProcessing(false);
          return;
        }
      }

      // 3. Initiate Payment
      const orderRes = await apiClient.post<any>("/payment/orders/create", {
        amount: total,
        type: isOrder ? 'product' : 'consultation',
        couponCode: appliedCoupon?.code, // Pass coupon code to backend for tracking
        notes: {
          astrologerName,
          isOrder,
          orderId: dbOrderId, // Link razorpay order to internal DB order
          discountApplied: discountAmount
        }
      });

      const orderPayload: any = (orderRes as any)?.data ?? orderRes;
      const { id: order_id, amount, currency, key_id } = orderPayload || {};
      if (!order_id || !amount || !currency) {
        throw new Error("Invalid payment order response");
      }

      // 3. Open Razorpay Modal
      const options = {
        key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Astrology in Bharat",
        description: isOrder ? "Product Purchase" : `Consultation with ${astrologerName}`,
        order_id: order_id,
        handler: async (response: any) => {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await apiClient.post<any>("/payment/orders/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: isOrder ? address : undefined
            });

            const verifyPayload: any = (verifyRes as any)?.data ?? verifyRes;
            if (verifyPayload?.success) {
              toast.success(isOrder ? "Order placed successfully!" : "Payment successful!");

              if (isOrder) {
                router.push("/profile?tab=orders");
              } else {
                const params = new URLSearchParams({ name: astrologerName });
                router.push(`/chat?${params.toString()}`);
              }
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: clientUser?.name || "",
          email: clientUser?.email || "",
          contact: "" // Could get from profile if needed
        },
        theme: {
          color: "#fd6410",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Something went wrong with the payment.");
    } finally {
      // Don't set isProcessing false here if modal is open, handled in ondismiss or handler
    }
  };

  return (
    <>
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 text-center">
                <h1 className="mb-3">
                  Secure <span style={{ color: "#daa23e" }}>Checkout</span>
                </h1>
                <p className="text-white" style={{ fontSize: "18px" }}>
                  Complete your payment to start the session
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: "#ffe3b852" }}>
        <div className="container">
          <div className="row justify-content-center">
            {/* Order Summary */}
            <div className="col-lg-5 mb-4 d-flex flex-column gap-4">
              {/* Shipping Address - Only for Products */}
              {isOrder && (
                <div className="leftcard border-0 shadow-lg" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-4">
                    <h5 className="mb-4 fw-bold" style={{ color: "#732882" }}>
                      Shipping Address
                      {loadingProfile && <span className="spinner-border spinner-border-sm ms-2" role="status"></span>}
                    </h5>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold">Address Line 1*</label>
                        <input
                          type="text"
                          name="line1"
                          className="form-control"
                          placeholder="House No., Street Name"
                          value={address.line1}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Address Line 2</label>
                        <input
                          type="text"
                          name="line2"
                          className="form-control"
                          placeholder="Apartment, Landmark"
                          value={address.line2}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">City*</label>
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          value={address.city}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">State*</label>
                        <input
                          type="text"
                          name="state"
                          className="form-control"
                          value={address.state}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Pincode*</label>
                        <input
                          type="text"
                          name="zipCode"
                          className="form-control"
                          value={address.zipCode}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Country</label>
                        <input
                          type="text"
                          name="country"
                          className="form-control"
                          value={address.country}
                          disabled
                        />
                      </div>
                    </div>
                    <small className="text-muted mt-3 d-block">
                      <i className="fa-solid fa-truck-fast me-1"></i>
                      Your order will be delivered to this address.
                    </small>
                  </div>
                </div>
              )}

              <div
                className="leftcard border-0 shadow-lg"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-4">
                  <h5 className="mb-4 fw-bold" style={{ color: "#732882" }}>
                    Order Summary
                  </h5>

                  {isOrder ? (
                    /* Product Summary */
                    <div className="mb-3">
                      {buyNowInfo ? (
                        /* Direct Product Buy Summary */
                        directProduct ? (
                          <div className="d-flex justify-content-between mb-2 small">
                            <span>{directProduct.name} x {buyNowInfo.quantity}</span>
                            <span className="fw-semibold">₹{(Number(directProduct.sale_price || directProduct.price || 0)) * buyNowInfo.quantity}</span>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <span className="spinner-border spinner-border-sm text-secondary"></span>
                          </div>
                        )
                      ) : (
                        /* Full Cart Summary */
                        cartItems.map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between mb-2 small">
                            <span>{item.product?.name} x {item.quantity}</span>
                            <span className="fw-semibold">₹{(item.product?.sale_price || item.product?.price || 0) * item.quantity}</span>
                          </div>
                        ))
                      )}
                      <hr />
                    </div>
                  ) : (
                    /* Consultation Summary */
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "60px",
                          height: "60px",
                          border: "2px solid #daa23e",
                        }}
                      >
                        <i
                          className="fa-solid fa-user-astronaut"
                          style={{ fontSize: "24px", color: "#732882" }}
                        ></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1 fw-bold">{astrologerName}</h6>
                        <small className="text-muted">
                          Personal Consultation
                        </small>
                      </div>
                    </div>
                  )}

                  <ul className="list-group list-group-flush mb-3">
                    {!isOrder && (
                      <>
                        <li className="list-group-item d-flex justify-content-between bg-transparent px-0">
                          <span>Date</span>
                          <span className="fw-semibold">{date}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between bg-transparent px-0">
                          <span>Time</span>
                          <span className="fw-semibold">{time}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between bg-transparent px-0">
                          <span>Duration</span>
                          <span className="fw-semibold">{duration} Mins</span>
                        </li>
                      </>
                    )}
                    <li className="list-group-item bg-transparent px-0 py-3">
                      <div className="flex flex-col gap-2">
                        <label className="small fw-bold text-muted uppercase tracking-wider">Have a coupon?</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Enter Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={!!appliedCoupon || isApplying}
                          />
                          {appliedCoupon ? (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={handleRemoveCoupon}
                              type="button"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark btn-sm px-3"
                              onClick={handleApplyCoupon}
                              disabled={isApplying || !couponCode}
                              type="button"
                            >
                              {isApplying ? <span className="spinner-border spinner-border-sm"></span> : "Apply"}
                            </button>
                          )}
                        </div>
                        {appliedCoupon && (
                          <small className="text-success fw-bold animate-pulse">
                            <i className="fa-solid fa-check-circle me-1"></i>
                            Coupon Applied Successfully!
                          </small>
                        )}
                      </div>
                    </li>

                    {discountAmount > 0 && (
                      <li className="list-group-item d-flex justify-content-between bg-transparent px-0 text-success">
                        <span>Coupon Discount</span>
                        <span className="fw-semibold">-₹{discountAmount}</span>
                      </li>
                    )}

                    <li
                      className="list-group-item d-flex justify-content-between bg-transparent px-0 fw-bold fs-5 pt-3 border-top"
                      style={{ color: "#732882" }}
                    >
                      <span>Total Amount</span>
                      <span>₹{total}</span>
                    </li>
                  </ul>

                  <div
                    className="alert alert-warning"
                    role="alert"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <i className="fa-solid fa-circle-info me-2"></i>
                    {isOrder ? "Order confirmation will be sent to your email." : "Session will start automatically after payment."}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="col-lg-7">
              <div
                className="leftcard border-0 shadow-lg h-100"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-4 p-md-5">
                  <h5 className="mb-4 fw-bold" style={{ color: "#732882" }}>
                    Select Payment Method
                  </h5>

                  <div className="payment-options d-flex flex-column gap-3">
                    {/* UPI */}
                    <label
                      className={`payment-option p-3 rounded border d-flex align-items-center cursor-pointer ${paymentMethod === "upi" ? "border-primary bg-light" : ""}`}
                      style={{
                        borderColor:
                          paymentMethod === "upi" ? "#732882" : "#dee2e6",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="form-check-input me-3"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        style={{ accentColor: "#732882" }}
                      />
                      <div className="d-flex align-items-center grow">
                        <span className="me-2">
                          <i className="fa-solid fa-mobile-screen-button text-success"></i>
                        </span>
                        <span className="fw-semibold">UPI / QR Code</span>
                      </div>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/10109/10109919.png"
                        alt="upi"
                        width="30"
                      />
                    </label>

                    {/* Card */}
                    <label
                      className={`payment-option p-3 rounded border d-flex align-items-center cursor-pointer ${paymentMethod === "card" ? "border-primary bg-light" : ""}`}
                      style={{
                        borderColor:
                          paymentMethod === "card" ? "#732882" : "#dee2e6",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="form-check-input me-3"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        style={{ accentColor: "#732882" }}
                      />
                      <div className="d-flex align-items-center grow">
                        <span className="me-2">
                          <i className="fa-solid fa-credit-card text-primary"></i>
                        </span>
                        <span className="fw-semibold">Credit / Debit Card</span>
                      </div>
                      <div className="d-flex gap-2">
                        <i className="fa-brands fa-cc-visa fa-lg"></i>
                        <i className="fa-brands fa-cc-mastercard fa-lg"></i>
                      </div>
                    </label>

                    {/* Net Banking */}
                    <label
                      className={`payment-option p-3 rounded border d-flex align-items-center cursor-pointer ${paymentMethod === "netbanking" ? "border-primary bg-light" : ""}`}
                      style={{
                        borderColor:
                          paymentMethod === "netbanking"
                            ? "#732882"
                            : "#dee2e6",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="form-check-input me-3"
                        checked={paymentMethod === "netbanking"}
                        onChange={() => setPaymentMethod("netbanking")}
                        style={{ accentColor: "#732882" }}
                      />
                      <div className="d-flex align-items-center grow">
                        <span className="me-2">
                          <i className="fa-solid fa-building-columns text-secondary"></i>
                        </span>
                        <span className="fw-semibold">Net Banking</span>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="btn w-100 mt-5 text-white fw-bold py-3"
                    style={{
                      background: "linear-gradient(45deg, #732882, #8a3399)",
                      borderRadius: "50px",
                      boxShadow: "0 4px 15px rgba(115, 40, 130, 0.3)",
                      opacity: isProcessing ? 0.7 : 1
                    }}
                  >
                    {isProcessing ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : null}
                    {isOrder ? `Pay ₹${total} & Place Order` : `Pay ₹${total} & Start Session`}
                  </button>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="fa-solid fa-lock me-1"></i> 100% Safe &
                      Secure Payment
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;


