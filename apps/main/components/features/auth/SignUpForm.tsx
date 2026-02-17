"use client";

import React, { useState, useCallback, FormEvent } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { toast } from "react-toastify";
import { registerAction } from "@/actions/auth";

const Image = NextImage as any;
const Link = NextLink as any;

const SignUpForm: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
            toast.error("All fields marked * are required.");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return false;
        }
        return true;
    };

    const handleGoogleLogin = () => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543").replace(/\/api\/v1\/?$/, "");
        const googleLoginUrl = `${baseUrl}/api/v1/auth/google/login?role=client&redirect_uri=${window.location.origin}`;
        window.location.href = googleLoginUrl;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const payload = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phoneNumber,
        };

        try {
            const result = await registerAction(payload);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success(result.message || "Registration successful! Please verify your email.");
                setFormData({ fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "" });
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-data shadow-sm p-4 rounded-xl bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                    Welcome to <br />
                    <span style={{ color: "var(--primary-color)" }}>
                        Astrology Bharat
                    </span>
                </h6>
                <h6 className="mb-0">
                    Already Account? <br />
                    <Link href="/sign-in" className="sign-up fw-bold">
                        Sign In
                    </Link>
                </h6>
            </div>

            <div className="sign-in-heading mb-4">
                <h2 style={{ color: "var(--primary-color)" }}>Sign Up</h2>
            </div>

            <div className="social-links d-flex gap-3 mb-4">
                <div
                    className="social-button d-flex align-items-center gap-2 border px-3 py-2 rounded pointer"
                    onClick={handleGoogleLogin}
                    style={{ cursor: "pointer" }}
                >
                    <Image
                        src="/images/google-color-svgrepo-com.svg"
                        alt="Google"
                        height={22}
                        width={22}
                    />
                    <small>Sign in with Google</small>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label htmlFor="fullName" className="form-label fw-semibold">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            placeholder="Enter Your Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="email" className="form-label fw-semibold">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="phoneNumber" className="form-label fw-semibold">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="Enter 10-digit Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            maxLength={10}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="password" title="Password" className="form-label fw-semibold">
                            Password *
                        </label>
                        <div className="position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter Password"
                                style={{ paddingRight: "40px" }}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ zIndex: 10 }}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-12">
                        <label htmlFor="confirmPassword" title="Confirm Password" className="form-label fw-semibold">
                            Confirm Password *
                        </label>
                        <div className="position-relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Re-enter Password"
                                style={{ paddingRight: "40px" }}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ zIndex: 10 }}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn w-100 mt-4 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;
