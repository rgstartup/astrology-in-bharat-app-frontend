"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Loading } from "@repo/ui";

const CheckCircleIcon = CheckCircle as any;
const AlertCircleIcon = AlertCircle as any;

const VerifyIpContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuthStore();
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
            const [data, error] = await api.get<any>(`/auth/email/verify-ip?token=${token}`);

            if (error) {
                console.error("IP verification error:", error);
                setStatus("error");
                setMessage(getErrorMessage(error) || "Verification failed. The link may be expired.");
                return;
            }

            if (data?.accessToken) {
                login(data.accessToken, data.user);
                setStatus("success");
                setMessage("IP verified successfully! Logging you in...");
                // toast.success("Login successful!");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } else {
                setStatus("error");
                setMessage("Verification failed. Please try logging in again.");
            }
        };

        verify();
    }, [token, login, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-black">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loading size="lg" text="Verifying IP..." />
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
                            className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
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
        <Suspense fallback={<Loading fullScreen />}>
            <VerifyIpContent />
        </Suspense>
    );
};

export default VerifyIpPage;


