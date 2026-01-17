import React from "react";
import { CreditCard, Edit3, Save } from "lucide-react";

interface PayoutInfoProps {
    bankDetails: string;
    tempBankDetails: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
}

export default function PayoutInfo({
    bankDetails,
    tempBankDetails,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onChange
}: PayoutInfoProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center text-base sm:text-lg font-semibold">
                    <CreditCard className="w-5 h-5 mr-2 text-yellow-600" /> Payout & Bank Info
                </h2>
                {!isEditing && (
                    <button
                        onClick={onEdit}
                        className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Bank Account / UPI Details</label>
                        <textarea
                            name="bank_details"
                            value={tempBankDetails}
                            onChange={onChange}
                            placeholder="Enter bank account no, IFSC, OR UPI ID..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm font-mono min-h-[100px] text-black"
                        />
                    </div>

                    <div className="flex space-x-2 justify-end pt-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all shadow-md text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-700 font-mono text-xs sm:text-sm whitespace-pre-wrap break-all">
                        {bankDetails || "No payout information provided yet."}
                    </p>
                </div>
            )}
        </div>
    );
}
