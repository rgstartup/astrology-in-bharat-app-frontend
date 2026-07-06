import React from "react";
import Image from "next/image";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import Skeleton from "@/components/ui/Skeleton";

interface HistoryTabProps {
    loadingHistory: boolean;
    consultationHistory: any[];
    expandedSessions: Record<number, boolean>;
    toggleSession: (id: string) => void;
    onViewDetails: (session: any) => void;
    onReportIssue: (session: any) => void;
    consultationDisputes?: Record<number, any>;
    onViewDispute?: (dispute: any) => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({
    loadingHistory,
    consultationHistory,
    expandedSessions,
    toggleSession,
    onViewDetails,
    onReportIssue,
    consultationDisputes = {},
    onViewDispute,
    hasMore,
    loadingMore,
    onLoadMore
}) => {
    const { lang } = useLanguageStore();
    const t = (profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en).history;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden">
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h5
          className="text-lg font-bold text-gray-900 mb-0 flex items-center"
          style={fontStyle}
        >
          <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </span>
          {t.title}
        </h5>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        {loadingHistory ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-8">
                    <div className="space-y-2">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={80} height={20} />
                    </div>
                    <div className="space-y-2">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={100} height={20} />
                    </div>
                    <div className="space-y-2">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={70} height={20} />
                    </div>
                  </div>
                  <Skeleton width={100} height={32} className="rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : consultationHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
              <i className="fa-solid fa-calendar-check text-3xl text-gray-300"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.noHistory}
            </h6>
            <p className="text-gray-500 text-sm max-w-xs m-0" style={fontStyle}>
              {t.noHistoryHint}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {consultationHistory.filter(Boolean).map((session: any, idx: number) => (
              <div
                key={session.id || idx}
                className="group border-y sm:border border-gray-100 sm:rounded-3xl overflow-hidden sm:shadow-sm hover:shadow-md transition-all duration-300 bg-white -mx-4 sm:mx-0"
              >
                {/* Session Summary Header */}
                <div
                  className="bg-gray-50/50 p-4 sm:p-6 flex flex-wrap gap-6 items-center justify-between border-b border-gray-100 cursor-pointer hover:bg-gray-100/30 transition-colors"
                  onClick={() => toggleSession(session.id)}
                >
                  <div className="flex flex-wrap gap-8 items-center">
                    <div>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1"
                        style={fontStyle}
                      >
                        {t.sessionId}
                      </span>
                      <span className="font-bold text-gray-900">
                        #{session.id}
                      </span>
                    </div>
                    <div>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1"
                        style={fontStyle}
                      >
                        {t.date}
                      </span>
                      <span className="font-bold text-gray-900">
                        {(() => {
                          const dateVal = session.createdAt || session.created_at;
                          if (!dateVal) return t.na;
                          const d = new Date(dateVal);
                          return isNaN(d.getTime())
                            ? t.na
                            : d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                        })()}
                      </span>
                    </div>
                    <div>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1"
                        style={fontStyle}
                      >
                        {t.amountPaid}
                      </span>
                      <span className="font-bold text-blue-600 text-base md:text-lg">
                        ₹{session.total_cost || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-auto">
                    {/* Consultation Type Badge */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gray-100/80 border border-gray-200">
                      <i className={`fa-solid ${(session.type === "VIDEO_CALL" || session.session_type === "video") ? "fa-video text-purple-600" : (session.type === "AUDIO_CALL" || session.session_type === "audio") ? "fa-phone text-blue-600" : "fa-message text-blue-500"} text-[10px]`}></i>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-700" style={fontStyle}>
                        {(session.type === "VIDEO_CALL" || session.session_type === "video") ? t.viewVideo : (session.type === "AUDIO_CALL" || session.session_type === "audio") ? t.viewCall : t.viewChat.replace(" History", "").replace(" इतिहास देखें", "")}
                      </span>
                    </div>

                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        session.status?.toLowerCase() === "completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : (session.status?.toLowerCase() === "missed" || session.status?.toLowerCase() === "rejected" || session.status?.toLowerCase() === "failed")
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : (session.status?.toLowerCase() === "active" || session.status?.toLowerCase() === "pending")
                              ? "bg-sky-50 text-sky-600 border-sky-100"
                              : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                      style={fontStyle}
                    >
                      {session.terminatedBy === "admin"
                        ? t.terminatedByAdmin
                        : t.statusMap?.[session.status as keyof typeof t.statusMap] || session.status || t.scheduled}
                    </span>
                    <button
                      className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm transition-transform duration-300 ${
                        expandedSessions[session.id] ? "rotate-180" : ""
                      }`}
                    >
                      <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedSessions[session.id] && (
                  <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300 bg-white">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <Image
                            src={session.expert_image}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            alt={session.expert_name}
                            onError={(e) => {
                              (e.target as any).src = "/images/dummy-expert.jpg";
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                          <i className="fa-solid fa-check text-white text-[10px]"></i>
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-6">
                          <div>
                            <h5 className="font-bold text-gray-900 text-xl md:text-2xl mb-1">
                              {session.expert_name}
                            </h5>
                            <p className="text-gray-500 font-medium text-sm">
                              {session.expert_category}
                            </p>
                          </div>
                          <div className="md:text-right">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.amountPaid}</span>
                              <div className="flex items-baseline gap-2 justify-end">
                                <span className="text-lg md:text-xl font-black text-blue-600">₹{session.total_cost || 0}</span>
                                {session.rate && (
                                  <span className="text-[11px] font-bold text-gray-400">(@ ₹{session.rate}/min)</span>
                                )}
                              </div>
                            </div>
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
                              style={fontStyle}
                            >
                              {t.consultationFee}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 py-4 px-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600">
                              <i
                                className={`fa-solid ${
                                  (session.type === "VIDEO_CALL" || session.session_type === "video")
                                    ? "fa-video"
                                    : (session.type === "AUDIO_CALL" || session.session_type === "audio")
                                      ? "fa-phone"
                                      : "fa-message"
                                }`}
                              ></i>
                            </div>
                            <span
                              className="text-sm font-bold text-gray-700"
                              style={fontStyle}
                            >
                              {(session.type === "VIDEO_CALL" || session.session_type === "video") ? "Video Call" : (session.type === "AUDIO_CALL" || session.session_type === "audio") ? "Audio Call" : "Chat"} • {session.durationString || "0s"}
                            </span>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100/50 flex items-center justify-center text-amber-500">
                              <i className="fa-solid fa-star"></i>
                            </div>
                            <span
                              className="text-sm font-bold text-gray-700"
                              style={fontStyle}
                            >
                              {session.rating > 0 ? `${session.rating} ${t.rating}` : `N/A ${t.rating}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                      <button
                        onClick={() => onViewDetails(session)}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-3"
                        style={fontStyle}
                        disabled={session.type !== "CHAT" && session.session_type !== "chat" && session.session_type !== undefined}
                      >
                        <i className={`fa-solid ${
                          (session.type === "VIDEO_CALL" || session.session_type === "video")
                            ? "fa-video"
                            : (session.type === "AUDIO_CALL" || session.session_type === "audio")
                              ? "fa-phone"
                              : "fa-comments"
                        } text-lg`}></i>
                        {(session.type === "VIDEO_CALL" || session.session_type === "video")
                          ? t.viewVideo
                          : (session.type === "AUDIO_CALL" || session.session_type === "audio")
                            ? t.viewCall
                            : t.viewChat}
                      </button>

                      {consultationDisputes[session.id] ? (
                        <button
                          onClick={() => onViewDispute && onViewDispute(consultationDisputes[session.id])}
                          className="w-full sm:w-auto px-8 py-3 bg-orange text-white font-bold rounded-2xl hover:bg-orange/90 shadow-lg shadow-orange/20 transition-all flex items-center justify-center gap-3"
                          style={fontStyle}
                        >
                          <i className="fa-solid fa-comments text-lg"></i>
                          {t.reportIssueDiscussion}
                        </button>
                      ) : session.status === "issue_reported" ||
                      session.status === "dispute_raised" ? (
                        <div
                          className="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 flex items-center justify-center gap-3"
                          style={fontStyle}
                        >
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          {t.issueReported}
                        </div>
                      ) : (
                        <button
                          onClick={() => onReportIssue(session)}
                          className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-3"
                          style={fontStyle}
                        >
                          <i className="fa-solid fa-circle-exclamation text-lg"></i>
                          {t.reportIssue}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Load More Button */}
            {hasMore ? (
              <div className="flex justify-center mt-10">
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-300 flex items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
                  style={fontStyle}
                >
                  {loadingMore ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>{lang === "hi" ? "और लोड हो रहा है..." : "Loading More..."}</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrow-down-long"></i>
                      <span>{lang === "hi" ? "और लोड करें" : "Load More History"}</span>
                    </>
                  )}
                </button>
              </div>
            ) : consultationHistory.length > 0 && (
              <div className="flex flex-col items-center justify-center mt-12 py-8 border-t border-dashed border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p className="text-gray-400 text-sm font-medium" style={fontStyle}>
                  {lang === "hi" ? "आपने अपनी पूरी हिस्ट्री देख ली है" : "You've reached the end of your history"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;


