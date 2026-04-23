"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { FaCheckCircle, FaEnvelopeOpenText } from "react-icons/fa";

function VerifyEmailContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-16 text-center space-y-8">
          <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Email Verified!</h2>
            <p className="text-slate-500 font-bold">Your email has been verified successfully. You can now sign in to your account.</p>
          </div>
          <Link
            href="/sign-in"
            className="block w-full py-4 bg-orange text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In Now
          </Link>
        </div>
        <div className="text-center mt-10 opacity-30 hover:opacity-100 transition-all">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <FaEnvelopeOpenText className="text-orange text-xs" />
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Astrology Bharat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
