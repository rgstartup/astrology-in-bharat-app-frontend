"use client";

import React from "react";
import Image from "next/image";

type Props = {
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  balance: number;
  total: number;
  handlePayment: () => void;
  isProcessing: boolean;
  isOrder: boolean;
  // Split Payment
  useSplitPayment: boolean;
  setUseSplitPayment: (val: boolean) => void;
  walletAmountToUse: number;
  setWalletAmountToUse: (val: number) => void;
};

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  balance,
  total,
  handlePayment,
  isProcessing,
  isOrder,
  useSplitPayment,
  setUseSplitPayment,
  walletAmountToUse,
  setWalletAmountToUse,
}: Props) => {
  const canPayFullWallet = balance >= total;
  const canSplitPay = balance > 0 && balance < total && isOrder;
  const razorpayDue = total - walletAmountToUse;
  const maxWalletUse = Math.min(balance, total - 1);

  return (
    <div className="flex-grow">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start gap-3">
           <i className="fa-regular fa-credit-card text-orange text-2xl mt-1"></i>
           <div>
             <h5 className="text-lg font-bold text-gray-900 leading-tight">Payment Method</h5>
             <p className="text-xs text-gray-500 mt-1">Choose a payment option to proceed securely</p>
           </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Wallet */}
            <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === "wallet" && !useSplitPayment ? "border-[#ff6b00] bg-orange/5" : "border-gray-200 bg-white hover:border-gray-300"
            } ${!canPayFullWallet ? "opacity-75" : ""}`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === "wallet" && !useSplitPayment}
                  onChange={() => { setPaymentMethod("wallet"); setUseSplitPayment(false); }} disabled={!canPayFullWallet} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "wallet" && !useSplitPayment ? "border-[#ff6b00] bg-white" : "border-gray-300"}`}>
                  {paymentMethod === "wallet" && !useSplitPayment && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"></div>}
                </div>
                <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center text-[#ff6b00] text-lg">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-0.5">Wallet Credits</span>
                  <span className="text-xs text-gray-500">Available Balance: ₹{balance?.toLocaleString() || '0'}</span>
                </div>
              </div>
              {!canPayFullWallet && (
                <div className="text-right">
                  <span className="block text-xs font-bold text-red-500 mb-0.5">Insufficient Funds</span>
                  <span className="text-xs text-gray-500">₹{total} needed</span>
                </div>
              )}
            </label>

            {/* UPI */}
            <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === "upi" && !useSplitPayment ? "border-[#ff6b00] bg-orange/5" : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === "upi" && !useSplitPayment}
                  onChange={() => { setPaymentMethod("upi"); setUseSplitPayment(false); }} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "upi" && !useSplitPayment ? "border-[#ff6b00] bg-white" : "border-gray-300"}`}>
                  {paymentMethod === "upi" && !useSplitPayment && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"></div>}
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 text-xl font-bold italic">
                   UPI
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-0.5">UPI / QR</span>
                  <span className="text-xs text-gray-500">Instant Payment via UPI</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black italic text-gray-800">UPI</span>
                <span className="text-lg font-black italic text-green-700">BHIM</span>
              </div>
            </label>

            {/* Card */}
            <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === "card" && !useSplitPayment ? "border-[#ff6b00] bg-orange/5" : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === "card" && !useSplitPayment}
                  onChange={() => { setPaymentMethod("card"); setUseSplitPayment(false); }} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "card" && !useSplitPayment ? "border-[#ff6b00] bg-white" : "border-gray-300"}`}>
                  {paymentMethod === "card" && !useSplitPayment && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"></div>}
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-0.5">Credit / Debit Card</span>
                  <span className="text-xs text-gray-500">All major cards accepted</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-brands fa-cc-visa text-3xl text-[#1a1f71]"></i>
                <i className="fa-brands fa-cc-mastercard text-3xl text-[#eb001b]"></i>
                <span className="text-[#0070ba] font-black italic text-lg">RuPay</span>
              </div>
            </label>

            {/* Net Banking */}
            <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === "netbanking" && !useSplitPayment ? "border-[#ff6b00] bg-orange/5" : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === "netbanking" && !useSplitPayment}
                  onChange={() => { setPaymentMethod("netbanking"); setUseSplitPayment(false); }} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "netbanking" && !useSplitPayment ? "border-[#ff6b00] bg-white" : "border-gray-300"}`}>
                  {paymentMethod === "netbanking" && !useSplitPayment && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"></div>}
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-lg">
                  <i className="fa-solid fa-building-columns"></i>
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-0.5">Net Banking</span>
                  <span className="text-xs text-gray-500">Secure Bank Portal</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-600 font-black text-sm">SBI</span>
                <span className="text-red-600 font-black text-sm">HDFC BANK</span>
                <span className="text-orange font-black text-sm">ICICI Bank</span>
                <span className="text-xs text-gray-400 ml-2">+ More</span>
              </div>
            </label>
          </div>

          {/* ── Split Payment Option ── */}
          {canSplitPay && (
            <div className={`mt-6 rounded-xl border transition-all overflow-hidden ${
              useSplitPayment ? "border-orange bg-orange/5" : "border-gray-200 bg-white"
            }`}>
              <div className="p-4 border-b border-orange/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#ff6b00]">Split Payment</span>
                  <span className="text-xs text-gray-500">(Use wallet balance + pay remaining)</span>
                </div>
                {/* Toggle Switch */}
                <button
                  type="button"
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${useSplitPayment ? 'bg-[#ff6b00]' : 'bg-gray-300'}`}
                  onClick={() => {
                    const next = !useSplitPayment;
                    setUseSplitPayment(next);
                    if (next) setWalletAmountToUse(Math.floor(maxWalletUse));
                  }}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${useSplitPayment ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {useSplitPayment && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Use wallet balance</span>
                      <span className="text-lg font-bold text-green-600">₹{walletAmountToUse.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-gray-500 mb-1">Pay remaining</span>
                      <span className="text-lg font-bold text-[#ff6b00]">₹{razorpayDue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <input
                    type="range"
                    min={1}
                    max={maxWalletUse}
                    value={walletAmountToUse}
                    onChange={(e) => setWalletAmountToUse(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#ff6b00] mb-6"
                  />
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                      <i className="fa-solid fa-wallet text-green-600 text-lg"></i>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-green-600 font-medium">From Wallet</span>
                        <span className="text-sm font-bold text-green-700">₹{walletAmountToUse.toLocaleString()}</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-plus text-gray-400"></i>
                    <div className="flex-1 flex items-center justify-center gap-2 bg-orange/10 border border-orange/20 rounded-lg p-3">
                      <div className="w-5 h-5 rounded-sm bg-blue-600 flex items-center justify-center text-white font-bold italic text-[10px]">
                        R
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-orange font-medium">Via Razorpay</span>
                        <span className="text-sm font-bold text-[#ff6b00]">₹{razorpayDue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pay Button */}
          <div className="mt-8">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-[#ff4500] hover:bg-[#ff5500] text-white rounded-xl font-bold text-base shadow-sm transition-colors flex items-center justify-between px-6 disabled:opacity-70"
            >
              <div className="flex items-center gap-2">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <i className="fa-solid fa-lock text-sm"></i>
                )}
                <span>
                  {useSplitPayment
                    ? `Pay ₹${walletAmountToUse} Wallet + ₹${razorpayDue} Razorpay`
                    : isOrder ? `Pay ₹${total} & Place Order` : `Pay ₹${total} & Start Session`}
                </span>
              </div>
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
