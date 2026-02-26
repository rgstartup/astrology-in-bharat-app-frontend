"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@repo/ui";
import { XCircle, CheckCircle, Eye, Calendar, IndianRupee, MessageSquare } from "lucide-react";
import type { Dispute } from "@/app/components/dispute/dispute";
import { updateDisputeStatus } from "@/src/services/admin.service";
import { DisputeChatModal } from "./DisputeChatModal";

const XCircleComp = XCircle as any;
const CheckCircleComp = CheckCircle as any;
const EyeComp = Eye as any;
const CalendarComp = Calendar as any;
const IndianRupeeComp = IndianRupee as any;
const MessageSquareComp = MessageSquare as any;

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
  close_requested: "bg-purple-100 text-purple-700 border-purple-200",
};

export function DisputeModal({ dispute, onClose }: DisputeModalProps) {
  const [showChatModal, setShowChatModal] = useState(false);

  const handleAction = async (action: string) => {
    let status = "";
    if (action === "review") status = "under_review";
    if (action === "resolve") status = "resolved";
    if (action === "reject") status = "rejected";

    if (!status) return;

    try {
      await updateDisputeStatus(dispute.id, { status });
      toast.success(`Dispute ${status.replace("_", " ")} successfully`);
      onClose();
    } catch (error) {
      console.error("Error updating dispute status:", error);
      toast.error("Failed to update dispute status");
    }
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
              <h2 className="text-2xl font-bold">{dispute.disputeId || dispute.id || 'N/A'}</h2>
              <p className="text-sm text-gray-300 mt-1">
                Raised by <span className="font-semibold">{dispute.raisedBy || 'User'}</span> •{" "}
                {dispute.createdAt ? new Date(dispute.createdAt).toLocaleDateString("en-IN") : 'N/A'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <XCircleComp className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex gap-3 flex-wrap">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(badges as any)[dispute.status || 'pending']}`}>
              {(dispute.status || 'pending').replace("_", " ").toUpperCase()}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${(badges as any)[dispute.priority || 'medium']}`}>
              {(dispute.priority || 'medium').toUpperCase()}
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
              {dispute.category || 'General'}
            </span>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <p className="text-xs text-blue-600 font-bold mb-1">USER</p>
              <p className="font-bold text-gray-900">
                {typeof dispute.user === 'string' ? dispute.user : (dispute.user as any)?.name || (dispute.user as any)?.email || 'Unknown'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
              <p className="text-xs text-purple-600 font-bold mb-1">EXPERT</p>
              <p className="font-bold text-gray-900">
                {typeof dispute.expert === 'string' ? dispute.expert : (dispute.expert as any)?.name || (dispute.expert as any)?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Subject</h3>
              <p className="text-gray-900 font-semibold">{dispute.subject || dispute.category || 'No subject'}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">
                {dispute.description || 'No description provided'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Amount</h3>
              <p className="text-3xl font-extrabold text-green-600 flex items-center gap-1">
                <IndianRupeeComp className="w-6 h-6" />
                {dispute.amount ? dispute.amount.toLocaleString() : 'N/A'}
              </p>
            </div>

            {dispute.resolvedAt && (
              <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-lg">
                <CheckCircleComp className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  Resolved on {new Date(dispute.resolvedAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            {/* Chat Button */}
            <Button
              variant="secondary"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
              onClick={() => setShowChatModal(true)}
              icon={MessageSquareComp}
            >
              Start Chat
            </Button>

            <div className="flex gap-2">
              {dispute.status === "pending" && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => handleAction("review")} icon={EyeComp}>
                    Review
                  </Button>
                  <Button variant="success" size="sm" onClick={() => handleAction("resolve")} icon={CheckCircleComp}>
                    Resolve
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleAction("reject")} icon={XCircleComp}>
                    Reject
                  </Button>
                </>
              )}
              {dispute.status === "under_review" && (
                <>
                  <Button variant="success" size="sm" onClick={() => handleAction("resolve")} icon={CheckCircleComp}>
                    Resolve
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleAction("reject")} icon={XCircleComp}>
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
          </div>
        </footer>
      </article>

      {/* Chat Modal */}
      {showChatModal && (
        <DisputeChatModal
          dispute={dispute}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}



