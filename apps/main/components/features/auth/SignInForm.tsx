"use client";

import React, { useState, useCallback, FormEvent } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { loginAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { API_CONFIG } from "@/lib/api-config";

const Image = NextImage as any;
const Link = NextLink as any;

const SignInForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clientLogin } = useAuthStore();
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        },
        []
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Email and Password are required.");
            return;
        }

        setIsLoading(true);

        try {
            // Use Server Action
            const result = await loginAction(formData);

            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                // Cookie already set as HttpOnly by the Server Action
                // Just update the Zustand UI state — NO token passed to client
                clientLogin(result.user);

                toast.success("Sign In successful!");
                window.location.href = callbackUrl;
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth — browser handles cookie automatically
        const googleLoginUrl = `${API_CONFIG.AUTH.GOOGLE_LOGIN.url}?role=client&redirect_uri=${window.location.origin}`;
        window.location.href = googleLoginUrl;
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
                    No Account? <br />
                    <Link href="/register" className="sign-up fw-bold">
                        Sign Up
                    </Link>
                </h6>
            </div>

            <div className="sign-in-heading mb-4">
                <h2 style={{ color: "var(--primary-color)" }}>Sign In</h2>
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
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                        Enter your username or email address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Username or email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                        Enter Your Password Here *
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

                <div className="d-flex justify-content-end mb-3">
                    <Link
                        href="/forgot-password"
                        className="forget-password text-decoration-none"
                    >
                        Forget Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="btn w-100 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </div>
    );
};

export default SignInForm;
