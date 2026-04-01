"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { astrologerVerifyEmailAction } from "@/src/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";

const VerifyEmailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuthStore();
    const token = searchParams.get("verification_token");
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verifyEmail = async () => {
            try {
                // Using server action for Httponly cookies
                const result = await astrologerVerifyEmailAction(token);

                if (result.error) {
                    throw new Error(result.error);
                }

                if (result.success) {
                    if (result.user) {
                        await login("", result.user);
                    }
                    setStatus("success");
                    setMessage("Email verified successfully! Redirecting to your dashboard...");
                    toast.success("Email verified successfully!");
                    
                    setTimeout(() => {
                        const roles = result.user?.roles || [];
                        const isExpert = roles.some((r: any) => 
                            ["expert", "astrologer", "Expert", "Astrologer", "EXPERT"].includes(String(typeof r === 'object' ? r.name : r))
                        );

                        if (isExpert) {
                            router.push("/dashboard");
                        } else {
                            // If they are not an expert but verified on this dashboard (rare but possible), send to main site profile
                            const mainUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin.replace('astrologer.', 'www.'));
                            window.location.href = `${mainUrl}/profile`;
                        }
                    }, 3000);
                }
            } catch (err: any) {
                console.error("Verification error:", err);
                setStatus("error");
                const backendMsg = err.message || "Verification failed. The link may be expired or invalid.";
                setMessage(backendMsg);
                toast.error(backendMsg);
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800">Verifying Email...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your email address.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl">
                            ✓
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Verified!</h2>
                        <p className="text-gray-600 mt-4">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl">
                            ✕
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Verification Failed</h2>
                        <p className="text-red-600 mt-2">{message}</p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}


