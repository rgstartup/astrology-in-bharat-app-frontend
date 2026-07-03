import React from "react";
import { Button, Loading } from "@repo/ui";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import Skeleton from "@/components/ui/Skeleton";

interface WalletTabProps {
    walletBalance: number;
    walletView: 'recharge' | 'history';
    setWalletView: (view: 'recharge' | 'history') => void;
    rechargeAmount: number;
    setRechargeAmount: (amount: number) => void;
    handleRecharge: () => void;
    isProcessing: boolean;
    rechargeOptions: number[];
    transactions: any[];
    loadingTransactions: boolean;
    walletPurpose: string | undefined;
    setWalletPurpose: (purpose: string | undefined) => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;
}

const WalletTab: React.FC<WalletTabProps> = ({
    walletBalance,
    walletView,
    setWalletView,
    rechargeAmount,
    setRechargeAmount,
    handleRecharge,
    isProcessing,
    rechargeOptions,
    transactions,
    loadingTransactions,
    walletPurpose,
    setWalletPurpose,
    hasMore,
    loadingMore,
    onLoadMore
}) => {
    const { lang } = useLanguageStore();
    const t = (profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en).wallet;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden relative">
      {/* Wallet Card Header with Gradient */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 relative overflow-hidden">
        {/* Abstract shapes using Tailwind utilities */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                <i className="fa-solid fa-wallet text-orange text-xl"></i>
              </div>
              <div>
                <h5
                  className="font-bold text-white text-xl md:text-2xl tracking-tight m-0"
                  style={fontStyle}
                >
                  {t.title}
                </h5>
                <p className="text-gray-400 text-sm m-0" style={fontStyle}>
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 bg-white/5 p-1.5 rounded-2xl backdrop-blur-sm border border-white/10 w-full sm:w-auto mt-4 lg:mt-0">
            <button
              onClick={() => setWalletView("recharge")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                walletView === "recharge"
                  ? "bg-orange text-white shadow-lg shadow-orange/30"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              style={fontStyle}
            >
              <i className="fa-solid fa-plus-circle text-[10px] sm:text-sm"></i>
              {t.addMoney}
            </button>
            <button
              onClick={() => setWalletView("history")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                walletView === "history"
                  ? "bg-white text-gray-900 shadow-lg shadow-white/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              style={fontStyle}
            >
              <i className="fa-solid fa-list-ul text-[10px] sm:text-sm"></i>
              {t.history}
            </button>
          </div>
        </div>

        {/* Balance Card floating */}
        <div className="mt-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 relative overflow-hidden group hover:bg-white/15 transition-all duration-500 shadow-2xl">
          <div className="relative z-10 text-center">
            <p
              className="text-white/60 text-[10px] font-bold uppercase mb-3 tracking-[0.2em]"
              style={fontStyle}
            >
              <i className="fa-solid fa-circle-info mr-2 opacity-50"></i>
              {t.availableBalance}
            </p>
            <div className="flex items-center justify-center mb-2">
              <span className="text-orange text-xl md:text-3xl font-bold mr-1 md:mr-2 mt-1">₹</span>
              <h1 className="font-black text-white text-3xl sm:text-4xl md:text-6xl tracking-tight">
                {walletBalance?.toLocaleString() || "0"}
              </h1>
            </div>
            <p className="text-white/40 text-xs font-medium" style={fontStyle}>
              {transactions && transactions.length > 0 
                ? `Last updated: ${new Date(transactions[0].created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` 
                : t.lastUpdated}
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange/20 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 md:p-10">
        {walletView === "recharge" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section Header */}
            <div className="mb-10">
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange/10 rounded-xl mr-4 shadow-sm">
                  <i className="fa-solid fa-money-bill-transfer text-orange"></i>
                </div>
                <h6
                  className="font-bold text-gray-900 text-xl m-0"
                  style={fontStyle}
                >
                  {t.addMoneyTitle}
                </h6>
              </div>
              <p
                className="text-gray-500 text-sm ml-14 leading-relaxed max-w-2xl"
                style={fontStyle}
              >
                {t.addMoneySubtitle}
              </p>
            </div>

            {/* Amount Selection Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10">
              {/* Custom Amount Input Container */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <label
                    className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center"
                    style={fontStyle}
                  >
                    <i className="fa-solid fa-pencil mr-2 text-orange/60"></i>
                    {t.customAmount}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange">
                      <span className="text-gray-400 font-bold text-xl">₹</span>
                    </div>
                    <input
                      type="number"
                      value={rechargeAmount}
                      onChange={(e) =>
                        setRechargeAmount(parseInt(e.target.value) || 0)
                      }
                      className="w-full pl-10 pr-4 py-4 md:py-5 bg-white border border-gray-200 rounded-xl font-black text-xl md:text-2xl text-gray-900 focus:ring-4 focus:ring-orange/10 focus:border-orange outline-none transition-all shadow-sm group-hover:border-gray-300"
                      placeholder="0"
                      min="100"
                      max="50000"
                    />
                  </div>
                  <p
                    className="text-gray-400 text-[11px] mt-4 font-medium italic"
                    style={fontStyle}
                  >
                    {t.customAmountHint}
                  </p>
                </div>
              </div>

              {/* Quick Recharge Options Container */}
              <div className="lg:col-span-2">
                <label
                  className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center ml-1"
                  style={fontStyle}
                >
                  <i className="fa-solid fa-bolt mr-2 text-amber-500"></i>
                  {t.quickRecharge}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {rechargeOptions.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`relative p-3 md:p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[80px] md:min-h-[110px] group ${
                        rechargeAmount === amt
                          ? "border-orange bg-orange/5 shadow-premium ring-2 ring-orange/10"
                          : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md"
                      }`}
                    >
                      {rechargeAmount === amt && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-orange text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300">
                          <i className="fa-solid fa-check text-[8px]"></i>
                        </div>
                      )}
                      <div className="flex items-center transition-transform group-hover:scale-110 duration-300">
                        <span className="text-xs md:text-sm font-bold mr-1 text-gray-400 mt-0.5">₹</span>
                        <span
                          className={`text-lg md:text-2xl font-black ${
                            rechargeAmount === amt ? "text-orange" : "text-gray-800"
                          }`}
                        >
                          {amt}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Button
                variant="primary"
                fullWidth
                loading={isProcessing}
                onClick={handleRecharge}
                className="min-h-[4rem] py-3 md:py-0 md:h-20 !rounded-2xl md:!rounded-3xl bg-orange hover:bg-orange/90 border-0 shadow-lg shadow-orange/20 overflow-hidden group"
                disabled={rechargeAmount < 100}
              >
                <div className="flex items-center justify-between w-full px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 rounded-xl md:rounded-2xl mr-3 md:mr-5 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                      <i className="fa-solid fa-bolt text-white text-lg md:text-xl"></i>
                    </div>
                    <div className="text-left">
                      <div
                        className="text-white text-base md:text-xl font-black tracking-tight"
                        style={fontStyle}
                      >
                        {t.rechargeBtn} ₹{rechargeAmount.toLocaleString()}
                      </div>
                      <div
                        className="text-white/70 text-[9px] md:text-[11px] font-bold uppercase tracking-wider mt-0.5"
                        style={fontStyle}
                      >
                        {t.rechargeHint}
                      </div>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-lg md:text-xl text-white/40 group-hover:translate-x-2 transition-transform duration-300 ml-2"></i>
                </div>
              </Button>
            </div>

            {/* Validation Message */}
            {rechargeAmount > 0 && rechargeAmount < 100 && (
              <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start animate-in slide-in-from-top-2 duration-300">
                <div className="w-10 h-10 bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa-solid fa-triangle-exclamation text-amber-600 text-lg"></i>
                </div>
                <div>
                  <p className="font-bold text-amber-900 m-0" style={fontStyle}>
                    {t.minAmountWarning}
                  </p>
                  <p className="text-amber-700 text-sm mt-1 m-0" style={fontStyle}>
                    {t.minAmountHint}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <h6
                className="font-bold text-gray-900 text-xl m-0 flex items-center"
                style={fontStyle}
              >
                <div className="w-10 h-10 bg-orange/10 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                  <i className="fa-solid fa-clock-rotate-left text-orange"></i>
                </div>
                {t.transactionHistory}
              </h6>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full sm:w-auto">
                <button
                  onClick={() => setWalletPurpose(undefined)}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                    !walletPurpose
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                  style={fontStyle}
                >
                  {t.all}
                </button>
                <button
                  onClick={() => setWalletPurpose("recharge")}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                    walletPurpose === "recharge"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                  style={fontStyle}
                >
                  {t.recharges}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-premium">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th
                        className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-gray-400"
                        style={fontStyle}
                      >
                        {t.tableDate}
                      </th>
                      <th
                        className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-gray-400"
                        style={fontStyle}
                      >
                        {t.tableDescription}
                      </th>
                      <th
                        className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-center"
                        style={fontStyle}
                      >
                        {t.tableType}
                      </th>
                      <th
                        className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right"
                        style={fontStyle}
                      >
                        {t.tableAmount}
                      </th>
                      <th
                        className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right"
                        style={fontStyle}
                      >
                        {t.tableStatus}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loadingTransactions ? (
                      [1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-8 py-6"><Skeleton width={80} height={16} /></td>
                          <td className="px-8 py-6"><Skeleton width={150} height={16} /></td>
                          <td className="px-8 py-6 text-center"><Skeleton width={60} height={20} className="mx-auto rounded-full" /></td>
                          <td className="px-8 py-6 text-right"><Skeleton width={60} height={16} className="ml-auto" /></td>
                          <td className="px-8 py-6 text-right"><Skeleton width={70} height={20} className="ml-auto rounded-lg" /></td>
                        </tr>
                      ))
                    ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center justify-center opacity-40">
                            <i className="fa-solid fa-receipt text-5xl text-gray-300 mb-4"></i>
                            <p className="text-gray-400 font-bold" style={fontStyle}>
                              {t.noTransactions}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx: any, idx: number) => {
                        const amount =
                          typeof tx.amount === "object" && tx.amount !== null
                            ? tx.amount.amount || tx.amount.value || tx.amount.total || 0
                            : tx.amount || 0;

                        const isNegative = ["debit", "hold"].includes(tx.type?.toLowerCase());
                        const isHold = tx.type?.toLowerCase() === "hold";
                        const isRelease = tx.type?.toLowerCase() === "release";

                        return (
                          <tr
                            key={tx.id || idx}
                            className="group hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-8 py-6 text-sm font-bold text-gray-400">
                              {(() => {
                                const dateVal = tx.createdAt || tx.created_at;
                                if (!dateVal) return "N/A";
                                const d = new Date(dateVal);
                                return isNaN(d.getTime())
                                  ? "N/A"
                                  : d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    });
                              })()}
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-bold text-gray-800 m-0">
                                {tx.description || tx.reason || tx.purpose || t.defaultTransaction}
                              </p>
                              <p className="text-[10px] font-medium text-gray-400 mt-0.5 m-0 uppercase tracking-wider">
                                {t.ref}: {tx.transaction_no || (tx.id ? `#${String(tx.id).slice(-8).toUpperCase()}` : "INTERNAL")}
                              </p>

                            </td>
                            <td className="px-8 py-6 text-center">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                  isHold
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : isNegative
                                      ? "bg-orange/5 text-orange border-orange/10"
                                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                }`}
                              >
                                {tx.type || "credit"}
                              </span>
                            </td>
                            <td
                              className={`px-8 py-6 text-right font-black text-base ${
                                isHold
                                  ? "text-amber-500"
                                  : isNegative
                                    ? "text-orange"
                                    : "text-emerald-500"
                              }`}
                            >
                              {isNegative ? "-" : "+"}₹{amount.toLocaleString()}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                                  ["failed", "cancelled", "error"].includes(
                                    tx.status?.toLowerCase()
                                  )
                                    ? "bg-red-50 text-red-600"
                                    : "bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    ["failed", "cancelled", "error"].includes(
                                      tx.status?.toLowerCase()
                                    )
                                      ? "bg-red-500"
                                      : "bg-emerald-500"
                                  }`}
                                ></span>
                                {tx.status || t.defaultStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Load More Button */}
              {hasMore ? (
                <div className="flex justify-center py-8 border-t border-gray-50 bg-gray-50/30">
                  <button
                    onClick={onLoadMore}
                    disabled={loadingMore}
                    className="px-10 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:border-orange/30 hover:text-orange hover:bg-orange-50/50 transition-all duration-300 flex items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
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
                        <span>{lang === "hi" ? "और लेनदेन लोड करें" : "Load More Transactions"}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : transactions.length > 0 && (
                <div className="flex flex-col items-center justify-center py-8 border-t border-dashed border-gray-100 bg-gray-50/20">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                  <p className="text-gray-400 text-xs font-medium" style={fontStyle}>
                    {lang === "hi" ? "आपने सभी लेनदेन देख लिए हैं" : "You've viewed all transactions"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {(isProcessing || loadingMore) && <Loading fullScreen />}
    </div>
  );
};

export default WalletTab;


