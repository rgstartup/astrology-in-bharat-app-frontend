"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { api as http } from "@/lib/api";

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

        const [res, error] = await http.post<any>("/support/disputes", payload);

        if (error) {
            console.error("Error reporting issue:", error);
            toast.error(error.message || "Failed to report issue. Please try again.");
            setLoading(false);
            setSubmittingWithChat(false);
            return;
        }

        const resBody = res?.data || res;
        let newDispute = resBody?.data || resBody?.dispute || resBody;

        if (typeof newDispute !== "object" || newDispute === null) {
            newDispute = { id: newDispute };
        } else if (!newDispute.id && (newDispute.disputeId || resBody.id)) {
            newDispute.id = newDispute.disputeId || resBody.id;
        }

        toast.success("Issue reported successfully!");

        if (isChat && newDispute?.id) {
            const orderId = itemDetails.orderId || itemDetails.id;
            const amount = itemDetails.totalAmount || itemDetails.total_amount || itemDetails.totalCost || itemDetails.total_cost || itemDetails.amount || 0;
            const date = (itemDetails.createdAt || itemDetails.created_at)
                ? new Date(itemDetails.createdAt || itemDetails.created_at).toLocaleDateString("en-IN")
                : "N/A";

            const summaryMessage = `📋 ISSUE SUMMARY 📋\n\n` +
                `Issue Category: ${category}\n` +
                `${type === "order" ? "Order ID" : "Session ID"}: #${orderId}\n` +
                `Amount: ₹${amount}\n` +
                `Date: ${date}\n\n` +
                `Description: ${issue.trim()}`;

            await http.post(`/support/disputes/${newDispute.id}/messages`, {
                message: summaryMessage
            });
        }

        if (onSuccess) onSuccess(isChat ? newDispute : undefined);
        onClose();
        setIssue("");
        setCategory("");
        setLoading(false);
        setSubmittingWithChat(false);
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
                                            ₹{itemDetails.totalAmount || itemDetails.total_amount || itemDetails.amount || 0}
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
                                            {(itemDetails.createdAt || itemDetails.created_at)
                                                ? new Date(itemDetails.createdAt || itemDetails.created_at).toLocaleDateString("en-IN")
                                                : "N/A"}
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
                                            {itemDetails.expert?.user?.name || itemDetails.expertName || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Amount:</span>
                                        <p className="font-bold text-gray-800">
                                            ₹{itemDetails.totalCost || itemDetails.total_cost || itemDetails.amount || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date:</span>
                                        <p className="font-bold text-gray-800">
                                            {(itemDetails.createdAt || itemDetails.created_at)
                                                ? new Date(itemDetails.createdAt || itemDetails.created_at).toLocaleDateString("en-IN")
                                                : "N/A"}
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


