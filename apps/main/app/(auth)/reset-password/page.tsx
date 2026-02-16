"use client";

import NextLink from "next/link";
const Link = NextLink as any;
import React, { useState, FormEvent, Suspense, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const ResetPasswordContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            router.push("/sign-in");
        }
    }, [token, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!password) {
            toast.error("Password is required.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/auth/reset/password?token=${token}`;
            const response = await axios.post(
                API_URL,
                { password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(response.data.message || "Password reset successful!");
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/sign-in");
            }, 3000);
        } catch (err) {
            const error = err as AxiosError;
            const serverMessage = (error.response?.data as any)?.message || "Failed to reset password. The link may have expired.";
            toast.error(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <section className="signin-part">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="form-data shadow-sm p-4 rounded-xl bg-white">
                            <div className="sign-in-heading mb-4 text-center">
                                <h2 style={{ color: "var(--primary-color)" }}>Reset Password</h2>
                                <p className="text-muted">Enter your new password below.</p>
                            </div>

                            {!isSuccess ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            New Password *
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                className="form-control"
                                                placeholder="Enter New Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                style={{ paddingRight: "40px" }}
                                            />
                                            <button
                                                type="button"
                                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                            Confirm New Password *
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>
                                    <h3>Success!</h3>
                                    <p className="text-muted">Your password has been reset successfully. Redirecting you to sign in...</p>
                                    <div className="mt-4">
                                        <Link href="/sign-in" className="btn bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold px-4">
                                            Go to Sign In Now
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
            <ResetPasswordContent />
        </Suspense>
    );
};

export default Page;


