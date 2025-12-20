"use client";

import { Button } from "@/app/components/admin/Button";
import { XCircle, CheckCircle, Eye, Calendar, IndianRupee } from "lucide-react";
import type { Dispute } from "@/app/components/dispute/dispute";

interface DisputeModalProps {
  dispute: Dispute;
  onClose: () => void;
}

const badges = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  under_review: "bg-blue-100 text-blue-700 border-blue-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export function DisputeModal({ dispute, onClose }: DisputeModalProps) {
  const handleAction = (action: string) => {
    console.log(action, dispute.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <article
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-5 border-b bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{dispute.disputeId}</h2>
              <p className="text-sm text-gray-300 mt-1">
                Raised by <span className="font-semibold">{dispute.raisedBy}</span> •{" "}
                {new Date(dispute.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex gap-3 flex-wrap">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${badges[dispute.status]}`}>
              {dispute.status.replace("_", " ").toUpperCase()}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${badges[dispute.priority]}`}>
              {dispute.priority.toUpperCase()}
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
              {dispute.category}
            </span>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <p className="text-xs text-blue-600 font-bold mb-1">USER</p>
              <p className="font-bold text-gray-900">{dispute.user}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
              <p className="text-xs text-purple-600 font-bold mb-1">EXPERT</p>
              <p className="font-bold text-gray-900">{dispute.expert}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Subject</h3>
              <p className="text-gray-900 font-semibold">{dispute.subject}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">
                {dispute.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Amount</h3>
              <p className="text-3xl font-extrabold text-green-600 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />
                {dispute.amount.toLocaleString()}
              </p>
            </div>

            {dispute.resolvedAt && (
              <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  Resolved on {new Date(dispute.resolvedAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-2">
            {dispute.status === "pending" && (
              <>
                <Button variant="secondary" size="sm" onClick={() => handleAction("review")} icon={Eye}>
                  Review
                </Button>
                <Button variant="success" size="sm" onClick={() => handleAction("resolve")} icon={CheckCircle}>
                  Resolve
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleAction("reject")} icon={XCircle}>
                  Reject
                </Button>
              </>
            )}
            {dispute.status === "under_review" && (
              <>
                <Button variant="success" size="sm" onClick={() => handleAction("resolve")} icon={CheckCircle}>
                  Resolve
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleAction("reject")} icon={XCircle}>
                  Reject
                </Button>
              </>
            )}
            {(dispute.status === "resolved" || dispute.status === "rejected") && (
              <p className="text-sm text-gray-600 italic">
                This dispute has been {dispute.status}
              </p>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}