"use client";
import React, { useState, useEffect } from "react";
import { X, Gift, Loader2 } from "lucide-react";
import { Button } from "@repo/ui";
import { assignCouponToUser, getCoupons } from "@/src/services/admin.service";
import { toast } from "react-toastify";
import type { User } from "@/app/components/user/user";

interface Props {
    user: User;
    onClose: () => void;
}

const AssignCouponModal = ({ user, onClose }: Props) => {
    const [loading, setLoading] = useState(false);
    const [fetchingCoupons, setFetchingCoupons] = useState(true);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const [selectedCouponCode, setSelectedCouponCode] = useState("");

    useEffect(() => {
        const loadCoupons = async () => {
            try {
                const data = await getCoupons();
                const list = Array.isArray(data) ? data : (data.data || []);
                setAvailableCoupons(list);
                if (list.length > 0) setSelectedCouponCode(list[0].code);
            } catch (error) {
                toast.error("Failed to load available coupons");
            } finally {
                setFetchingCoupons(false);
            }
        };
        loadCoupons();
    }, []);

    const handleAssign = async () => {
        if (!selectedCouponCode) {
            toast.error("Please select a coupon");
            return;
        }

        setLoading(true);
        try {
            await assignCouponToUser(user.id, selectedCouponCode);
            toast.success(`Coupon ${selectedCouponCode} assigned to ${user.name}`);
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to assign coupon");
        } finally {
            setLoading(false);
        }
    };

    const GiftIcon = Gift as any;
    const LoaderIcon = Loader2 as any;
    const XIcon = X as any;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-amber-500 p-6 text-white text-center relative">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <GiftIcon size={32} />
                    </div>
                    <h2 className="text-xl font-bold">Assign Reward</h2>
                    <p className="text-amber-100 text-sm">Send a special coupon to {user.name}</p>
                    <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition-colors">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Select Coupon Code</label>
                        {fetchingCoupons ? (
                            <div className="h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm">
                                <LoaderIcon className="animate-spin mr-2" size={16} /> Loading coupons...
                            </div>
                        ) : availableCoupons.length === 0 ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                No active coupons found. Please create a coupon first.
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all appearance-none bg-white font-semibold text-gray-700"
                                    value={selectedCouponCode}
                                    onChange={(e) => setSelectedCouponCode(e.target.value)}
                                >
                                    {availableCoupons.map((c) => (
                                        <option key={c.id} value={c.code}>
                                            {c.code} ({c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`} OFF)
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                        <div className="text-blue-500 mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-xs text-blue-600 leading-relaxed">
                            Once assigned, this coupon will be visible in the user's "My Rewards" section on their profile. Public coupons do not need manual assignment.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border-gray-300"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-[2] py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        onClick={handleAssign}
                        disabled={loading || availableCoupons.length === 0}
                    >
                        {loading ? <LoaderIcon className="animate-spin" size={18} /> : null}
                        {loading ? "Assigning..." : "Assign Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AssignCouponModal;




