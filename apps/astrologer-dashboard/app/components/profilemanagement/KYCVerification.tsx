import React from "react";
import { Shield, CheckCircle2 } from "lucide-react";

interface KYCVerificationProps {
    kycCompleted: boolean;
    handleKYCClick: () => void;
}

export default function KYCVerification({
    kycCompleted,
    handleKYCClick,
}: KYCVerificationProps) {
    return (
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-50 p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-dashed border-yellow-300">
            <div className="flex items-start space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        KYC Verification
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Complete your KYC to unlock all features and build trust with clients
                    </p>
                </div>
            </div>

            {kycCompleted ? (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm sm:text-base font-semibold text-green-800">
                            KYC Verified
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                        Your account is fully verified
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                            ⚠️ KYC Pending
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                            Complete verification to accept consultations
                        </p>
                    </div>
                    <button
                        onClick={handleKYCClick}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 text-sm sm:text-base"
                    >
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Complete KYC Verification</span>
                    </button>
                </div>
            )}
        </div>
    );
}
