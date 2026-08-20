"use client";
import React, { useEffect, useState, useRef } from "react";
import { useLanguageStore, useAuthStore } from "@repo/store";
import { profileTranslations } from "../../../lib/translations/profile";
import { api } from "@/actions";
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaFire, FaChevronDown, FaDownload, FaTrash } from "react-icons/fa";

// ─── helpers ─────────────────────────────────────────────────────────────────
const GUNA_COLORS = ["#60a5fa","#f97316","#22c55e","#3b82f6","#60a5fa","#4ade80","#22c55e","#1e293b"];
const GUNA_NAME_BY_ID: Record<number, string> = {1:"Varna",2:"Vashya",3:"Tara",4:"Yoni",5:"Graha Maitri",6:"Gana",7:"Bhakoot",8:"Nadi"};
const GUNA_ICONS: Record<string, string> = {"Varna":"fa-user","Vashya":"fa-magnet","Tara":"fa-star","Yoni":"fa-paw","Graha Maitri":"fa-hands-holding-circle","Gana":"fa-users","Bhakoot":"fa-heart","Nadi":"fa-droplet"};
const ICON_STYLE: Record<string, string> = {"Varna":"bg-pink-50 text-pink-400","Vashya":"bg-pink-50 text-pink-400","Tara":"bg-[#f4f7ed] text-[#84cc16]","Gana":"bg-[#f4f7ed] text-[#84cc16]","Yoni":"bg-[#edf7f0] text-[#22c55e]","Graha Maitri":"bg-[#edf7f0] text-[#22c55e]","Bhakoot":"bg-[#fff8ed] text-[#f59e0b]","Nadi":"bg-[#fff8ed] text-[#f59e0b]"};
const safeStr = (val: any, fb = "") => (val === null || val === undefined || typeof val === "object") ? fb : String(val);

function buildConic(gunas: any[]) {
  if (!gunas.length) return "conic-gradient(#e2e8f0 0% 100%)";
  const total = gunas.reduce((a: number, g: any) => a + (g.maximum_points || 1), 0);
  let angle = 0;
  return `conic-gradient(${gunas.map((g: any, i: number) => {
    const pct = ((g.maximum_points || 1) / total) * 100;
    const s = angle; angle += pct;
    return `${GUNA_COLORS[i % GUNA_COLORS.length]} ${s.toFixed(1)}% ${angle.toFixed(1)}%`;
  }).join(",")})`;
}

function getGunaRating(obtained: number, max: number) {
  if (obtained === max) return { text: "Excellent", color: "text-green-600", icon: <FaCheckCircle className="text-green-500 text-[10px]" /> };
  if (obtained >= max / 2) return { text: "Good", color: "text-orange-500", icon: <FaCheckCircle className="text-orange-400 text-[10px]" /> };
  return { text: "Average", color: "text-amber-500", icon: <FaExclamationTriangle className="text-amber-400 text-[10px]" /> };
}

