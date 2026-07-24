"use client";

import React, { useState } from "react";
import { X, LucideIcon, Play, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, ExternalLink, Download, CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@repo/ui";

const XComp = X as any;
const PlayComp = Play as any;
const CheckCircleComp = CheckCircle as any;
const CheckCircle2Comp = CheckCircle2 as any;
const AlertCircleComp = AlertCircle as any;
const CircleComp = Circle as any;
const ChevronDownComp = ChevronDown as any;
const ChevronUpComp = ChevronUp as any;

interface DetailItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

interface StatCard {
  icon: LucideIcon;
  value: string | number;
  label: string;
  bgColor: string;
  iconColor: string;
}

interface DocumentItem {
  type: string;
  url: string;
  name?: string;
  title?: string;
  status?: string;
  category?: string;
  side?: string;
}

interface ProfileModalProps {
  expertId?: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
  avatar?: string;
  name: string;
  subtitle?: string;
  badges?: {
    label: string;
    color: string;
  }[];
  stats?: StatCard[];
  details: DetailItem[];
  bio?: string;
  documents?: DocumentItem[];
  checklist?: { label: string; isComplete: boolean; value?: any }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant: "primary" | "danger" | "secondary";
  }[];
  action2Label?: string;
  purchases?: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    items: { productName: string; quantity: number; price: number }[];
  }[];
}

