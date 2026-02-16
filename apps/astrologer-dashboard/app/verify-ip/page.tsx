"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const Loader2Icon = Loader2 as any;
const CheckCircleIcon = CheckCircle as any;
const AlertCircleIcon = AlertCircle as any;

const VerifyIpContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your login...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification token.");
            return;
        }

        const verify = async () => {
            try {
                const response = await apiClient.get(`/auth/email/verify-ip?token=${token}`);

                if (response.data?.accessToken) {
                    login(response.data.accessToken, response.data.user);
                    setStatus("success");
                    setMessage("IP verified successfully! Logging you in...");
                    toast.success("Login successful!");
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 2000);
                } else {
                    setStatus("error");
                    setMessage("Verification failed. Please try logging in again.");
                }
            } catch (err: any) {
                console.error("IP verification error:", err);
                setStatus("error");
                setMessage(err.response?.data?.message || "Verification failed. The link may be expired.");
            }
        };

        verify();
    }, [token, login, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-black">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2Icon className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800">Verifying IP</h1>
                        <p className="text-gray-600 mt-2">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800">Verification Successful</h1>
                        <p className="text-gray-600 mt-2">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800">Verification Failed</h1>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

import { Suspense } from 'react';

const VerifyIpPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyIpContent />
        </Suspense>
    );
};

export default VerifyIpPage;


