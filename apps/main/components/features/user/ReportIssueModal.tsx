"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "@packages/ui/src/context/ClientAuthContext";

interface ReportIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "order" | "consultation";
    itemDetails: any;
    onSuccess?: (newDispute?: any) => void;
}

import UserDisputeChatModal from './UserDisputeChatModal';

export default function ReportIssueModal({
    isOpen,
    onClose,
    type,
    itemDetails,
    onSuccess,
}: ReportIssueModalProps) {
    const [issue, setIssue] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [submittingWithChat, setSubmittingWithChat] = useState(false);

    const orderCategories = [
        "Product Damaged/Defective",
        "Wrong Item Received",
        "Poor Quality",
        "Payment Issue",
        "Technical Problem",
        "Refund Request",
        "Other",
    ];

    const consultationCategories = [
        "Astrologer did not join",
        "Poor Audio/Video Quality",
        "Incomplete Session",
        "Incorrect Predictions",
        "Rude behavior by Astrologer",
        "Payment Issue",
        "Technical Problem",
        "Refund Request",
        "Other",
    ];

    const categories = type === "order" ? orderCategories : consultationCategories;

    const handleSubmit = async (isChat: boolean = false) => {
        if (!category || !issue.trim()) {
            toast.error("Please select a category and describe your issue");
            return;
        }

        setLoading(true);
        if (isChat) setSubmittingWithChat(true);

        try {
            const payload = {
                type,
                itemId: type === "order" ? itemDetails.id : itemDetails.id,
                orderId: type === "order" ? itemDetails.id : null,
                consultationId: type === "consultation" ? itemDetails.id : null,
                category,
                description: issue,
                itemDetails: {
                    ...(type === "order" && {
                        orderNumber: itemDetails.orderId || itemDetails.id,
                        amount: itemDetails.totalAmount,
                        status: itemDetails.status,
                        date: itemDetails.createdAt,
                    }),
                    ...(type === "consultation" && {
                        sessionId: itemDetails.id,
                        expertName: itemDetails.expert?.user?.name,
                        amount: itemDetails.totalCost,
                        status: itemDetails.status,
                        date: itemDetails.createdAt,
                    }),
                },
            };

            console.log("Sending dispute payload:", payload);
            const response = await apiClient.post("/support/disputes", payload);
            console.log("Dispute creation response:", response.data);
            const resBody = response.data;
            let newDispute = resBody?.data || resBody?.dispute || resBody;

            // Ensure newDispute is an object with an id property
            if (typeof newDispute !== "object" || newDispute === null) {
                newDispute = { id: newDispute };
            } else if (!newDispute.id && (newDispute.disputeId || resBody.id)) {
                newDispute.id = newDispute.disputeId || resBody.id;
            }

            toast.success("Issue reported successfully!");
            if (onSuccess) onSuccess(isChat ? newDispute : undefined);
            onClose();
            setIssue("");
            setCategory("");
        } catch (error: any) {
            console.error("Error reporting issue:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error message array:", error.response?.data?.message);

            // Show specific backend error message if available
            let errorMessage = "Failed to report issue. Please try again.";

            if (error.response?.data?.message) {
                if (Array.isArray(error.response.data.message)) {
                    errorMessage = error.response.data.message.join(", ");
                } else {
                    errorMessage = error.response.data.message;
                }
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
            setSubmittingWithChat(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Report an Issue</h2>
                            <p className="text-sm text-white/90 mt-1">
                                We're here to help resolve your concern
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                        >
                            <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Item Details Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-200">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-info-circle text-orange-500"></i>
                            {type === "order" ? "Order Details" : "Consultation Details"}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {type === "order" ? (
                                <>
                                    <div>
                                        <span className="text-gray-600">Order ID:</span>
                                        <p className="font-bold text-gray-800">
                                            #{itemDetails.orderId || itemDetails.id}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Amount:</span>
                                        <p className="font-bold text-gray-800">
                                            ₹{itemDetails.totalAmount || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Status:</span>
                                        <p className="font-bold text-gray-800 capitalize">
                                            {itemDetails.status}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date:</span>
                                        <p className="font-bold text-gray-800">
                                            {new Date(itemDetails.createdAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span className="text-gray-600">Session ID:</span>
                                        <p className="font-bold text-gray-800">#{itemDetails.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Expert:</span>
                                        <p className="font-bold text-gray-800">
                                            {itemDetails.expert?.user?.name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Amount:</span>
                                        <p className="font-bold text-gray-800">
                                            ₹{itemDetails.totalCost || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date:</span>
                                        <p className="font-bold text-gray-800">
                                            {new Date(itemDetails.createdAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="mb-5">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Issue Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Issue Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Describe Your Issue <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            placeholder="Please provide detailed information about your issue..."
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            <i className="fa-solid fa-lightbulb text-yellow-500 mr-1"></i>
                            Tip: Include specific details like dates, times, or screenshots if applicable
                        </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all font-sans"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={loading || !category || !issue.trim()}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-sans"
                        >
                            {loading && !submittingWithChat ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-paper-plane mr-2"></i>
                                    Submit
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={loading || !category || !issue.trim()}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-sans flex items-center justify-center gap-2"
                        >
                            {loading && submittingWithChat ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-comments"></i>
                            )}
                            Submit & Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
