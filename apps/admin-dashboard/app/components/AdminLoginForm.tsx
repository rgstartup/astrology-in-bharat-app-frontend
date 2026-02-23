"use client";

import React, { useState } from "react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { useAuthStore } from "@/src/store/useAuthStore";
import { toast } from "react-toastify";
import { adminLoginAction } from "@/src/actions/auth";

export default function AdminLoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login: storeLogin } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await adminLoginAction({ email, password });

            if (result.error) {
                setError(result.error);
                toast.error(result.error);
            } else if (result.success) {
                // ✅ Login through store (tokens already set as httpOnly)
                storeLogin(result.user);
                toast.success("Login Successful! Redirecting...");
                router.push("/admin/dashboard");
            }
        } catch (err: any) {
            const msg = "An unexpected error occurred.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
                <p className="mt-2 text-gray-500">
                    Please enter your details to sign in.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
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
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="admin@astrologyinbharat.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
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
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <div className="text-sm">
                        <a href="#" className="font-medium text-primary hover:text-primary-hover">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        fullWidth
                        variant="primary"
                    >
                        Sign in
                    </Button>

                    {error && (
                        <p className="text-red-500 text-center mt-2">{error}</p>
                    )}
                </div>
            </form>
        </div>
    );
}
