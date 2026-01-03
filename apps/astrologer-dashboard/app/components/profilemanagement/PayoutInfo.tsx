import React from "react";
import { CreditCard, Edit3 } from "lucide-react";

interface PayoutInfoProps {
    bankDetails: string;
}

export default function PayoutInfo({ bankDetails }: PayoutInfoProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4">
                <CreditCard className="w-5 h-5 mr-2 text-yellow-600" /> Payout Info
            </h2>
            <p className="text-gray-700 mb-3 font-mono bg-gray-100 p-3 rounded-md text-xs sm:text-sm break-all">
                {bankDetails}
            </p>
            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                <Edit3 className="w-4 h-4" />
                <span>Update Payout Info</span>
            </button>
        </div>
    );
}
