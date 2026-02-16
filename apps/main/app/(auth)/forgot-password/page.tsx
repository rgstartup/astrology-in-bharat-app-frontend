"use client";

import NextImage from "next/image";
import NextLink from "next/link";
const Image = NextImage as any;
const Link = NextLink as any;
import React, { useState, useCallback, FormEvent, Suspense } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/auth/forgot/password`;

const ForgotPasswordContent: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                API_ENDPOINT,
                {
                    email,
                    origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(response.data.message || "Password reset link sent! Please check your email.");
            setIsSent(true);
        } catch (err) {
            const error = err as AxiosError;
            const serverMessage = (error.response?.data as any)?.message || "Failed to send reset link. Please try again.";
            toast.error(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="signin-part">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="form-data shadow-sm p-4 rounded-xl bg-white">
                            <div className="sign-in-heading mb-4 text-center">
                                <h2 style={{ color: "var(--primary-color)" }}>Forgot Password</h2>
                                <p className="text-muted">Enter your registered email address and we'll send you a link to reset your password.</p>
                            </div>

                            {!isSent ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-4">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Sending..." : "Send Reset Link"}
                                    </button>

                                    <div className="text-center mt-4">
                                        <Link href="/sign-in" className="text-decoration-none">
                                            <i className="fa-solid fa-arrow-left me-2"></i>
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>
                                    <h3>Check Your Email</h3>
                                    <p className="text-muted">We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and click the link to continue.</p>
                                    <button
                                        className="btn btn-outline-primary mt-3"
                                        onClick={() => setIsSent(false)}
                                    >
                                        Resend Email
                                    </button>
                                    <div className="mt-4">
                                        <Link href="/sign-in" className="btn bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold px-4">
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Page: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
};

export default Page;