function ExpandedReport({ report, user }: { report: any; user: any }) {
  const matchData = report.match_result?.data ?? report.match_result ?? {};
  const gunas: any[] = matchData?.guna_milan?.guna ?? [];
  const totalScore = matchData?.guna_milan?.total_points ?? 0;
  const maxScore = matchData?.guna_milan?.maximum_points ?? 36;
  const scorePercentage = Math.min((totalScore / maxScore) * 100, 100);
  const isExcellent = totalScore >= 18;
  const hasManglik = matchData?.boy_mangal_dosha_details?.has_dosha || matchData?.girl_mangal_dosha_details?.has_dosha;
  const conic = buildConic(gunas);

  const handleDownload = () => window.print();

  // Format details for print header
  const bd = report.boy_details ?? {};
  const gd = report.girl_details ?? {};
  const boyName  = bd.name  || "—";
  const girlName = gd.name  || "—";
  const boyPlace = bd.place || "—";
  const girlPlace= gd.place || "—";
  const fmt = (dt: string) => dt ? new Date(dt).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
  const boyDOB  = fmt(bd.datetime);
  const girlDOB = fmt(gd.datetime);

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-${report.id}, #report-${report.id} * { visibility: visible; }
          #report-${report.id} { position: absolute; left: 0; top: 0; width: 100%; padding: 0 20px; }
          .print-hidden { display: none !important; }
        }
      `}</style>
      
      <div className="mt-4 border-t border-gray-100 pt-4 space-y-5" id={`report-${report.id}`}>
        
        {/* Download button (Hidden in Print) */}
        <div className="flex justify-end print-hidden">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-[12px] font-semibold hover:bg-orange-100 transition-colors"
          >
            <FaDownload className="text-sm" /> Download Report
          </button>
        </div>

        {/* ── Print Only Header ── */}
        <div className="hidden print:block mb-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <img src="/images/logo.png" className="h-14" alt="Astrology in Bharat" />
            <div className="text-right">
              <h1 className="text-xl font-black text-slate-800">Kundali Matching Report</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Generated: {new Date(report.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" })}</p>
              <p className="text-[10px] text-gray-400">ID: {report.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 bg-[#fff9f4] p-5 rounded-2xl border border-orange-100">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center"><i className="fa-solid fa-mars"></i></div>
                <h3 className="font-bold text-blue-700 text-sm">Boy (Groom)</h3>
              </div>
              <table className="text-xs w-full">
                <tbody>
                  <tr><td className="text-gray-500 py-1 w-20">Name</td><td className="font-semibold text-slate-800">{boyName}</td></tr>
                  <tr><td className="text-gray-500 py-1">Date & Time</td><td className="font-semibold text-slate-800">{boyDOB}</td></tr>
                  <tr><td className="text-gray-500 py-1">Birth Place</td><td className="font-semibold text-slate-800">{boyPlace}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="border-l border-orange-200 pl-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center"><i className="fa-solid fa-venus"></i></div>
                <h3 className="font-bold text-pink-700 text-sm">Girl (Bride)</h3>
              </div>
              <table className="text-xs w-full">
                <tbody>
                  <tr><td className="text-gray-500 py-1 w-20">Name</td><td className="font-semibold text-slate-800">{girlName}</td></tr>
                  <tr><td className="text-gray-500 py-1">Date & Time</td><td className="font-semibold text-slate-800">{girlDOB}</td></tr>
                  <tr><td className="text-gray-500 py-1">Birth Place</td><td className="font-semibold text-slate-800">{girlPlace}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* 3-panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Panel 1 — Overall Compatibility */}
        <div className="lg:col-span-4 bg-[#fff9f4] border border-orange-100 rounded-2xl p-5 flex flex-col">
          <p className="text-[13px] font-bold text-slate-800 text-center mb-4">Overall Compatibility</p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className={`text-[50px] leading-none font-black ${isExcellent ? "text-[#f95700]" : "text-slate-700"}`}>{totalScore}</span>
            <span className="text-[20px] font-bold text-[#f95700]">/ {maxScore}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-5">
            <FaCheckCircle className="text-green-500 text-base" />
            <span className="text-[13px] font-bold text-green-600">{isExcellent ? "Excellent Match" : "Moderate Match"}</span>
          </div>
          <div className="h-2.5 w-full bg-[#f0e4dc] rounded-full overflow-hidden mb-1">
            <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" style={{ width: `${scorePercentage}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1.5 mb-4">
            <span>0</span><span className="text-center leading-tight">18<br/>Average</span><span className="text-right leading-tight">36<br/>Best</span>
          </div>
          <div className="bg-[#f0f9f3] border border-green-100 rounded-xl p-3 flex gap-2">
            <FaCheckCircle className="text-green-500 mt-0.5 shrink-0 text-[12px]" />
            <p className="text-[11px] text-green-800 font-medium leading-relaxed">
              {isExcellent ? "Excellent match. Great compatibility and a blessed future together." : "Moderate match. Some areas may need attention."}
            </p>
          </div>
        </div>

        {/* Panel 2 — Guna Milan Doughnut */}
        <div className="lg:col-span-4 bg-[#fff9f4] border border-orange-100 rounded-2xl p-5">
          <p className="text-[13px] font-bold text-slate-800 mb-4">Guna Milan Score</p>
          <div className="flex items-center gap-5">
            <div className="shrink-0 relative rounded-full" style={{ width: 100, height: 100, background: gunas.length ? conic : "#e2e8f0", padding: 13 }}>
              <div className="w-full h-full bg-[#fff9f4] rounded-full flex flex-col items-center justify-center">
                <span className="text-[22px] font-black text-[#f95700] leading-none">{totalScore}</span>
                <span className="text-[10px] font-semibold text-slate-400">/{maxScore}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {gunas.slice(0, 8).map((item: any, idx: number) => {
                const name = GUNA_NAME_BY_ID[item.id] ?? safeStr(item.name, `Guna ${idx + 1}`);
                return (
                  <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: GUNA_COLORS[idx % GUNA_COLORS.length] }} />
                      <span className="text-slate-600 truncate">{name}</span>
                    </div>
                    <span className="font-semibold text-slate-700 shrink-0">
                      {item.obtained_points}<span className="text-slate-400 font-normal"> / {item.maximum_points}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 3 — Dosha Cards */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className={`flex-1 rounded-2xl border p-3.5 flex gap-3 items-center ${hasManglik ? "bg-red-50 border-red-100" : "bg-[#fffcf8] border-orange-100"}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${hasManglik ? "bg-red-100 text-red-500" : "bg-orange-100 text-orange-500"}`}>
              <FaFire className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">Manglik Status</p>
              <h4 className={`text-[12px] font-bold ${hasManglik ? "text-red-600" : "text-slate-800"}`}>{hasManglik ? "Dosha Present" : "Both Non-Manglik"}</h4>
              <p className="text-[10px] text-slate-400">No Manglik Dosha</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-3.5 flex gap-3 items-center">
            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-100 text-green-500 flex items-center justify-center shrink-0"><FaShieldAlt className="text-sm" /></div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">Bhakoot Dosha</p>
              <h4 className="text-[12px] font-bold text-green-600">Not Present</h4>
              <p className="text-[10px] text-slate-400">No Bhakoot Dosha</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-3.5 flex gap-3 items-center">
            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-100 text-green-500 flex items-center justify-center shrink-0"><FaShieldAlt className="text-sm" /></div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">Nadi Dosha</p>
              <h4 className="text-[12px] font-bold text-green-600">Not Present</h4>
              <p className="text-[10px] text-slate-400">Nadi Milan is Good</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Guna Milan Grid */}
      {gunas.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3">Detailed Guna Milan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gunas.map((item: any, idx: number) => {
              const name = GUNA_NAME_BY_ID[item.id] ?? safeStr(item.name, `Guna ${idx + 1}`);
              const rating = getGunaRating(item.obtained_points, item.maximum_points);
              const iconStyle = ICON_STYLE[name] ?? "bg-orange-50 text-orange-400";
              return (
                <div key={idx} className="bg-white border border-orange-100/60 rounded-2xl p-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconStyle}`}>
                    <i className={`fa-solid ${GUNA_ICONS[name] || "fa-star"} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{name}</p>
                    <div className="flex items-center gap-1 mt-0.5">{rating.icon}<span className={`text-[10px] font-semibold ${rating.color}`}>{rating.text}</span></div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-slate-800">{item.obtained_points}<span className="text-[11px] text-gray-400"> / {item.maximum_points}</span></p>
                    <p className={`text-[10px] font-semibold ${rating.color}`}>{rating.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

// ─── Main ReportsTab ──────────────────────────────────────────────────────────
const ReportsTab: React.FC = () => {
    const { lang } = useLanguageStore();
    const { user } = useAuthStore();
    const t = profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [res, err] = await api.get<any>("/astrology/my-kundli-reports");
                if (res?.data) setReports(res.data);
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleDeleteReport = async (id: string) => {
        if (!confirm("Are you sure you want to delete this report?")) return;
        try {
            await api.delete(`/astrology/kundli-reports/${id}`);
            setReports((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error("Failed to delete report", error);
            alert("Failed to delete report. Please try again.");
        }
    };

    return (
        <div className="bg-white border-0 shadow-sm rounded-2xl mb-4 overflow-hidden">
            <div className="bg-white px-6 pt-6 pb-2 mb-2 flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#e8f5e9", color: "#43a047" }}>
                    <i className="fa-solid fa-scroll"></i>
                </div>
                <h5 className="text-xl font-bold text-gray-900 m-0" style={fontStyle}>{t.reports.title}</h5>
            </div>

            <div className="px-4 sm:px-6 pb-6 pt-0">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center p-8">
                        <div className="mb-4 text-gray-200"><i className="fa-solid fa-file-invoice fa-3x"></i></div>
                        <h6 className="font-bold text-gray-800" style={fontStyle}>{t.reports.noReports}</h6>
                        <p className="text-sm text-gray-500 mt-1" style={fontStyle}>{t.reports.noReportsHint}</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        {reports.map((report) => {
                            const matchData = report.match_result?.data ?? report.match_result;
                            const score = matchData?.guna_milan?.total_points ?? 0;
                            const maxScore = matchData?.guna_milan?.maximum_points ?? 36;
                            const isGood = score >= 18;
                            const isExpanded = expandedId === report.id;

                            const boyDate = report.boy_details?.datetime
                                ? new Date(report.boy_details.datetime).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : "—";
                            const girlDate = report.girl_details?.datetime
                                ? new Date(report.girl_details.datetime).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : "—";

                            return (
                                <div key={report.id} className="border-y sm:border border-gray-100 sm:rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow -mx-4 sm:mx-0 bg-white">
                                    {/* ── Card Header ── */}
                                    <div className="relative flex flex-col md:flex-row items-center justify-center py-2">
                                        
                                        <div className="flex items-center justify-center gap-6 md:gap-16">
                                            {/* Boy */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                                    <i className="fa-solid fa-mars"></i>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">Boy</p>
                                                    <p className="text-[10px] text-gray-400">{boyDate}</p>
                                                </div>
                                            </div>

                                            {/* Score Badge */}
                                            <div className="text-center min-w-[100px]">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${isGood ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                                    <i className="fa-solid fa-heart"></i>
                                                    {score} / {maxScore}
                                                </div>
                                                <p className={`text-[10px] font-semibold mt-0.5 ${isGood ? 'text-green-500' : 'text-red-400'}`}>
                                                    {isGood ? 'Excellent Match' : 'Needs Review'}
                                                </p>
                                            </div>

                                            {/* Girl */}
                                            <div className="flex items-center gap-2">
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-800 text-sm">Girl</p>
                                                    <p className="text-[10px] text-gray-400">{girlDate}</p>
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                                                    <i className="fa-solid fa-venus"></i>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button (Right Aligned) */}
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                                            <button
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                                                title="Delete Report"
                                            >
                                                <FaTrash className="text-[13px]" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Mobile Delete Button ── */}
                                    <div className="md:hidden flex justify-end mt-2">
                                        <button
                                            onClick={() => handleDeleteReport(report.id)}
                                            className="text-[12px] font-semibold text-red-500 hover:text-red-700 flex items-center gap-1.5"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>

                                    {/* ── Footer: date + expand button ── */}
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                                        <p className="text-[11px] text-gray-400">
                                            {new Date(report.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                        </p>
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : report.id)}
                                            className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                        >
                                            {isExpanded ? "Hide Details" : "View Full Report"}
                                            <FaChevronDown className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                                        </button>
                                    </div>

                                    {/* ── Expanded Panel ── */}
                                    {isExpanded && <ExpandedReport report={report} user={user} />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsTab;
