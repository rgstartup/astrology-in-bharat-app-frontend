import React from "react";

interface RefundActionButtonsProps {
  refundId: string;
  status: string;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function RefundActionButtons({
  refundId,
  status,
  onView,
  onApprove,
  onReject,
}: RefundActionButtonsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onView}
        className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition"
      >
        View
      </button>
      {status === "pending" && (
        <>
          <button
            onClick={onApprove}
            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );
}