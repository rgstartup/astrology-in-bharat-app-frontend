// refund-management/components/RefundCard/RefundCard.tsx
"use client";

import React from "react";
import { Calendar, Clock, MoreVertical, MessageSquare } from "lucide-react";
import { Button } from "@repo/ui";

const CalendarComp = Calendar as any;
const ClockComp = Clock as any;
const MoreVerticalComp = MoreVertical as any;
const MessageSquareComp = MessageSquare as any;
import { RefundStatusBadge } from "./RefundStatusBadge";
import { RefundAmount } from "./RefundAmount";
import { UserInfoCard } from "./UserInfoCard";
import { RefundReason } from "./RefundReason";
import type { RefundRequest } from "./types";

interface RefundCardProps {
  refund: RefundRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (refund: RefundRequest) => void;
}

export function RefundCard({
  refund,
  onApprove,
  onReject,
  onViewDetails,
}: RefundCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="font-semibold text-gray-900">Refund #{refund.id}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <CalendarComp className="w-3 h-3" />
                {refund.requestedAt.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <ClockComp className="w-3 h-3" />
                {refund.requestedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RefundStatusBadge status={refund.status} />
            <button className="p-1 hover:bg-gray-100 rounded-lg">
              <MoreVerticalComp className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4">

        {/* Users Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <UserInfoCard user={refund.user} astrologer={refund.astrologer} type="user" />
          <UserInfoCard user={refund.user} astrologer={refund.astrologer} type="astrologer" />
        </div>

        {/* Consultation Info */}
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Consultation Details</h4>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
              {refund.consultation.type.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <span className="text-xs text-gray-600">Duration</span>
              <p className="font-medium">{refund.consultation.duration} mins</p>
            </div>
            <div>
              <span className="text-xs text-gray-600">Date</span>
              <p className="font-medium">{refund.consultation.date.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Refund Amount */}
        <div className="mb-4">
          <RefundAmount
            original={refund.amount}
            requested={refund.requestedAmount}
            status={refund.status}
          />
        </div>

        {/* Refund Reason */}
        <RefundReason
          reason={refund.reason}
          attachments={refund.attachments}
        />

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">

          {refund.status === "pending" && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove(refund.id)}
                className="flex-1"
              >
                Approve
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => onReject(refund.id)}
                className="flex-1"
              >
                Reject
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={MessageSquareComp}
            onClick={() => onViewDetails(refund)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}



