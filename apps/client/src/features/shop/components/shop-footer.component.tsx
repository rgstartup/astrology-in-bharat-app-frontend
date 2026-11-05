"use client";

import React from "react";
import { Link } from "@/i18n";
import { ShieldCheck, Truck, RotateCcw } from "@repo/design/lucide";

export const ShopFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#e8e4de] mt-auto">
      {/* Value props in Cream Floating Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-[#e8e4de]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-neutral-900" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                100% Certified & Energized
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Every gemstone and spiritual item is charged through authentic Vedic rituals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-neutral-900" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                Safe Pan-India Delivery
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Securely packed in tamper-proof boxes with live tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-neutral-900" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                Easy Support & Queries
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Our support team and astrologers are available for item queries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p className="m-0">
          © {new Date().getFullYear()} Astrology in Bharat. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/privacy-policy" className="hover:text-neutral-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-neutral-900 transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/refund-policy" className="hover:text-neutral-900 transition-colors">
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