export function ProfileModal({
  expertId,
  isOpen,
  onClose,
  avatar,
  name,
  subtitle,
  badges,
  stats,
  details,
  bio,
  documents,
  checklist,
  onStatusUpdate,
  action2Label,
  actions,
  purchases,
}: ProfileModalProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleStatusUpdate = async (status: string, reason?: string) => {
    if (!expertId) return;

    try {
      setIsSubmitting(true);
      const { updateExpertStatus } = await import("@/services/admin.service");
      const { toast } = await import("react-toastify");

      await updateExpertStatus(expertId, { status, reason });

      toast.success(status === 'approved' ? 'Expert approved successfully!' : 'Expert rejected');
      setIsRejecting(false);
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      console.error("Status update failed:", error);
      const { toast } = await import("react-toastify");
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto animate-in fade-in duration-200 font-outfit">
      <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-6 sm:py-8">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-[#FCFBFA] rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white flex flex-col">

          <button onClick={onClose} className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 text-gray-400 hover:text-gray-900 bg-white shadow-sm p-2 sm:p-3 rounded-full transition-all">
            <XComp className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
          {/* Header Section */}
          <div className="p-5 sm:p-10 pb-0 flex flex-col lg:flex-row items-center lg:items-end gap-4 sm:gap-8 mb-5 sm:mb-10">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 to-orange-300 rounded-full blur opacity-20 group-hover:opacity-40 transition animate-pulse" />
              {avatar ? (
                <img src={avatar} className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-full object-cover border-[5px] sm:border-[8px] border-white shadow-2xl" alt={name} />
              ) : (
                <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-full border-[5px] sm:border-[8px] border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 font-bold text-3xl sm:text-5xl">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-7 h-7 sm:w-10 sm:h-10 bg-emerald-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center text-white">
                <CheckCircle2Comp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="flex-1 pb-4 text-center lg:text-left w-full min-w-0 overflow-hidden">
              <h3 className="text-xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2 break-all sm:break-words">{name}</h3>
              <p className="text-orange-600 font-bold text-sm mb-3 sm:mb-4 break-words">{subtitle || "Expert"}</p>
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 sm:gap-3">
                {badges?.map((badge, idx) => (
                  <span key={idx} className={`px-3 sm:px-5 py-1 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm border border-black/5 ${badge.color}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-10 pb-5 sm:pb-10 space-y-6 sm:space-y-12">
            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon as any;
                  return (
                    <div key={idx} className={`${stat.bgColor} p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}>
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <Icon className="w-16 h-16 sm:w-24 sm:h-24" />
                      </div>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor} mb-2 sm:mb-4 relative z-10`} />
                      <p className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1 relative z-10">{stat.value}</p>
                      <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest relative z-10">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Details */}
            {details && details.length > 0 && (
              <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {details.map((detail, idx) => {
                    const Icon = detail.icon as any;
                    return (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-100 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-700 mb-0.5">{detail.label}</p>
                          <p className="text-sm font-semibold text-gray-900 break-all">{detail.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profile Completion Checklist - Full Width */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Profile Completion Status</h4>
                <span className="text-xs font-black text-orange-600 bg-orange-50 px-4 py-2 rounded-full uppercase tracking-tighter">
                  {checklist?.filter(c => c.isComplete).length}/{checklist?.length} Ready
                </span>
              </div>
              <div className="space-y-4">
                {checklist?.map((item, idx) => (
                  <div key={idx} className="overflow-hidden bg-gray-50/50 hover:bg-orange-50/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-orange-100">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleItem(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold transition-colors ${item.isComplete ? 'text-gray-900' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                        {expandedItems[item.label] ? (
                          <ChevronUpComp className="w-4 h-4 text-orange-500" />
                        ) : (
                          <ChevronDownComp className="w-4 h-4 text-orange-500" />
                        )}
                      </div>

                      {item.isComplete ? (
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                          <CheckCircleComp className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-200">
                          <CircleComp className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Expanded Value Section */}
                    {expandedItems[item.label] && (
                      <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-white/60 p-4 rounded-xl border border-orange-50/50">
                          {item.label === "Profile Picture" ? (
                            <a href={item.value} target="_blank" rel="noopener noreferrer">
                              <img src={item.value} className="max-w-xs rounded-lg shadow-md border-2 border-white hover:opacity-90 transition-opacity" alt={item.label} />
                            </a>
                          ) : item.label === "Gallery Photos" || item.label === "Certificates" ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Array.isArray(item.value) && item.value.map((img: any, i: number) => (
                                <img key={i} src={img.url} className="w-full h-32 object-cover rounded-xl shadow-sm border-2 border-white" alt={`${item.label} ${i}`} />
                              ))}
                            </div>
                          ) : item.label === "Introduction Video" ? (
                            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-white">
                              {item.value ? (
                                <video src={item.value} controls className="w-full h-full object-contain" />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                  <PlayComp className="w-12 h-12 mb-2 opacity-20" />
                                  <p className="text-xs font-bold uppercase tracking-widest">No video uploaded</p>
                                </div>
                              )}
                            </div>
                          ) : item.label.includes("Card") ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* ... Aadhaar/PAN rendering ... */}
                              {Array.isArray(item.value) && item.value.length > 0 ? (
                                item.value.map((doc: any, i: number) => (
                                  <div key={i} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">{doc.side || 'Document'} View</p>
                                    </div>
                                    <img src={doc.url} className="w-full h-auto rounded-2xl shadow-xl border-4 border-white object-cover" alt={`${item.label} ${doc.side}`} />
                                  </div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                  <AlertCircleComp className="w-8 h-8 mb-2" />
                                  <p className="text-xs font-bold uppercase tracking-widest">No document images found</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm font-black text-gray-700 leading-relaxed" suppressHydrationWarning>{item.value || "No data provided"}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase History Section */}
            {purchases && purchases.length > 0 && (
              <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Purchase History (Things Bought)</h4>
                  <span className="text-xs font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-full uppercase tracking-tighter">
                    {purchases.length} Orders
                  </span>
                </div>
                <div className="space-y-6">
                  {purchases.map((order, idx) => (
                    <div key={idx} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order #{order.id}</p>
                          <p className="text-xs font-bold text-gray-500" suppressHydrationWarning>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-gray-900">₹{order.amount}</p>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <p className="text-sm font-bold text-gray-700">{item.productName}</p>
                            </div>
                            <p className="text-sm font-black text-gray-400">x{item.quantity} - ₹{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-10 border-t border-gray-100">
              {actions ? (
                actions.map((action, idx) => (
                  <Button
                    key={idx}
                    onClick={action.onClick}
                    variant={action.variant}
                    className="flex-1 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all"
                  >
                    {action.label}
                  </Button>
                ))
              ) : expertId ? (
                <>
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1 py-5 rounded-[2rem] bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-gray-900/40 hover:bg-orange-500 transition-all hover:translate-y-[-4px]"
                  >
                    Approve Expert Profile
                  </Button>
                  <Button
                    onClick={() => setIsRejecting(true)}
                    disabled={isSubmitting}
                    variant="danger"
                    className="px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all"
                  >
                    {action2Label || "Reject"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onClose}
                  variant="secondary"
                  className="w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all hover:bg-gray-100 border border-gray-200"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
          </div>{/* end scrollable content */}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsRejecting(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-300 border border-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                <AlertCircleComp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900">Rejection Reason</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explain why this profile is being rejected</p>
              </div>
            </div>

            <textarea
              className="w-full h-40 bg-gray-50 rounded-3xl p-6 text-sm font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none mb-6"
              placeholder="E.g. Address proof is missing, or Aadhar card photo is blurred..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex gap-4">
              <Button
                onClick={() => setIsRejecting(false)}
                variant="secondary"
                className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected', rejectReason)}
                disabled={isSubmitting || !rejectReason.trim()}
                loading={isSubmitting}
                variant="danger"
                className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/30 transition-all hover:translate-y-[-2px]"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



