import React from "react";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import Skeleton from "@/components/ui/Skeleton";

interface DisputesTabProps {
    disputes: any[];
    loading: boolean;
    onViewChat: (dispute: any) => void;
}

const DisputesTab: React.FC<DisputesTabProps> = ({ disputes, loading, onViewChat }) => {
    const { lang } = useLanguageStore();
    const t = (profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en).disputes;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  if (loading) {
    return (
      <div className="bg-white border-0 shadow-premium rounded-2xl overflow-hidden">
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex justify-between items-center">
            <Skeleton width={150} height={24} />
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                   {[1, 2, 3, 4].map(i => <th key={i} className="px-6 py-4"><Skeleton width={60} height={12} /></th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-5"><Skeleton width={80} height={20} className="mb-1" /><Skeleton width={100} height={12} /></td>
                    <td className="px-6 py-5"><Skeleton width={100} height={16} className="mb-2" /><Skeleton width={200} height={14} /></td>
                    <td className="px-6 py-5"><Skeleton width={80} height={24} className="rounded-full" /></td>
                    <td className="px-6 py-5 text-right"><Skeleton width={100} height={40} className="ml-auto rounded-xl" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden">
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h5
          className="text-lg font-bold text-gray-900 mb-0 flex items-center"
          style={fontStyle}
        >
          <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="fa-solid fa-headset"></i>
          </span>
          {t.title}
        </h5>
      </div>
      <div className="p-0 overflow-x-auto">
        {disputes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
              <i className="fa-solid fa-ticket text-3xl text-gray-300"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.noTickets}
            </h6>
            <p className="text-gray-500 text-sm max-w-xs m-0" style={fontStyle}>
              {t.noTicketsHint}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th
                      className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
                      style={fontStyle}
                    >
                      {t.ticketId}
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
                      style={fontStyle}
                    >
                      {t.category}
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
                      style={fontStyle}
                    >
                      {t.status}
                    </th>
                    <th
                      className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400"
                      style={fontStyle}
                    >
                      {t.action}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disputes.filter(Boolean).map((dispute) => (
                    <tr
                      key={dispute.id}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="block font-black text-gray-900 mb-1">
                          #DS-{dispute.id}
                        </span>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {dispute.createdAt || dispute.created_at
                            ? new Date(
                                dispute.createdAt || dispute.created_at
                              ).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                            : t.na}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className="inline-block px-3 py-1 mb-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 shadow-sm"
                          style={fontStyle}
                        >
                          {dispute.category || dispute.subject || t.defaultCategory}
                        </span>
                        <div className="text-sm text-gray-500 font-medium max-w-[200px] truncate group-hover:text-gray-700 transition-colors">
                          {dispute.description}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            dispute.status === "open"
                              ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100/50"
                              : dispute.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-100/50"
                                : dispute.status === "resolved"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100/50"
                                  : "bg-gray-50 text-gray-600 border-gray-100 shadow-sm"
                          }`}
                        >
                          {t.statusMap?.[dispute.status?.toLowerCase() as keyof typeof t.statusMap] || dispute.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button
                          onClick={() => onViewChat(dispute)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange text-white font-bold text-xs rounded-xl hover:bg-orange/90 transition-all shadow-lg shadow-orange/20"
                          style={fontStyle}
                        >
                          <i className="fa-solid fa-comments"></i>
                          {t.viewChat}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4 py-4">
              {disputes.filter(Boolean).map((dispute) => (
                <div key={dispute.id} className="border-y sm:border border-gray-100 sm:rounded-2xl p-5 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="block font-black text-gray-900 mb-1">
                        #DS-{dispute.id}
                      </span>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {dispute.createdAt || dispute.created_at
                          ? new Date(
                              dispute.createdAt || dispute.created_at
                            ).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })
                          : t.na}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        dispute.status === "open"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : dispute.status === "pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : dispute.status === "resolved"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                    >
                      {t.statusMap?.[dispute.status?.toLowerCase() as keyof typeof t.statusMap] || dispute.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span
                      className="inline-block px-3 py-1 mb-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700"
                    >
                      {dispute.category || dispute.subject || t.defaultCategory}
                    </span>
                    <div className="text-sm text-gray-500 font-medium">
                      {dispute.description}
                    </div>
                  </div>
                  <button
                    onClick={() => onViewChat(dispute)}
                    className="w-full flex justify-center items-center gap-2 px-5 py-2.5 bg-orange text-white font-bold text-xs rounded-xl hover:bg-orange/90 transition-all"
                  >
                    <i className="fa-solid fa-comments"></i>
                    {t.viewChat}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisputesTab;


