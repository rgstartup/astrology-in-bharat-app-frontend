"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { api as http } from "@/actions";
import { getErrorMessage } from "@repo/lib";

interface ReportIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "order" | "consultation" | "puja";
    itemDetails: any;
    onSuccess?: (newDispute?: any) => void;
}

import { useAuthStore } from "@/store/__useAuthStore";
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user: currentUser } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.classList.add("lenis-stopped");
            window.dispatchEvent(new Event('pause-lenis'));
        } else {
            document.body.style.overflow = "unset";
            document.documentElement.classList.remove("lenis-stopped");
            window.dispatchEvent(new Event('resume-lenis'));
        }
        return () => {
            document.body.style.overflow = "unset";
            document.documentElement.classList.remove("lenis-stopped");
            window.dispatchEvent(new Event('resume-lenis'));
        };
    }, [isOpen]);

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
        "Expert did not join",
        "Poor Audio/Video Quality",
        "Incomplete Session",
        "Incorrect Predictions",
        "Rude behavior by Expert",
        "Payment Issue",
        "Technical Problem",
        "Refund Request",
        "Other",
    ];

    const pujaCategories = [
        "Expert did not perform puja",
        "Materials not provided",
        "Interruption during ritual",
        "Expert was unprofessional",
        "Payment/Refund Issue",
        "Technical Problem (Online Puja)",
        "Other",
    ];

    const categories = type === "order"
        ? orderCategories
        : type === "consultation"
            ? consultationCategories
            : pujaCategories;

    const handleSubmit = async (isChat: boolean = false) => {
        if (!category || !issue.trim()) {
            toast.error("Please select a category and describe your issue");
            return;
        }

        setLoading(true);
        if (isChat) setSubmittingWithChat(true);

        const payload: any = {
            type,
            itemId: String(itemDetails.id),
            category,
            description: issue.trim(),
            itemDetails: {
                userAvatar: currentUser?.profile_picture || currentUser?.avatar || "",
                userName: currentUser?.name || "Client",
                ...(type === "order" && {
                    orderNumber: itemDetails.orderId || itemDetails.id,
                    amount: itemDetails.totalAmount || itemDetails.total_amount || itemDetails.amount || 0,
                    expertName: "System",
                    expertAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=System`,
                    status: itemDetails.status,
                    date: itemDetails.date || itemDetails.createdAt || itemDetails.created_at,
                }),
                ...(type === "consultation" && {
                    sessionId: itemDetails.id,
                    expertName: itemDetails.expert?.user?.name || itemDetails.expertName || itemDetails.expert_name || itemDetails.astrologer_name || "Expert",
                    expertAvatar: itemDetails.expert?.user?.profile_picture || itemDetails.expert?.user?.avatar || itemDetails.expert_image || `https://api.dicebear.com/7.x/initials/svg?seed=${itemDetails.expertName || itemDetails.expert_name || itemDetails.astrologer_name || 'E'}`,
                    amount: itemDetails.totalCost || itemDetails.total_cost || itemDetails.price || itemDetails.amount || 0,
                    status: itemDetails.status,
                    date: itemDetails.createdAt || itemDetails.created_at,
                }),
                ...(type === "puja" && {
                    pujaId: itemDetails.id,
                    pujaName: itemDetails.puja?.name || "Puja Ritual",
                    expertName: itemDetails.expert?.user?.name || itemDetails.expertName || itemDetails.expert_name || "Expert",
                    expertAvatar: itemDetails.expert?.user?.profile_picture || itemDetails.expert?.user?.avatar || itemDetails.expert_image || `https://api.dicebear.com/7.x/initials/svg?seed=${itemDetails.expertName || itemDetails.expert_name || 'P'}`,
                    amount: itemDetails.price || itemDetails.total_amount || itemDetails.amount || 0,
                    status: itemDetails.status,
                    date: itemDetails.scheduled_date || itemDetails.created_at,
                }),
            },
        };

        if (type === "order") {
            payload.orderId = String(itemDetails.id);
        } else if (type === "consultation") {
            payload.consultationId = String(itemDetails.id);
        } else if (type === "puja") {
            payload.pujaId = String(itemDetails.id);
        }

        const [res, error] = await http.post<any>("/support/disputes", payload);

        if (error) {
            console.error("Error reporting issue:", error);
            toast.error(getErrorMessage(error) || "Failed to report issue. Please try again.");
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
            const orderId = itemDetails.orderId || String(itemDetails.id).slice(0, 8).toUpperCase();
            const amount = itemDetails.price || itemDetails.totalAmount || itemDetails.total_amount || itemDetails.totalCost || itemDetails.total_cost || itemDetails.amount || 0;
            const date = (itemDetails.date || itemDetails.createdAt || itemDetails.created_at || itemDetails.scheduled_date)
                ? new Date(itemDetails.date || itemDetails.createdAt || itemDetails.created_at || itemDetails.scheduled_date).toLocaleDateString("en-IN")
                : "N/A";

            const summaryMessage = `📋 ISSUE SUMMARY 📋\n\n` +
                `Issue Category: ${category}\n` +
                `${type === "order" ? "Order ID" : type === "consultation" ? "Session ID" : "Puja ID"}: #${orderId}\n` +
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

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-linear-to-r from-orange-500 to-red-500 text-white p-6 shrink-0">
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
                <div
                    className={`p-6 transition-all duration-300 overflow-y-auto overscroll-contain flex-1 ${isDropdownOpen ? 'pb-48' : ''}`}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {/* Item Details Card */}
                    <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-200">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-info-circle text-orange-500"></i>
                            {type === "order" ? "Order Details" : type === "consultation" ? "Consultation Details" : "Puja Details"}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {type === "order" ? (
                                <>
                                    <div>
                                        <span className="text-gray-600">Order ID:</span>
                                        <p className="font-bold text-gray-800">
                                            #{itemDetails.orderId || String(itemDetails.id).split('-')[0].toUpperCase()}
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
                                            {(itemDetails.date || itemDetails.createdAt || itemDetails.created_at)
                                                ? new Date(itemDetails.date || itemDetails.createdAt || itemDetails.created_at).toLocaleDateString("en-IN")
                                                : "N/A"}
                                        </p>
                                    </div>
                                </>
                            ) : type === "consultation" ? (
                                <>
                                    <div>
                                        <span className="text-gray-600">Session ID:</span>
                                        <p className="font-bold text-gray-800">#{itemDetails.orderId || String(itemDetails.id).split('-')[0].toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Expert:</span>
                                        <p className="font-bold text-gray-800">
                                            {itemDetails.expert?.user?.name || itemDetails.expertName || itemDetails.expert_name || itemDetails.astrologer_name || "N/A"}
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
                                            {(itemDetails.date || itemDetails.createdAt || itemDetails.created_at)
                                                ? new Date(itemDetails.date || itemDetails.createdAt || itemDetails.created_at).toLocaleDateString("en-IN")
                                                : "N/A"}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span className="text-gray-600">Booking ID:</span>
                                        <p className="font-bold text-gray-800">#{itemDetails.orderId || String(itemDetails.id).split('-')[0].toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Ritual:</span>
                                        <p className="font-bold text-gray-800">
                                            {itemDetails.puja?.name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Expert:</span>
                                        <p className="font-bold text-gray-800">
                                            {itemDetails.expert?.user?.name || itemDetails.expertName || itemDetails.expert_name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Amount:</span>
                                        <p className="font-bold text-gray-800">
                                            ₹{itemDetails.price || itemDetails.amount || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date:</span>
                                        <p className="font-bold text-gray-800">
                                            {itemDetails.scheduled_date
                                                ? new Date(itemDetails.scheduled_date).toLocaleDateString("en-IN")
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
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full px-4 py-3 border-2 ${isDropdownOpen ? 'border-orange-500' : 'border-gray-200'} rounded-xl transition-all cursor-pointer flex justify-between items-center bg-white`}
                            >
                                <span className={category ? "text-gray-900 font-medium" : "text-gray-500"}>
                                    {category || "Select a category"}
                                </span>
                                <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </div>

                            {isDropdownOpen && (
                                <div
                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto overscroll-contain"
                                    onWheel={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                >
                                    <div
                                        onClick={() => {
                                            setCategory("");
                                            setIsDropdownOpen(false);
                                        }}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 text-gray-500"
                                    >
                                        Select a category
                                    </div>
                                    {categories.map((cat) => (
                                        <div
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${category === cat ? 'bg-orange-50/50 text-orange-600 font-medium' : 'text-gray-700'}`}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
        </div>,
        document.body
    );
}


