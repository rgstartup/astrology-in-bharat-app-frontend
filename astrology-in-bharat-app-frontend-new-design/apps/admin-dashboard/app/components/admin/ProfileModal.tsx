"use client";

import React, { useState } from "react";
import { X, LucideIcon, Play, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, ExternalLink, Download, CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";

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
  isOpen: boolean;
  onClose: () => void;
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
    variant: "primary" | "danger";
  }[];
}

export function ProfileModal({
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
  actions,
}: ProfileModalProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto animate-in fade-in duration-200 font-outfit">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-[#FCFBFA] rounded-[3rem] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-300 border border-white">

          <button onClick={onClose} className="absolute top-8 right-8 z-10 text-gray-400 hover:text-gray-900 bg-white shadow-sm p-3 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>

          {/* Header Section */}
          <div className="p-10 pb-0 flex flex-col lg:flex-row items-center lg:items-end gap-8 mb-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 to-orange-300 rounded-full blur opacity-20 group-hover:opacity-40 transition animate-pulse" />
              <img src={avatar || "https://avatar.iran.liara.run/public/boy"} className="relative w-40 h-40 rounded-full object-cover border-[8px] border-white shadow-2xl" alt={name} />
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 pb-4 text-center lg:text-left">
              <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{name}</h3>
              <p className="text-orange-600 font-black uppercase text-sm tracking-[0.3em] mb-4">{subtitle || "Astrologer"}</p>
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-3">
                {badges?.map((badge, idx) => (
                  <span key={idx} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-black/5 ${badge.color}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="px-10 pb-10 space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats?.map((stat, idx) => (
                <div key={idx} className={`${stat.bgColor} p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}>
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <stat.icon className="w-24 h-24" />
                  </div>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor} mb-4 relative z-10`} />
                  <p className="text-2xl font-black text-gray-900 leading-none mb-1 relative z-10">{stat.value}</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest relative z-10">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Profile Completion Checklist - Full Width */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
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
                        <span className={`text-sm font-bold transition-colors ${item.isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.label}
                        </span>
                        {expandedItems[item.label] ? (
                          <ChevronUp className="w-4 h-4 text-orange-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-orange-500" />
                        )}
                      </div>

                      {item.isComplete ? (
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                          <Circle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Expanded Value Section */}
                    {expandedItems[item.label] && (
                      <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-white/60 p-4 rounded-xl border border-orange-50/50">
                          {item.label === "Profile Picture" ? (
                            <img src={item.value} className="max-w-xs rounded-lg shadow-md border-2 border-white" alt={item.label} />
                          ) : item.label === "Gallery Photos" ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Array.isArray(item.value) && item.value.map((img: any, i: number) => (
                                <img key={i} src={img.url} className="w-full h-32 object-cover rounded-xl shadow-sm border-2 border-white" alt={`Gallery ${i}`} />
                              ))}
                            </div>
                          ) : item.label === "Introduction Video" ? (
                            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-white">
                              {item.value ? (
                                <video src={item.value} controls className="w-full h-full object-contain" />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                  <Play className="w-12 h-12 mb-2 opacity-20" />
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
                                  <AlertCircle className="w-8 h-8 mb-2" />
                                  <p className="text-xs font-bold uppercase tracking-widest">No document images found</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm font-black text-gray-700 leading-relaxed">{item.value || "No data provided"}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions - Now explicitly at the bottom of content grid area */}
            <div className="flex gap-4 pt-10 border-t border-gray-100">
              <button className="flex-1 py-5 rounded-[2rem] bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-gray-900/40 hover:bg-orange-500 transition-all hover:translate-y-[-4px]">
                Approve Expert Profile
              </button>
              <button className="px-10 py-5 rounded-[2rem] bg-rose-50 text-rose-500 font-black uppercase text-xs tracking-widest border border-rose-100 hover:bg-rose-100 transition-all">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}