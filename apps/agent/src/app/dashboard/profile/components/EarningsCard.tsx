import React from "react";
import { CreditCard, Info } from "lucide-react";

export const EarningsCard = () => {
    const COMMISSION_RATES = [
        {
            label: "Expert Referral",
            rate: "3%",
            desc: "Lifetime on expert earnings",
            color: "text-primary",
            bg: "bg-primary/5",
            border: "border-primary/10"
        },
        {
            label: "User Wallet Usage",
            rate: "3%",
            desc: "Per wallet transaction",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            label: "Puja Shop Referral",
            rate: "3%",
            desc: "On every product sold",
            color: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-100"
        },
    ];

    return (
        <div className="group bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden h-full flex flex-col transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div className="p-10 border-b border-gray-50 bg-gray-50/30 group-hover:bg-gray-50/50 transition-colors duration-700">
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-[0.2em]">Commission</h3>
                <p className="text-[10px] font-bold text-gray-1000 uppercase tracking-widest mt-0.5 group-hover:text-[#F25E0A] transition-colors">Earnings Structure</p>
            </div>

            <div className="p-10 space-y-6">
                {COMMISSION_RATES.map(({ label, rate, desc, color, bg, border }) => (
                    <div key={label} className={`group flex items-center justify-between p-7 rounded-[2rem] border-2 ${bg} ${border} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-200/50`}>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                <CreditCard className={`w-6 h-6 ${color}`} />
                            </div>
                            <div>
                                <span className="block text-[13px] font-black uppercase tracking-tight text-gray-800">{label}</span>
                                <span className="text-[10px] font-bold text-gray-1000 uppercase tracking-widest">{desc}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-4xl font-black ${color}`}>{rate}</span>
                        </div>
                    </div>
                ))}

                <div className="mt-10 p-8 bg-gray-50 rounded-3xl border-2 border-gray-100 flex items-start gap-5">
                    <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                        <Info className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] text-gray-1000 font-bold leading-relaxed uppercase tracking-widest">
                        Commissions are credited to your agent wallet instantly upon session or order completion.
                    </p>
                </div>
            </div>
        </div>
    );
};
