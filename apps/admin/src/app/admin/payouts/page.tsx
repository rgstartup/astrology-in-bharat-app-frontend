"use client";
import React, { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { getWithdrawals, updateWithdrawalStatus, getWithdrawalStats } from "@/services/admin.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib/utils/error";

export default function AdminPayoutsPage() {
    const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('expert');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<string>('pending');
    const [stats, setStats] = useState({
        totalPending: 0,
        totalProcessing: 0,
        totalSuccess: 0,
        totalRejected: 0,
        totalAmountPending: 0,
        totalAmountSuccess: 0,
    });

    const fetchPayouts = async (statusParam?: string) => {
        setLoading(true);
        const statusToFetch = statusParam !== undefined ? statusParam : selectedStatus;
        
        try {
            const [[payoutsData, payoutsError], [statsData, statsError]] = await Promise.all([
                getWithdrawals({ status: statusToFetch, role: userRole }),
                getWithdrawalStats(userRole)
            ]);



            if (payoutsError || statsError) {
                toast.error(getErrorMessage(payoutsError || statsError) || "Failed to load payout data");
                setLoading(false);
                return;
            }

            console.log("[AdminPayouts] Raw API Response:", { payoutsData, statsData });

            const data = (payoutsData as any)?.data || (payoutsData as any)?.items || (Array.isArray(payoutsData) ? payoutsData : []);
            console.log("[AdminPayouts] Setting Payout Requests:", data);
            setPayoutRequests(data);


            
            if (statsData) {
                const s = statsData as any;
                setStats({
                    totalPending: s.totalPending || 0,
                    totalProcessing: s.totalProcessing || 0,
                    totalSuccess: s.totalSuccess || 0,
                    totalRejected: s.totalRejected || 0,
                    totalAmountPending: s.totalAmountPending || 0,
                    totalAmountSuccess: s.totalAmountSuccess || 0,
                });
            }
        } catch (err) {
            toast.error(getErrorMessage(err) || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [selectedStatus, userRole]);


    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [currentRejectId, setCurrentRejectId] = useState<string | null>(null);

    const handleAction = async (id: string, status: 'approved' | 'rejected', remark?: string) => {
        setProcessingId(id);
        const [_, error] = await updateWithdrawalStatus(id, { status, remark });
        
        if (error) {
            console.error(`Failed to ${status} withdrawal:`, getErrorMessage(error));
            toast.error(getErrorMessage(error) || `Failed to ${status} withdrawal`);
            setProcessingId(null);
            return;
        }


        toast.success(`Withdrawal ${status === 'approved' ? 'Approved' : 'Rejected'} successfully`);
        setShowRejectModal(false);
        setRejectReason("");
        setCurrentRejectId(null);
        // Manually update local state — backend no longer returns updated data
        setPayoutRequests(prev => prev.map(r =>
            r.id === id ? { ...r, status: status === 'approved' ? 'processing' : 'rejected' } : r
        ));
        setProcessingId(null);
    };

    const openRejectModal = (id: string) => {
        setCurrentRejectId(id);
        setShowRejectModal(true);
    };


    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            processing: "bg-blue-100 text-blue-800 border-blue-200",
            success: "bg-green-100 text-green-800 border-green-200",
            rejected: "bg-red-100 text-red-800 border-red-200",
            failed: "bg-gray-100 text-gray-800 border-gray-200",
            cancelled: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return `px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${styles[status.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"}`;
    };

    const statusTabs = [
        { id: 'pending', label: 'Pending', icon: <Calendar className="w-4 h-4 mr-2" /> },
        { id: 'processing', label: 'Processing', icon: <Loader2 className="w-4 h-4 mr-2" /> },
        { id: 'success', label: 'Paid/Success', icon: <TrendingUp className="w-4 h-4 mr-2" /> },
        { id: 'rejected', label: 'Rejected', icon: <TrendingDown className="w-4 h-4 mr-2" /> },
        { id: 'failed', label: 'Failed', icon: <AlertCircle className="w-4 h-4 mr-2" /> },
        { id: 'all', label: 'All Requests', icon: <Wallet className="w-4 h-4 mr-2" /> },
    ];

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Role Tabs - Scrollable on mobile */}
                <div className="flex overflow-x-auto no-scrollbar bg-gray-100 p-1 rounded-xl w-full sm:w-fit mb-6 border border-gray-200">
                    <button
                        onClick={() => setUserRole('expert')}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            userRole === 'expert'
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Expert Payouts
                    </button>
                    <button
                        onClick={() => setUserRole('agent')}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            userRole === 'agent'
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Agent Payouts
                    </button>
                    <button
                        onClick={() => setUserRole('merchant')}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            userRole === 'merchant'
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Merchant Payouts
                    </button>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">
                        {userRole === 'expert' ? 'Expert' : userRole === 'agent' ? 'Agent' : 'Merchant'} Payout Management
                    </h1>
                    <p className="text-sm text-gray-600">Monitor {userRole} withdrawals, track success rates, and manage pending requests</p>
                </div>


                {/* Stats Grid - 2 cols mobile, 5 cols desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-5 border-t-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-medium text-gray-600">Pending</h3>
                            <Wallet className="w-4 h-4 text-yellow-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">{stats.totalPending}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Awaiting Admin</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-5 border-t-4 border-blue-400">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-medium text-gray-600">Approved</h3>
                            <Loader2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">{stats.totalProcessing}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Processing In Razorpay</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-5 border-t-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-medium text-gray-600">Paid</h3>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">{stats.totalSuccess}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Successfully Transferred</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-5 border-t-4 border-red-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-medium text-gray-600">Rejected/Failed</h3>
                            <TrendingDown className="w-4 h-4 text-red-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">{stats.totalRejected}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Declined or Error</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-5 border-t-4 border-emerald-600 bg-emerald-50/30">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-medium text-gray-600">Total Paid Vol</h3>
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-xl font-bold text-emerald-600">₹{stats.totalAmountSuccess.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Confirmed Outflow</p>
                    </div>
                </div>

                {/* Filter Tabs - Scrollable on mobile */}
                <div className="-mx-4 sm:mx-0 mb-4 sm:mb-6">
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 px-4 sm:px-0 flex-nowrap">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedStatus(tab.id)}
                            className={`flex items-center px-3 sm:px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                                selectedStatus === tab.id
                                    ? "bg-primary text-white shadow-md ring-2 ring-primary/20"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
                </div>



                {/* Payout Requests Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                            {statusTabs.find(t => t.id === selectedStatus)?.label}
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{payoutRequests.length}</span>
                        </h2>
                        <button 
                            onClick={() => fetchPayouts()}
                            className="text-xs text-primary font-medium hover:underline flex items-center"
                        >
                            <Loader2 className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {loading && payoutRequests.length === 0 ? (
                        <div className="p-12 flex justify-center items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : payoutRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <Wallet className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No Requests Found</h3>
                            <p className="text-gray-600 mb-6">Currently, there are no {selectedStatus} payout requests.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{userRole === 'expert' ? 'Expert' : userRole === 'agent' ? 'Agent' : 'Merchant'}</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Remark</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Array.isArray(payoutRequests) && payoutRequests.map((request) => (

                                        <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900 leading-none">{request.userName}</div>
                                                <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{request.withdrawal_no || request.withdrawalNo || `#${request.id}`}</div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 font-mono">₹{request.amount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {request.bankAccount ? (
                                                    <div className="text-[11px] text-gray-600 leading-relaxed">
                                                        <p className="font-bold text-gray-800">{request.bankAccount.bankName}</p>
                                                        <p>A/C: {request.bankAccount.accountNumber}</p>
                                                        <p>IFSC: {request.bankAccount.ifsc}</p>
                                                    </div>
                                                ) : <span className="text-red-500 text-xs italic font-medium">Missing Bank Info</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={getStatusBadge(request.status)}>
                                                        {request.status}
                                                    </span>
                                                    {request.remark && (
                                                        <p className="text-[10px] text-red-600 bg-red-50 p-1.5 rounded border border-red-100 max-w-[200px] whitespace-normal italic">
                                                            "{request.remark}"
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{new Date(request.date).toLocaleDateString()}</div>
                                                <div className="text-[10px] text-gray-400 font-mono italic">{new Date(request.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {request.status.toLowerCase() === 'pending' ? (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleAction(request.id, 'approved')}
                                                            disabled={processingId === request.id}
                                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50 font-bold shadow-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(request.id)}
                                                            disabled={processingId === request.id}
                                                            className="px-3 py-1 bg-white border border-red-200 text-red-600 rounded text-xs hover:bg-red-50 transition-all disabled:opacity-50 font-bold"
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 font-medium italic">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300 px-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl scale-in-center overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 rounded-2xl">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Reject Payout</h3>
                                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">ID: #{currentRejectId}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    Reason for Rejection
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="e.g. Invalid IFSC Code, Low balance, Security check failed..."
                                    className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm focus:border-red-500 focus:ring-0 transition-all resize-none placeholder:text-gray-300"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => currentRejectId && handleAction(currentRejectId, 'rejected', rejectReason)}
                                    disabled={!rejectReason.trim() || processingId === currentRejectId}
                                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                    {processingId === currentRejectId ? 'Processing...' : 'Confirm Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}





