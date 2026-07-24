"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
    ShoppingBag, 
    CheckCircle, 
    XCircle, 
    FileText, 
    X, 
    Building2, 
    CreditCard, 
    ShieldCheck, 
    Eye,
    AlertCircle,
    Download
} from "lucide-react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import { motion, AnimatePresence } from "framer-motion";

import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards, Button } from "@repo/ui";
import { 
    getAllListings, 
    updateListingStatus,
    getAdminMerchantProfiles,
    updateMerchantProfileStatus
} from "@/services/agent.service";
import type { AgentListing } from "@/app/components/agent/agent";

const STATUS_CLASS: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
    pending_verification: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-red-100 text-red-700",
};

export default function AdminPujaShopsPage() {
    const [viewMode, setViewMode] = useState<'agent' | 'self'>('agent');
    const [listings, setListings] = useState<AgentListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal State
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchListings = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = viewMode === 'agent' 
                ? await getAllListings({ type: "puja_shop", search: searchQuery })
                : await getAdminMerchantProfiles({ search: searchQuery });
                
            const data = res.data || (res as any).merchants || res;
            setListings(Array.isArray(data) ? data : []);
            setTotal(res.total || (Array.isArray(data) ? data.length : 0));
        } catch (err) {
            console.error("Failed to fetch puja shops:", err);
            toast.error(getErrorMessage(err) || "Failed to load puja shops");
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, viewMode]);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const handleStatusUpdate = async (id: string, status: "approved" | "rejected" | "active") => {
        try {
            setIsSubmitting(true);
            if (viewMode === 'agent') {
                await updateListingStatus(id, status as any);
            } else {
                // Update based on new consolidated merchant status logic
                const targetStatus = status === 'approved' ? 'active' : (status === 'rejected' ? 'suspended' : status);
                await updateMerchantProfileStatus(id, targetStatus);
            }
            
            toast.success(`Shop ${status === 'approved' || status === 'active' ? 'Approved' : 'Rejected'}`);

            setListings(prev => prev.map(l =>
                (l.id === id || (l as any)._id === id) ? { ...l, status: status === 'approved' ? 'active' : status } : l
            ));
            setIsModalOpen(false);
            setSelectedMerchant(null);
        } catch (err) {
            toast.error(getErrorMessage(err) || "Failed to update status");
        } finally {
            setIsSubmitting(false);
        }
    };

    const COLUMNS = [
        {
            key: "name",
            label: "Shop Name",
            render: (l: any) => (
                <div>
                    <p className="text-sm font-semibold text-gray-900">{l.shopName || l.name || l.listing_name || "Untitled"}</p>
                    <p className="text-xs font-medium text-gray-700 mt-0.5">{l.city || l.location || l.listing_location || "—"}</p>
                </div>
            ),
        },
        {
            key: "items",
            label: "Items Sold",
            render: (l: any) => {
                const count = l.total_orders ?? l.totalOrders ?? l.totalSales ?? l.total_sales ?? l.items ?? 0;
                return <p className="text-sm text-gray-900 font-bold">{count}</p>;
            },
        },
        {
            key: "agent",
            label: "OWNER / AGENT INFO",
            render: (l: any) => (
                <div className="min-w-[110px] py-1">
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                        {l.user?.name || l.managerName || l.agent_name || l.agentName || l.agent?.name || "—"}
                    </p>
                    <p className="text-[10px] font-mono text-purple-600 mt-0.5 font-bold">
                        {l.phone || l.agent_id || l.agent_code || l.agentCode || l.agent?.agent_id || "—"}
                    </p>
                    <p className="text-[10px] font-medium text-gray-700 mt-1 truncate max-w-[150px]" title={l.user?.email || l.email}>
                        {l.user?.email || l.email || "—"}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (l: any) => {
                const status = l.status === 'active' ? 'approved' : l.status;
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_CLASS[status] || STATUS_CLASS.pending}`}>
                        {l.status}
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Actions",
            render: (l: any) => {
                const isMerchant = viewMode === 'self';
                const isActive = l.status === 'active' || l.status === 'approved';
                
                return (
                    <div className="flex items-center gap-2">
                        {isMerchant ? (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(l.id || l._id, isActive ? "rejected" : "approved")}
                                    className={`px-3 h-8 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        isActive
                                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                        : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                                    }`}
                                >
                                    {isActive ? "Block" : "Unblock"}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setSelectedMerchant(l);
                                        setIsModalOpen(true);
                                    }}
                                    className="bg-[#301118] hover:bg-[#4a1a25] text-white border-none px-3 h-8 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <FileText className="w-3.5 h-3.5" /> DOCUMENTS
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-1">
                                {(l.status === "pending" || l.status === "pending_verification") ? (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => handleStatusUpdate(l.id || l._id, "approved")}
                                            className="bg-purple-600 hover:bg-purple-700 border-none px-1.5 h-7 text-[10px] font-black text-white"
                                        >
                                            <CheckCircle className="w-3 h-3 mr-0.5" /> APPROVE
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleStatusUpdate(l.id || l._id, "rejected")}
                                            className="px-1.5 h-7 text-[10px] font-black"
                                        >
                                            <XCircle className="w-3 h-3 mr-0.5" /> REJECT
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant={isActive ? "danger" : "primary"}
                                        onClick={() => handleStatusUpdate(l.id || l._id, isActive ? "rejected" : "approved")}
                                        className={`px-2 h-7 text-[10px] font-black tracking-widest rounded-lg transition-all ${
                                            isActive 
                                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                                            : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                                        }`}
                                    >
                                        {isActive ? "BLOCK" : "UNBLOCK"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];

    const statsConfig = useMemo(() => [
        {
            title: "Total Shops",
            value: listings.length,
            icon: ShoppingBag,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Pending Approval",
            value: listings.filter(l => l.status === "pending" || l.status === "pending_verification").length,
            icon: ShoppingBag,
            iconColor: "text-yellow-600",
            iconBgColor: "bg-yellow-100",
        },
    ], [listings]);

    return (
        <>
            <DataTable
                data={listings}
                columns={COLUMNS}
                searchKeys={["name", "listing_name", "agent_id", "agent_name"]}
                title={
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <span className="text-xl font-bold text-gray-900">Puja Shop Management</span>
                        <div className="flex bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl border border-gray-200/50">
                            <button 
                                onClick={() => setViewMode('agent')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'agent' ? 'bg-orange text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            >
                                By Agent
                            </button>
                            <button 
                                onClick={() => setViewMode('self')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'self' ? 'bg-orange text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            >
                                By Self
                            </button>
                        </div>
                    </div>
                }
                ariaTitle="Puja Shop Management"
                statsCards={<StatsCards stats={statsConfig} columns={3} />}
                onSearch={setSearchQuery}
                isLoading={isLoading}
                manualPagination
                totalItems={total}
                onPageChange={setPage}
            />

            {/* Merchant Document Verification Modal */}
            <AnimatePresence>
                {isModalOpen && selectedMerchant && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#FCFBFA] w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl border border-white flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Merchant Verification</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{selectedMerchant.shopName || selectedMerchant.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                
                                {/* 1. Business & Identity Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <SectionTitle icon={Building2} title="Business Information" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoCard label="GSTIN Number" value={selectedMerchant.isGstExempt ? "EXEMPTED" : (selectedMerchant.gstin || "N/A")} />
                                            <InfoCard label="PAN Number" value={selectedMerchant.pan || "N/A"} />
                                            <InfoCard label="Shop Category" value={selectedMerchant.category || "Puja Shop"} />
                                            <InfoCard label="Location" value={selectedMerchant.city || selectedMerchant.location || "N/A"} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <SectionTitle icon={CreditCard} title="Payout / Bank Details" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoCard label="Bank Name" value={selectedMerchant.bankName || "N/A"} />
                                            <InfoCard label="Acc. Holder" value={selectedMerchant.accountHolder || "N/A"} />
                                            <InfoCard label="Acc. Number" value={selectedMerchant.accountNumber || "N/A"} />
                                            <InfoCard label="IFSC Code" value={selectedMerchant.ifsc || "N/A"} />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Document Previews */}
                                <div className="space-y-6">
                                    <SectionTitle icon={Eye} title="Uploaded Documents" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        <DocPreview label="PAN Card (Front)" url={selectedMerchant.panFront} />
                                        <DocPreview label="PAN Card (Back)" url={selectedMerchant.panBack} />
                                        <DocPreview label="Aadhar Card (Front)" url={selectedMerchant.aadharFront} />
                                        <DocPreview label="Aadhar Card (Back)" url={selectedMerchant.aadharBack} />
                                        <DocPreview 
                                            label="GST Certificate" 
                                            url={selectedMerchant.gstCertificate} 
                                            disabled={selectedMerchant.isGstExempt} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Actions */}
                            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
                                {selectedMerchant.status !== 'rejected' && selectedMerchant.status !== 'suspended' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedMerchant.id || selectedMerchant._id, "rejected")}
                                        variant="danger"
                                        disabled={isSubmitting}
                                        className="px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> {selectedMerchant.status === 'active' || selectedMerchant.status === 'approved' ? 'Suspend Profile' : 'Reject Profile'}
                                    </Button>
                                )}
                                {selectedMerchant.status !== 'active' && selectedMerchant.status !== 'approved' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedMerchant.id || selectedMerchant._id, "approved")}
                                        disabled={isSubmitting}
                                        loading={isSubmitting}
                                        className="px-12 py-4 rounded-2xl bg-purple-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all hover:-translate-y-1"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Approve Shop
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

// Helper Components
function SectionTitle({ icon: Icon, title }: any) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-purple-600 rounded-full" />
            <Icon className="w-4 h-4 text-gray-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{title}</h3>
        </div>
    );
}

function InfoCard({ label, value }: any) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-gray-900 truncate">{value}</p>
        </div>
    );
}

function DocPreview({ label, url, disabled }: any) {
    if (disabled) {
        return (
            <div className="space-y-3 opacity-40">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</p>
                <div className="aspect-video bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                    <span className="sr-only">Not Required</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 group">
            <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
                {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="p-1 px-2 bg-purple-50 rounded-lg text-[8px] font-black text-purple-600 hover:bg-purple-100 transition-colors">
                        VIEW FULL
                    </a>
                )}
            </div>
            <div className="relative aspect-video bg-gray-100 rounded-3xl overflow-hidden border-2 border-white shadow-md group-hover:shadow-xl transition-all duration-500">
                {url ? (
                    <>
                        <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                             <a href={url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all">
                                <Eye className="w-5 h-5" />
                             </a>
                             <a href={url} download className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all" onClick={(e) => e.stopPropagation()}>
                                <Download className="w-5 h-5" />
                             </a>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                        <AlertCircle className="w-8 h-8" />
                        <span className="text-[8px] font-black uppercase">Not Uploaded</span>
                    </div>
                )}
            </div>
        </div>
    );
}
