"use client";

import React, { useState, useEffect, Suspense } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const Link = NextLink as any;

const ResetPasswordContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            router.push("/");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/auth/reset/password?token=${token}`;
            await axios.post(API_URL, { password });

            toast.success("Password reset successful!");
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to reset password. The link may have expired.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="mt-2 text-gray-500 font-medium">
                        Enter your new password below.
                    </p>
                </div>

                {!isSuccess ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                                placeholder="******"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                                placeholder="******"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-yellow-600 hover:bg-yellow-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
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
                            Your password has been reset successfully. Redirecting you to login...
                        </p>
                        <div>
                            <Link href="/" className="inline-block px-6 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-all">
                                Login Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ResetPasswordPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPasswordPage;
