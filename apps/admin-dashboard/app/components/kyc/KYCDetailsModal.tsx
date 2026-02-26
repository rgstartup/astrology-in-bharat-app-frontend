"use client";
import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface KYCDocument {
  type: string;
  url: string;
  uploadedAt: string;
}

interface ExpertKYC {
  id: string;
  expertId: string;
  expertName: string;
  email: string;
  phone: string;
  expertise: string;
  aadharNumber: string;
  panNumber: string;
  documents: KYCDocument[];
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  experience: number;
  address: string;
}

interface KYCDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kyc: ExpertKYC;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onMarkUnderReview: (id: string) => void;
}

export default function KYCDetailsModal({
  isOpen,
  onClose,
  kyc,
  onApprove,
  onReject,
  onMarkUnderReview,
}: KYCDetailsModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen) return null;

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(kyc.id, rejectionReason);
      onClose();
      setRejectionReason("");
      setShowRejectForm(false);
    } else {
      alert("Please provide a rejection reason");
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      approved: "text-green-600 bg-green-100",
      rejected: "text-red-600 bg-red-100",
      under_review: "text-blue-600 bg-blue-100",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold">KYC Verification Details</h2>
            <p className="text-orange-100 text-sm mt-1">Expert ID: {kyc.expertId}</p>
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
                kyc.status
              )}`}
            >
              {kyc.status.replace("_", " ")}
            </span>
          </div>

          {/* Expert Information */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User size={20} className="text-orange-500" />
              Expert Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <User size={16} /> Full Name
                </p>
                <p className="font-semibold text-gray-800">{kyc.expertName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Award size={16} /> Expertise
                </p>
                <p className="font-semibold text-gray-800">{kyc.expertise}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail size={16} /> Email
                </p>
                <p className="font-semibold text-gray-800">{kyc.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Phone size={16} /> Phone
                </p>
                <p className="font-semibold text-gray-800">{kyc.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold text-gray-800">{kyc.experience} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted On</p>
                <p className="font-semibold text-gray-800">
                  {new Date(kyc.submittedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <MapPin size={16} /> Address
              </p>
              <p className="font-semibold text-gray-800">{kyc.address}</p>
            </div>
          </div>

          {/* ID Proof Information */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-orange-500" />
              ID Proof Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-semibold text-gray-800 font-mono">
                  {kyc.aadharNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN Number</p>
                <p className="font-semibold text-gray-800 font-mono">
                  {kyc.panNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-orange-500" />
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {kyc.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{doc.type}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(doc.url, "_blank")}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
                  >
                    <Download size={16} />
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Review Information */}
          {(kyc.reviewedAt || kyc.rejectionReason) && (
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Review Information
              </h3>
              <div className="space-y-2">
                {kyc.reviewedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Reviewed On</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(kyc.reviewedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                )}
                {kyc.reviewedBy && (
                  <div>
                    <p className="text-sm text-gray-500">Reviewed By</p>
                    <p className="font-semibold text-gray-800">{kyc.reviewedBy}</p>
                  </div>
                )}
                {kyc.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-sm text-red-600 font-semibold mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-gray-700">{kyc.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">
                Reject KYC Verification
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
              />
            </div>
          )}

          {/* Action Buttons */}
          {kyc.status !== "approved" && kyc.status !== "rejected" && (
            <div className="flex gap-3 pt-4">
              {!showRejectForm && (
                <>
                  <button
                    onClick={() => {
                      onApprove(kyc.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition shadow-md hover:shadow-lg"
                  >
                    <CheckCircle size={20} />
                    Approve KYC
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition shadow-md hover:shadow-lg"
                  >
                    <XCircle size={20} />
                    Reject KYC
                  </button>
                  {kyc.status === "pending" && (
                    <button
                      onClick={() => {
                        onMarkUnderReview(kyc.id);
                        onClose();
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-md hover:shadow-lg"
                    >
                      Mark Under Review
                    </button>
                  )}
                </>
              )}

              {showRejectForm && (
                <>
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition shadow-md hover:shadow-lg"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}

          {(kyc.status === "approved" || kyc.status === "rejected") && (
            <div className="text-center py-3 text-gray-500 italic">
              This KYC has been {kyc.status}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



