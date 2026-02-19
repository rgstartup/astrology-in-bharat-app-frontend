"use client";
import React, { useState } from "react";
import Head from "next/head";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@repo/ui";
import { toast } from "react-toastify";

const Image = NextImage as any;
const Link = NextLink as any;
const UserIcon = User as any;
const LockIcon = Lock as any;
const EyeIcon = Eye as any;
const EyeOffIcon = EyeOff as any;

import { astrologerLoginAction } from "@/src/actions/auth";

import { CLIENT_API_URL } from "@/lib/config";
const API_URL = CLIENT_API_URL;

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await astrologerLoginAction({ email, password, expert: true });

            if (result.success) {
                // Initial login in store (profile will be fetched by AuthInitializer)
                await login("", result.user);
                toast.success("Login successful!");
                router.push("/dashboard");
            } else {
                setError(result.error || "Login failed");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const baseUrl = API_URL.replace(/\/api\/v1\/?$/, "");
        const redirectUri = window.location.origin;
        window.location.href = `${baseUrl}/api/v1/auth/google/login?role=expert&redirect_uri=${redirectUri}`;
    };

    return (
        <>
            <Head>
                <title>Expert Login - Astrology in Bharat</title>
            </Head>

            <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">

                    {/* Left Side: Image / Visual Section */}
                    <div className="relative hidden lg:block h-[500px]">
                        <div className="absolute inset-0 bg-yellow-600 bg-opacity-70 flex flex-col items-center justify-center text-white p-8 z-10">
                            <img
                                src="/images/Astrologer.png"
                                alt="Logo"
                                className="w-56 h-56 object-contain mb-6 drop-shadow-2xl"
                            />

                            <div className="text-left w-full">
                                <h1 className="text-4xl font-bold font-sans mb-4 tracking-tight">Welcome Back, Expert!</h1>
                                <p className="text-xl text-left opacity-90">
                                    Access your personalized dashboard, manage your appointments, and grow your practice.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white text-black">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Expert Login</h2>
                            <p className="mt-2 text-gray-500 font-medium">
                                Please enter your credentials to sign in.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm shadow-sm">
                                <p className="font-semibold mb-1">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm text-black transition-all"
                                        placeholder="expert@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "test" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm text-black transition-all"
                                        placeholder="Enter Your Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-700 cursor-pointer"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" title="Forgot Password" className="font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-2 space-y-3">
                                <Button
                                    type="submit"
                                    loading={loading}
                                    fullWidth
                                    variant="warning"
                                    className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Sign In
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    variant="outline"
                                    fullWidth
                                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-yellow-500 transform hover:-translate-y-0.5 shadow-sm"
                                >
                                    <Image
                                        src="/images/google-color-svgrepo-com.svg"
                                        alt="Google"
                                        height={20}
                                        width={20}
                                        className="mr-2"
                                    />
                                    Sign in with Google
                                </Button>
                            </div>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600 font-medium">
                                    Don't have an account?{" "}
                                    <Link href="/register" className="text-yellow-600 hover:text-yellow-700 font-bold border-b border-transparent hover:border-yellow-700 transition-all">
                                        Sign Up here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;


