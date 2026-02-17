"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

const Link = NextLink as any;

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543").replace(/\/api\/v1\/?$/, "");
            const API_URL = `${apiBase}/api/v1/auth/forgot/password`;
            await axios.post(API_URL, {
                email,
                origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3003'
            });

            toast.success("Password reset link sent! Please check your email.");
            setIsSent(true);
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to send reset link. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                    <p className="mt-2 text-gray-500 font-medium">
                        Enter your email to receive a password reset link.
                    </p>
                </div>

                {!isSent ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                                placeholder="expert@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-yellow-600 hover:bg-yellow-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="text-center">
                            <Link href="/" className="text-sm font-bold text-yellow-600 hover:text-yellow-700">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-600">
                            We've sent a link to reset your password to <strong>{email}</strong>.
                        </p>
                        <button
                            className="w-full py-3 px-4 rounded-lg border border-yellow-600 text-yellow-600 font-bold hover:bg-yellow-50 transition-all"
                            onClick={() => setIsSent(false)}
                        >
                            Resend Email
                        </button>
                        <div>
                            <Link href="/" className="inline-block px-6 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-all">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;


