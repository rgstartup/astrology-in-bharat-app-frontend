"use client";
import React, { useState } from "react";
import Head from "next/head";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import {   Eye, EyeOff } from "lucide-react";


import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword , setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("Attempting login for:", email);
            const response = await apiClient.post("/auth/email/login", {
                email,
                password,
            });

            console.log("Login successful response:", response.status);

            if (response.data?.accessToken) {
                login(response.data.accessToken, response.data.user);

                toast.success("Login successful!");
                router.push("/dashboard");
            } else {
                setError("Login failed. No access token received.");
            }
        } catch (err: any) {
            console.error("Login error details:", err.response?.data || err.message);
            const backendMessage = err.response?.data?.message;
            let message = Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage;

            if (err.response?.status === 401 && (message?.toLowerCase().includes("verify") || message?.toLowerCase().includes("email"))) {
                message = "Email not verified. Please check your inbox for the verification link.";
                toast.error(message, { autoClose: 5000 });
            }

            setError(message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
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
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4">
                                <img
                                    src="/images/logo1.webp"
                                    alt="Logo"
                                    className="w-20 h-20 object-contain bg-white rounded-xl p-2"
                                />
                            </div>

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
                                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                    <a href="#" className="font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : "Sign In"}
                                </button>
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
