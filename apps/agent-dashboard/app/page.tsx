"use client";
import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, Handshake } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { useAgentAuthStore } from "@/src/store/useAgentAuthStore";
import { toast } from "react-toastify";

// ── Mock credentials (replace with real API call later) ─────
import { agentLoginAction } from "@/src/actions/auth";

function AgentLoginForm() {
    const router = useRouter();
    const { login } = useAgentAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await agentLoginAction({ email, password });

        if (result.success) {
            login(result.user);
            toast.success("Login Successful! Redirecting...");
            // ✅ Full page reload — middleware needs fresh request to read the
            // newly set HttpOnly cookie (client-side router.push doesn't work)
            window.location.href = "/dashboard";
        } else {
            const msg = result.error || "Invalid email or password.";
            setError(msg);
            toast.error(msg);
        }

        setLoading(false);
    };

    return (
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Agent Login</h2>
                <p className="mt-2 text-gray-500">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Email */}
                <div>
                    <label htmlFor="agent-email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="agent-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="agent@astrologyinbharat.com"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="agent-password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="agent-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="••••••••"
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

                {/* Remember me + Forgot */}
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

                {/* Submit */}
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
                        <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
                    )}
                </div>
            </form>

            {/* Demo hint */}
            <p className="text-center text-xs text-gray-400 mt-6">
                Demo: <span className="text-primary font-bold">agent@example.com</span> /{" "}
                <span className="text-primary font-bold">secure_password</span>
            </p>
        </div>
    );
}

// ── Page (same 2-column layout as admin login) ───────────────
export default function AgentLoginPage() {
    return (
        <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">

                {/* Left Side — same as admin: bg-primary overlay + image */}
                <div className="relative hidden lg:block h-[500px]">
                    <div className="absolute inset-0 bg-primary bg-opacity-70 flex flex-col items-center justify-center text-white p-8 z-10">
                        <img
                            src="/images/Astrologer.png"
                            alt="Agent Portal"
                            className="w-56 h-56 object-contain mb-6 drop-shadow-2xl"
                        />
                        <div className="text-left">
                            <h1 className="text-4xl font-semibold font-sans mb-4 flex items-center gap-3">
                                <Handshake className="w-8 h-8 text-primary-hover" />
                                Welcome, Agent!
                            </h1>
                            <p className="text-xl text-left text-gray-200">
                                Manage your astrologer, mandir and puja shop listings. Track commissions in real-time.
                            </p>
                        </div>
                    </div>
                    {/* Background image same as admin sidebar */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: "url('/images/back-image.webp')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                </div>

                {/* Right Side — Login Form */}
                <AgentLoginForm />
            </div>
        </div>
    );
}
