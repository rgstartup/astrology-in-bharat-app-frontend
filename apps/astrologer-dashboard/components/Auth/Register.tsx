"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

import { Button } from "@repo/ui";
const Image = NextImage as any;
const Link = NextLink as any;
const UserIcon = User as any;
const MailIcon = Mail as any;
const LockIcon = Lock as any;
const EyeIcon = Eye as any;
const EyeOffIcon = EyeOff as any;

import { astrologerRegisterAction } from "@/src/actions/auth";

import { CLIENT_API_URL } from "@/lib/config";
const API_URL = CLIENT_API_URL;

const RegisterPage: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const result = await astrologerRegisterAction({ name, email, password });

            if (result.success) {
                toast.success(result.message || "Signup successful. Please verify your email.");
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setError(result.error || "Registration failed");
            }
        } catch (err: any) {
            console.error("Registration error:", err);
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
        <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4 sm:p-6 lg:p-8">
            <Head>
                <title>Expert Sign Up - Astrology in Bharat</title>
            </Head>
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">

                {/* Left Side: Visual Section */}
                <div className="relative hidden lg:block h-[600px]">
                    <div className="absolute inset-0 bg-yellow-600 bg-opacity-80 flex flex-col items-center justify-center text-white p-8 z-10 text-center">
                        <img
                            src="/images/Astrologer.png"
                            alt="Logo"
                            className="w-64 h-64 object-contain mb-8 drop-shadow-2xl"
                        />
                        <h1 className="text-4xl font-bold mb-4 tracking-tight">Join Our Expert Community</h1>
                        <p className="text-xl opacity-90">
                            Register today to start providing your astrology expertise to thousands of seeking clients.
                        </p>
                    </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white text-black">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Expert Sign Up</h2>
                        <p className="mt-2 text-gray-500 font-medium">Create your professional account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm shadow-sm">
                            <p className="font-semibold mb-1">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate={false}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm text-black transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm text-black transition-all"
                                    placeholder="expert@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm text-black transition-all"
                                    placeholder="Min. 6 characters"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm text-black transition-all"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
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
                                Create Expert Account
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
                                Sign up with Google
                            </Button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600 font-medium">
                                Already have an account?{" "}
                                <Link href="/" className="text-yellow-600 hover:text-yellow-700 font-bold border-b border-transparent hover:border-yellow-700 transition-all">
                                    Sign In here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;


