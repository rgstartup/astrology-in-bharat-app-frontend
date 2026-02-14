"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { toast } from "react-toastify";

const VerifyEmailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
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
                // Using the specific endpoint provided: POST /auth/email/confirm
                await apiClient.post("/auth/email/confirm", { token });
                setStatus("success");
                setMessage("Email verified successfully! Redirecting to login...");
                toast.success("Email verified successfully!");
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } catch (err: any) {
                console.error("Verification error:", err);
                setStatus("error");
                const backendMsg = err.response?.data?.message || "Verification failed. The link may be expired or invalid.";
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
