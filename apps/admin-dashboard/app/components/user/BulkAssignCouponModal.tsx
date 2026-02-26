"use client";
import React, { useState, useEffect } from "react";
import { X, Filter, Users, Gift, Loader2, TrendingUp, Calendar, MapPin, Star, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Button } from "@repo/ui";
import { assignCouponBulk, getCoupons, getFilteredUsersCount, getFilteredUsers } from "@/src/services/admin.service";
import { toast } from "react-toastify";

interface Props {
    onClose: () => void;
    onSuccess?: () => void;
}

interface FilterCriteria {
    minSpending?: number;
    maxSpending?: number;
    spendingPeriod?: "last_month" | "last_3_months" | "last_6_months" | "all_time";
    minSessions?: number;
    registeredBefore?: string;
    registeredAfter?: string;
    userType?: "all" | "premium" | "regular";
    location?: string;
    isBlocked?: boolean;
}

interface FilteredUser {
    id: number;
    name: string;
    email: string;
    totalSpending?: number;
    sessionCount?: number;
    registeredAt?: string;
}

const BulkAssignCouponModal = ({ onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [fetchingCoupons, setFetchingCoupons] = useState(true);
    const [fetchingCount, setFetchingCount] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const [selectedCouponCode, setSelectedCouponCode] = useState("");
    const [matchedUsersCount, setMatchedUsersCount] = useState<number | null>(null);

    // User Preview State
    const [showPreview, setShowPreview] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [previewPage, setPreviewPage] = useState(1);
    const USERS_PER_PAGE = 10;

    // Filter State
    const [filters, setFilters] = useState<FilterCriteria>({
        spendingPeriod: "last_month",
        userType: "all",
        isBlocked: false,
    });

    // Load available coupons
    useEffect(() => {
        const loadCoupons = async () => {
            try {
                const data = await getCoupons({ isActive: true });
                const list = Array.isArray(data) ? data : (data.data || []);
                // Directly use the list from backend, no frontend filtering logic!
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

    // Fetch matched users count when filters change
    useEffect(() => {
        const fetchCount = async () => {
            setFetchingCount(true);
            try {
                const count = await getFilteredUsersCount(filters);
                setMatchedUsersCount(count);
            } catch (error) {
                console.error("Failed to fetch user count:", error);
                setMatchedUsersCount(0);
            } finally {
                setFetchingCount(false);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(() => {
            fetchCount();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleAssign = async () => {
        if (!selectedCouponCode) {
            toast.error("Please select a coupon");
            return;
        }

        if (matchedUsersCount === 0) {
            toast.error("No users match the selected filters");
            return;
        }

        setLoading(true);
        try {
            const result = await assignCouponBulk({
                couponCode: selectedCouponCode,
                filters: filters,
            });

            toast.success(
                `Coupon "${selectedCouponCode}" assigned to ${result.assignedCount || matchedUsersCount} users successfully!`
            );
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to assign coupon");
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key: keyof FilterCriteria, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setShowPreview(false); // Reset preview when filters change
    };

    // Fetch filtered users for preview
    const fetchFilteredUsers = async () => {
        setFetchingUsers(true);
        try {
            const users = await getFilteredUsers({
                ...filters,
                page: previewPage,
                limit: USERS_PER_PAGE,
            });
            setFilteredUsers(users);
            setShowPreview(true);
        } catch (error) {
            console.error("Failed to fetch filtered users:", error);
            toast.error("Failed to load user preview");
        } finally {
            setFetchingUsers(false);
        }
    };

    const LoaderIcon = Loader2 as any;
    const XIcon = X as any;
    const FilterIcon = Filter as any;
    const UsersIcon = Users as any;
    const GiftIcon = Gift as any;
    const TrendingUpIcon = TrendingUp as any;
    const CalendarIcon = Calendar as any;
    const MapPinIcon = MapPin as any;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center">
                            <GiftIcon size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Bulk Coupon Assignment</h2>
                            <p className="text-purple-100 text-sm mt-1">
                                Filter users and assign coupons to multiple users at once
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Coupon Selection */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                            <GiftIcon size={16} className="text-amber-600" />
                            Select Coupon to Assign
                        </label>
                        {fetchingCoupons ? (
                            <div className="h-12 bg-white rounded-xl flex items-center justify-center border border-amber-200 italic text-gray-400 text-sm">
                                <LoaderIcon className="animate-spin mr-2" size={16} /> Loading coupons...
                            </div>
                        ) : availableCoupons.length === 0 ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
                                No active coupons found. Please create a coupon first.
                            </div>
                        ) : (
                            <select
                                className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-white font-semibold text-gray-700"
                                value={selectedCouponCode}
                                onChange={(e) => setSelectedCouponCode(e.target.value)}
                            >
                                {availableCoupons.map((c) => (
                                    <option key={c.id} value={c.code}>
                                        {c.code} - {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                        {c.min_order_value ? ` (Min: ₹${c.min_order_value})` : ""}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Filter Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <FilterIcon size={20} className="text-purple-600" />
                            User Filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Spending Filter */}
                            <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <TrendingUpIcon size={16} className="text-blue-600" />
                                    Spending Amount
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min (₹)"
                                        className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                        value={filters.minSpending || ""}
                                        onChange={(e) => updateFilter("minSpending", e.target.value ? Number(e.target.value) : undefined)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max (₹)"
                                        className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                        value={filters.maxSpending || ""}
                                        onChange={(e) => updateFilter("maxSpending", e.target.value ? Number(e.target.value) : undefined)}
                                    />
                                </div>
                                <select
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm bg-white"
                                    value={filters.spendingPeriod}
                                    onChange={(e) => updateFilter("spendingPeriod", e.target.value)}
                                >
                                    <option value="last_month">Last Month</option>
                                    <option value="last_3_months">Last 3 Months</option>
                                    <option value="last_6_months">Last 6 Months</option>
                                    <option value="all_time">All Time</option>
                                </select>
                            </div>

                            {/* Session Count Filter */}
                            <div className="space-y-3 bg-green-50 p-4 rounded-xl border border-green-200">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Star size={16} className="text-green-600" />
                                    Minimum Sessions
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 5"
                                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                                    value={filters.minSessions || ""}
                                    onChange={(e) => updateFilter("minSessions", e.target.value ? Number(e.target.value) : undefined)}
                                />
                                <p className="text-xs text-green-700">Users who have completed at least this many sessions</p>
                            </div>

                            {/* Registration Date Filter */}
                            <div className="space-y-3 bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <CalendarIcon size={16} className="text-orange-600" />
                                    Registration Date
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        placeholder="After"
                                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                                        value={filters.registeredAfter || ""}
                                        onChange={(e) => updateFilter("registeredAfter", e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        placeholder="Before"
                                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                                        value={filters.registeredBefore || ""}
                                        onChange={(e) => updateFilter("registeredBefore", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* User Type Filter */}
                            <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <UsersIcon size={16} className="text-purple-600" />
                                    User Type
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm bg-white"
                                    value={filters.userType}
                                    onChange={(e) => updateFilter("userType", e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="premium">Premium Users</option>
                                    <option value="regular">Regular Users</option>
                                </select>
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="excludeBlocked"
                                        checked={!filters.isBlocked}
                                        onChange={(e) => updateFilter("isBlocked", !e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="excludeBlocked" className="text-xs text-gray-600">
                                        Exclude blocked users
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Preview Section */}
                    {matchedUsersCount !== null && matchedUsersCount > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Eye size={20} className="text-indigo-600" />
                                    Preview Users
                                </h3>
                                <button
                                    onClick={() => {
                                        if (!showPreview) {
                                            fetchFilteredUsers();
                                        } else {
                                            setShowPreview(false);
                                        }
                                    }}
                                    disabled={fetchingUsers}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {fetchingUsers ? (
                                        <>
                                            <LoaderIcon className="animate-spin" size={16} />
                                            Loading...
                                        </>
                                    ) : showPreview ? (
                                        <>
                                            <ChevronUp size={16} />
                                            Hide Users
                                        </>
                                    ) : (
                                        <>
                                            <Eye size={16} />
                                            Show Users
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* User List */}
                            {showPreview && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {filteredUsers.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 font-medium">No users found</p>
                                        </div>
                                    ) : (
                                        <>
                                            {filteredUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-4 mt-3">
                                                                {user.totalSpending !== undefined && (
                                                                    <div className="flex items-center gap-1.5 text-xs">
                                                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                                            <TrendingUpIcon size={12} className="text-blue-600" />
                                                                        </div>
                                                                        <span className="text-gray-600">
                                                                            <span className="font-semibold text-gray-900">₹{user.totalSpending.toLocaleString()}</span> spent
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {user.sessionCount !== undefined && (
                                                                    <div className="flex items-center gap-1.5 text-xs">
                                                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                                            <Star size={12} className="text-green-600" />
                                                                        </div>
                                                                        <span className="text-gray-600">
                                                                            <span className="font-semibold text-gray-900">{user.sessionCount}</span> sessions
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {user.registeredAt && (
                                                                    <div className="flex items-center gap-1.5 text-xs">
                                                                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                                            <CalendarIcon size={12} className="text-orange-600" />
                                                                        </div>
                                                                        <span className="text-gray-600">
                                                                            Joined {new Date(user.registeredAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Pagination */}
                                            {matchedUsersCount > USERS_PER_PAGE && (
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                    <p className="text-sm text-gray-600">
                                                        Showing {((previewPage - 1) * USERS_PER_PAGE) + 1} - {Math.min(previewPage * USERS_PER_PAGE, matchedUsersCount)} of {matchedUsersCount}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setPreviewPage(p => p - 1);
                                                                fetchFilteredUsers();
                                                            }}
                                                            disabled={previewPage === 1 || fetchingUsers}
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Previous
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setPreviewPage(p => p + 1);
                                                                fetchFilteredUsers();
                                                            }}
                                                            disabled={previewPage >= Math.ceil(matchedUsersCount / USERS_PER_PAGE) || fetchingUsers}
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Matched Users Preview */}
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                                    <UsersIcon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-purple-700 font-semibold">Matched Users</p>
                                    {fetchingCount ? (
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <LoaderIcon className="animate-spin" size={16} />
                                            <span className="text-sm">Calculating...</span>
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-bold text-purple-900">
                                            {matchedUsersCount?.toLocaleString() || 0}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {matchedUsersCount !== null && matchedUsersCount > 0 && (
                                <div className="text-right">
                                    <p className="text-xs text-purple-600">Ready to assign</p>
                                    <p className="text-sm font-bold text-purple-900">
                                        {selectedCouponCode || "Select a coupon"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex gap-3">
                        <div className="text-blue-500 mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            <strong>Note:</strong> The selected coupon will be assigned to all users matching the above filters.
                            Users will see this coupon in their "My Rewards" section. This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border-gray-300"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-[2] py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-purple-300 disabled:opacity-70 flex items-center justify-center gap-2"
                        onClick={handleAssign}
                        disabled={loading || availableCoupons.length === 0 || matchedUsersCount === 0 || fetchingCount}
                    >
                        {loading ? <LoaderIcon className="animate-spin" size={18} /> : <GiftIcon size={18} />}
                        {loading ? "Assigning..." : `Assign to ${matchedUsersCount?.toLocaleString() || 0} Users`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BulkAssignCouponModal;




