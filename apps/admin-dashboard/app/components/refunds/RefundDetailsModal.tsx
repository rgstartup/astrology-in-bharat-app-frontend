"use client";
import React from "react";
import { X, User, Mail, CreditCard, Calendar, Package, DollarSign, FileText } from "lucide-react";

interface RefundRequest {
  id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  amount: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "processing";
  reason: string;
  paymentMethod: string;
  transactionId: string;
}

interface RefundDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RefundDetailsModal({
  isOpen,
  onClose,
  refund,
  onApprove,
  onReject,
}: RefundDetailsModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      approved: "text-green-600 bg-green-100",
      rejected: "text-red-600 bg-red-100",
      processing: "text-blue-600 bg-blue-100",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Refund Request Details</h2>
            <p className="text-orange-100 text-sm mt-1">ID: {refund.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase ${getStatusColor(
                refund.status
              )}`}
            >
              {refund.status}
            </span>
          </div>

          {/* User Information */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User size={20} className="text-orange-500" />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">{refund.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{refund.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package size={20} className="text-orange-500" />
              Order Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{refund.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Name</p>
                <p className="font-semibold text-gray-800">{refund.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(refund.requestDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-bold text-orange-600 text-xl">
                  ₹{refund.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard size={20} className="text-orange-500" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold text-gray-800">{refund.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-semibold text-gray-800 font-mono text-sm">
                  {refund.transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* Refund Reason */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-orange-500" />
              Refund Reason
            </h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {refund.reason}
            </p>
          </div>

          {/* Action Buttons */}
          {refund.status === "pending" && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  onApprove(refund.id);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ✅ Approve Refund
              </button>
              <button
                onClick={() => {
                  onReject(refund.id);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ❌ Reject Refund
              </button>
            </div>
          )}

          {refund.status !== "pending" && (
            <div className="text-center py-2 text-gray-500 italic">
              This refund request has been {refund.status}.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl text-center text-sm text-gray-500">
          Review all details carefully before taking action
        </div>
      </div>
    </div>
  );
}