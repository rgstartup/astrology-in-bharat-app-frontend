"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "../../../lib/translations/profile";
import Skeleton from "@/components/ui/Skeleton";

interface PujaBookingsTabProps {
  loading: boolean;
  bookings: any[];
  onUpdateStatus: (id: string, status: string, extra?: any) => Promise<boolean>;
  onReportIssue?: (booking: any) => void;
  pujaDisputes?: Record<number, any>;
  onViewDispute?: (dispute: any) => void;
}

// Simple native date formatter to replace date-fns
const formatDate = (dateString: string, includeTime = false) => {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
    }
    return date.toLocaleDateString("en-IN", options);
  } catch (e) {
    return "TBD";
  }
};

const PujaBookingsTab: React.FC<PujaBookingsTabProps> = ({
  loading,
  bookings,
  onUpdateStatus,
  onReportIssue,
  pujaDisputes = {},
  onViewDispute
}) => {
  const { lang } = useLanguageStore();
  const t = profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};
  
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showRescheduleForm, setShowRescheduleForm] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleMessage, setRescheduleMessage] = useState("");

  const handleAction = async (id: string, status: string, extra: any = {}) => {
    try {
      setIsProcessing(id);
      await onUpdateStatus(id, status, extra);
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsProcessing(null);
      setShowRescheduleForm(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      on_hold: "bg-purple-50 text-purple-600 border-purple-100",
      rejected: "bg-red-50 text-red-600 border-red-100",
    };
    const label: any = {
      pending: t.pujas.status.pending,
      accepted: t.pujas.status.accepted,
      confirmed: t.pujas.status.confirmed,
      on_hold: t.pujas.status.onHold,
      rejected: t.pujas.status.rejected,
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.pending}`} style={fontStyle}>
        {label[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <Skeleton width={96} height={96} variant="circular" />
                <Skeleton width={80} height={16} className="mt-4" />
                <Skeleton width={60} height={12} className="mt-1" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton width={200} height={24} />
                    <Skeleton width={100} height={16} />
                  </div>
                  <Skeleton width={80} height={32} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton width="100%" height={50} className="rounded-2xl" />
                  <Skeleton width="100%" height={50} className="rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 border border-orange-100">
          <i className="fa-solid fa-om text-3xl text-orange-400"></i>
        </div>
        <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>{t.pujas.noBookings}</h6>
        <p className="text-gray-500 text-sm max-w-xs m-0" style={fontStyle}>{t.pujas.noBookingsHint}</p>
        <a href="/online-puja" className="mt-6 px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-100" style={fontStyle}>
          {t.pujas.exploreBtn}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white sm:rounded-3xl border-y sm:border border-gray-100 sm:shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 -mx-4 sm:mx-0">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Expert & Ritual Info */}
              <div className="shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-50 overflow-hidden bg-orange-50 shadow-inner">
                    <Image
                      src={booking.expert?.user?.profile_picture || booking.expert?.user?.avatar || "/images/dummy-expert.jpg"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={booking.expert?.user?.name || "Expert"}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
                <h4 className="mt-4 font-bold text-gray-900 text-lg leading-tight">{booking.expert?.user?.name}</h4>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-1" style={fontStyle}>
                    {t.pujas.vedicExpert}
                </p>
              </div>

              {/* Middle: Booking Details */}
              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-50 pb-5">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1 leading-tight" style={fontStyle}>
                        {booking.puja?.name || t.pujas.ritual}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                       {getStatusBadge(booking.status)}
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">#{booking.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-black text-emerald-600">₹{booking.price}</div>
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]" style={fontStyle}>
                        {t.pujas.ritualFee}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-calendar-day"></i>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest" style={fontStyle}>{t.pujas.scheduledFor}</span>
                      <span className="text-sm font-bold text-gray-700">
                        {formatDate(booking.scheduled_date)}
                      </span>
                    </div>
                  </div>
                  <div className="group flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest" style={fontStyle}>{t.pujas.timeSlot}</span>
                      <span className="text-sm font-bold text-gray-700">{booking.scheduled_time || "TBD"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2" style={fontStyle}>
                    <i className="fa-solid fa-video text-xs"></i>
                    {booking.mode === 'online' ? t.pujas.onlineRitual : (booking.mode === 'home_visit_with' ? t.pujas.homeVisitWith : t.pujas.homeVisitBasic)}
                  </span>
                </div>

                {booking.expert_message && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
                    <span className="block text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1" style={fontStyle}>{t.pujas.expertMessage}</span>
                    <p className="text-sm text-blue-700 font-medium italic">" {booking.expert_message} "</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-wrap gap-4 items-center justify-between">
              <div className="text-xs text-gray-400 flex items-center gap-2" style={fontStyle}>
                <i className="fa-solid fa-circle-info"></i>
                {t.pujas.requestSentOn} {formatDate(booking.created_at, true)}
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {pujaDisputes[booking.id] ? (
                  <button
                    onClick={() => onViewDispute && onViewDispute(pujaDisputes[booking.id])}
                    className="flex-1 sm:flex-none px-6 py-2 bg-orange text-white font-bold text-xs rounded-xl hover:bg-orange/90 transition-all shadow-md flex items-center justify-center gap-2"
                    style={fontStyle}
                  >
                    <i className="fa-solid fa-comments"></i>
                    {t.pujas.reportIssueDiscussion}
                  </button>
                ) : (
                  <button
                    onClick={() => onReportIssue && onReportIssue(booking)}
                    className="flex-1 sm:flex-none px-6 py-2 border border-red-100 text-red-500 font-bold text-xs rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    style={fontStyle}
                  >
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {t.pujas.reportIssue}
                  </button>
                )}

                {booking.status === 'on_hold' && (
                  <>
                    <button
                      disabled={isProcessing === booking.id}
                      onClick={() => handleAction(booking.id, 'confirmed')}
                      className="flex-1 sm:flex-none px-6 py-3 md:px-8 md:py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                      style={fontStyle}
                    >
                      {isProcessing === booking.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-credit-card"></i>}
                      {t.pujas.btnAcceptPay}
                    </button>
                    <button
                      disabled={isProcessing === booking.id}
                      onClick={() => setShowRescheduleForm(booking.id)}
                      className="flex-1 sm:flex-none px-6 py-3 md:px-8 md:py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                      style={fontStyle}
                    >
                      {t.pujas.btnReschedule}
                    </button>
                  </>
                )}

                {booking.status === 'pending' && (
                   <button
                    disabled={true}
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl border border-gray-100 cursor-not-allowed flex items-center justify-center gap-2"
                    style={fontStyle}
                  >
                    <i className="fa-solid fa-hourglass-half animate-spin"></i>
                    {t.pujas.btnAwaiting}
                  </button>
                )}

                {booking.status === 'accepted' && (
                   <button
                    disabled={isProcessing === booking.id}
                    onClick={() => handleAction(booking.id, 'confirmed')}
                    className={`w-full sm:w-auto px-6 py-3 md:px-10 md:py-4 bg-orange-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 ${isProcessing === booking.id ? 'opacity-70 cursor-wait' : 'hover:bg-orange-700 cursor-pointer active:scale-95'}`}
                    style={fontStyle}
                  >
                    {isProcessing === booking.id ? (
                       <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                    ) : (
                       <i className="fa-solid fa-shield-halved text-lg"></i>
                    )}
                    {t.pujas.btnPayNow}
                  </button>
                )}
              </div>
            </div>

            {/* Reschedule Inline Form */}
            {showRescheduleForm === booking.id && (
              <div className="mt-8 p-6 bg-orange-50 rounded-3xl border border-orange-100 animate-in slide-in-from-top-4 duration-300">
                <h5 className="font-bold text-orange-900 mb-4 flex items-center gap-2" style={fontStyle}>
                  <i className="fa-solid fa-calendar-plus"></i> {t.pujas.rescheduleTitle}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5 ml-1" style={fontStyle}>{t.pujas.newDate}</label>
                    <input 
                      type="date" 
                      value={rescheduleDate} 
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:ring-0 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5 ml-1" style={fontStyle}>{t.pujas.newTime}</label>
                    <input 
                      type="time" 
                      value={rescheduleTime} 
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:ring-0 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5 ml-1" style={fontStyle}>{t.pujas.messageToExpert}</label>
                  <textarea 
                    placeholder={t.pujas.messagePlaceholder}
                    value={rescheduleMessage}
                    onChange={(e) => setRescheduleMessage(e.target.value)}
                    className="w-full h-24 px-4 py-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:ring-0 outline-none text-sm transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(booking.id, 'pending', { scheduled_date: rescheduleDate, scheduled_time: rescheduleTime, user_message: rescheduleMessage })}
                    className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all active:scale-95"
                    style={fontStyle}
                  >
                    {t.pujas.btnSendProposal}
                  </button>
                  <button
                    onClick={() => setShowRescheduleForm(null)}
                    className="flex-1 bg-white text-gray-500 font-bold py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
                    style={fontStyle}
                  >
                    {t.pujas.btnCancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PujaBookingsTab;
