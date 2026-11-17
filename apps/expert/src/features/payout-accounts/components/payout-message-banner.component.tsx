"use client";

import { AlertCircle, CheckCircle2, XCircle } from "@repo/design/lucide";

interface PayoutMessageBannerProps {
  message: { type: "success" | "error"; text: string } | null;
  onDismiss: () => void;
}

export function PayoutMessageBanner({
  message,
  onDismiss,
}: PayoutMessageBannerProps) {
  if (!message) return null;

  return (
    <div
      className={`px-4 py-3 rounded-lg flex items-center gap-3 mb-6 ${
        message.type === "success"
          ? "bg-green-50 text-green-700 border border-green-100"
          : "bg-red-50 text-red-700 border border-red-100"
      }`}
    >
      {message.type === "success" ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{message.text}</span>
      <button
        onClick={onDismiss}
        className="ml-auto text-gray-500 hover:text-gray-700"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
