"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const astrologerName = searchParams.get("name") || "Astrologer";
    const date = searchParams.get("date") || "";
    const time = searchParams.get("time") || "";
    const duration = searchParams.get("duration") || "15";
    const total = searchParams.get("total") || "300";

    const [paymentMethod, setPaymentMethod] = useState("upi");

    const handlePayment = () => {
        // Mock payment processing
        setTimeout(() => {
            // Redirect to chat with astrologer info
            const params = new URLSearchParams({
                name: astrologerName,
            });
            router.push(`/chat?${params.toString()}`);
        }, 1500);
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
                        <div className="col-lg-5 mb-4">
                            <div className="leftcard border-0 shadow-lg h-100" style={{ borderRadius: "15px" }}>
                                <div className="card-body p-4">
                                    <h5 className="mb-4 fw-bold" style={{ color: "#732882" }}>Order Summary</h5>

                                    <div className="d-flex align-items-center mb-4">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", border: "2px solid #daa23e" }}>
                                            <i className="fa-solid fa-user-astronaut" style={{ fontSize: "24px", color: "#732882" }}></i>
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="mb-1 fw-bold">{astrologerName}</h6>
                                            <small className="text-muted">Personal Consultation</small>
                                        </div>
                                    </div>

                                    <ul className="list-group list-group-flush mb-3">
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
                                        <li className="list-group-item d-flex justify-content-between bg-transparent px-0 fw-bold fs-5" style={{ color: "#732882" }}>
                                            <span>Total Amount</span>
                                            <span>₹{total}</span>
                                        </li>
                                    </ul>

                                    <div className="alert alert-warning" role="alert" style={{ fontSize: "0.85rem" }}>
                                        <i className="fa-solid fa-circle-info me-2"></i>
                                        Session will start automatically after payment.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="col-lg-7">
                            <div className="leftcard border-0 shadow-lg h-100" style={{ borderRadius: "15px" }}>
                                <div className="card-body p-4 p-md-5">
                                    <h5 className="mb-4 fw-bold" style={{ color: "#732882" }}>Select Payment Method</h5>

                                    <div className="payment-options d-flex flex-column gap-3">

                                        {/* UPI */}
                                        <label className={`payment-option p-3 rounded border d-flex align-items-center cursor-pointer ${paymentMethod === 'upi' ? 'border-primary bg-light' : ''}`} style={{ borderColor: paymentMethod === 'upi' ? '#732882' : '#dee2e6', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="form-check-input me-3"
                                                checked={paymentMethod === "upi"}
                                                onChange={() => setPaymentMethod("upi")}
                                                style={{ accentColor: "#732882" }}
                                            />
                                            <div className="d-flex align-items-center flex-grow-1">
                                                <span className="me-2"><i className="fa-solid fa-mobile-screen-button text-success"></i></span>
                                                <span className="fw-semibold">UPI / QR Code</span>
                                            </div>
                                            <img src="https://cdn-icons-png.flaticon.com/512/10109/10109919.png" alt="upi" width="30" />
                                        </label>

                                        {/* Card */}
                                        <label className={`payment-option p-3 rounded border d-flex align-items-center cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`} style={{ borderColor: paymentMethod === 'card' ? '#732882' : '#dee2e6', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="form-check-input me-3"
                                                checked={paymentMethod === "card"}
                                                onChange={() => setPaymentMethod("card")}
                                                style={{ accentColor: "#732882" }}
                                            />
                                            <div className="d-flex align-items-center flex-grow-1">
                                                <span className="me-2"><i className="fa-solid fa-credit-card text-primary"></i></span>
                                                <span className="fw-semibold">Credit / Debit Card</span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <i className="fa-brands fa-cc-visa fa-lg"></i>
                                                <i className="fa-brands fa-cc-mastercard fa-lg"></i>
                                            </div>
                                        </label>

                                        {/* Net Banking */}
                                        <label className={`payment-option p-3 rounded border d-flex align-items-center cursor-pointer ${paymentMethod === 'netbanking' ? 'border-primary bg-light' : ''}`} style={{ borderColor: paymentMethod === 'netbanking' ? '#732882' : '#dee2e6', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="form-check-input me-3"
                                                checked={paymentMethod === 'netbanking'}
                                                onChange={() => setPaymentMethod("netbanking")}
                                                style={{ accentColor: "#732882" }}
                                            />
                                            <div className="d-flex align-items-center flex-grow-1">
                                                <span className="me-2"><i className="fa-solid fa-building-columns text-secondary"></i></span>
                                                <span className="fw-semibold">Net Banking</span>
                                            </div>
                                        </label>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        className="btn w-100 mt-5 text-white fw-bold py-3"
                                        style={{
                                            background: "linear-gradient(45deg, #732882, #8a3399)",
                                            borderRadius: "50px",
                                            boxShadow: "0 4px 15px rgba(115, 40, 130, 0.3)"
                                        }}
                                    >
                                        Pay ₹{total} & Start Session
                                    </button>

                                    <div className="text-center mt-3">
                                        <small className="text-muted"><i className="fa-solid fa-lock me-1"></i> 100% Safe & Secure Payment</small>
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

export default CheckoutPage;
