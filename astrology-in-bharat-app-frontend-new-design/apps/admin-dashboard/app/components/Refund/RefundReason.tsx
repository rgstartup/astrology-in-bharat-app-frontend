// refund-management/components/RefundCard/RefundReason.tsx
import React from "react";
import { AlertCircle, Paperclip } from "lucide-react";

interface RefundReasonProps {
  reason: string;
  attachments?: string[];
}

export function RefundReason({ reason, attachments }: RefundReasonProps) {
  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-blue-600" />
        <h4 className="font-medium text-blue-700">Refund Reason</h4>
      </div>
      <p className="text-sm text-gray-700">{reason}</p>
      
      {attachments && attachments.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <Paperclip className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-600">
            {attachments.length} attachment(s)
          </span>
        </div>
      )}
    </div>
  );
}