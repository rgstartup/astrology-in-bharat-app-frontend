import React, { useState } from "react";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

interface ExpertKYC {
  id: string;
  status: "pending" | "approved" | "rejected" | "under_review";
}

interface KYCActionButtonsProps {
  kyc: ExpertKYC;
  onView: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onMarkUnderReview: () => void;
}

export default function KYCActionButtons({
  kyc,
  onView,
  onApprove,
  onReject,
  onMarkUnderReview,
}: KYCActionButtonsProps) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setShowRejectInput(false);
      setRejectionReason("");
    } else {
      alert("Please provide a rejection reason");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onView}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          title="View Details"
        >
          <Eye size={16} />
        </button>

        {kyc.status !== "approved" && (
          <button
            onClick={onApprove}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            title="Approve KYC"
          >
            <CheckCircle size={16} />
          </button>
        )}

        {kyc.status !== "rejected" && (
          <button
            onClick={() => setShowRejectInput(!showRejectInput)}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            title="Reject KYC"
          >
            <XCircle size={16} />
          </button>
        )}

        {kyc.status === "pending" && (
          <button
            onClick={onMarkUnderReview}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            title="Mark Under Review"
          >
            <Clock size={16} />
          </button>
        )}
      </div>

      {showRejectInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Rejection reason..."
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleReject}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}