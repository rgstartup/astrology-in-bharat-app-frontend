"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

// --- Types ---
interface VerificationResponse {
    message: string;
    success?: boolean;
}

// --- API ---
const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543").replace(/\/api\/v1\/?$/, "");
const API_ENDPOINT = `${apiBase}/api/v1/auth/email/verify`;

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const VerifyEmailContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    console.log("[VerifyEmail] Search Params:", searchParams.toString()); // Debug log
    console.log("[VerifyEmail] Extracted Token:", token); // Debug log

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                console.warn("[VerifyEmail] Token missing from URL parameters");
                setError("Verification token is missing. Please check your email link.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get<VerificationResponse>(
                    `${API_ENDPOINT}?token=${token}`,
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                setSuccessMessage(
                    response.data.message || "Email verified successfully! Redirecting to sign in..."
                );
                setIsLoading(false);

                // Start countdown and redirect
                const countdownInterval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            router.push('/sign-in');
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

            } catch (err) {
                const error = err as AxiosError;
                setIsLoading(false);

                if (error.response) {
                    const status = error.response.status;
                    const msg =
                        (error.response.data as any)?.message ||
                        (error.response.data as any)?.error ||
                        `Server responded with status ${status}.`;

                    if (status === 400) {
                        setError("Invalid or expired verification token. Please request a new verification email.");
                    } else if (status === 404) {
                        setError("Verification link not found. Please check your email or request a new verification email.");
                    } else if (status >= 500) {
                        setError("A server error occurred. Please try again later.");
                    } else {
                        setError(msg);
                    }
                } else if (error.request) {
                    setError("Network Error: Could not reach the server.");
                } else {
                    setError("An unexpected error occurred.");
                }
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <section className="signin-part">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="form-data shadow-sm p-5 rounded-xl bg-white text-center">
                            <div className="mb-4">
                                <Image
                                    src="/images/dummy-astrologer.jpg"
                                    alt="Astrology Bharat"
                                    height={100}
                                    width={100}
                                    className="mx-auto"
                                />
                            </div>

                            <h2 className="mb-4" style={{ color: "var(--primary-color)" }}>
                                Email Verification
                            </h2>

                            {isLoading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="text-muted">Verifying your email address...</p>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    <i className="fa-solid fa-circle-exclamation me-2"></i>
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="alert alert-success mb-4" role="alert">
                                    <i className="fa-solid fa-circle-check me-2"></i>
                                    <strong>Success:</strong> {successMessage}
                                    <div className="mt-3">
                                        <p className="mb-0">
                                            Redirecting to sign in page in <strong>{countdown}</strong> seconds...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!isLoading && (
                                <div className="mt-4">
                                    <Link
                                        href="/sign-in"
                                        className="btn w-100 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                                    >
                                        {error ? "Go to Sign In" : "Continue to Sign In"}
                                    </Link>
                                </div>
                            )}

                            {error && (
                                <div className="mt-3">
                                    <p className="text-muted mb-0">
                                        Need help?{" "}
                                        <Link href="/register" className="text-decoration-none">
                                            Register again
                                        </Link>
                                    </p>
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
        <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default Page;


