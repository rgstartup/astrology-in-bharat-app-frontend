"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TerminationNotice from "./termination-notice.component";
import BillingBreakdown from "./billing-breakdown.component";
import ReviewForm from "./review-form.component";
import SummaryActions from "./summary-actions.component";

type SessionSummaryModalProps = {
  showModal: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  sessionSummary: any;
  freeMinutes: number;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewComment: string;
  setReviewComment: (val: string) => void;
  reviewSubmitted: boolean;
  setReviewSubmitted: (val: boolean) => void;
  sessionId: string | null;
  expertData: any;
  router: any;
};

function getSummaryTitle(status?: string, reason?: string): string {
  if (status === "expired") return "Session Expired";
  if (status === "terminated") return "Admin Terminated Session";
  if (reason === "free_limit_ended_no_balance") return "Free Session Ended";
  if (reason === "insufficient_balance") return "Low Balance";
  return "Session Summary";
}

function getSummarySubtitle(status?: string, reason?: string): string {
  if (status === "expired") return "Expert missed the request";
  if (status === "terminated") return "Ended by administrator";
  if (reason === "free_limit_ended_no_balance") return "Your free consultation has ended";
  if (reason === "insufficient_balance") return "Session ended due to low wallet balance";
  return "Consultation finished";
}

function TerminatedBody({ reason, message }: { reason?: string; message?: string }) {
  return <TerminationNotice reason={reason} message={message} />;
}

function CompletedBody({
  sessionSummary,
  freeMinutes,
}: {
  sessionSummary: any;
  freeMinutes: number;
}) {
  return <BillingBreakdown sessionSummary={sessionSummary} freeMinutes={freeMinutes} isDarkMode={false} />;
}

export default function SessionSummaryModal({
  showModal,
  onClose,
  sessionSummary,
  freeMinutes,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  reviewSubmitted,
  setReviewSubmitted,
  sessionId,
  expertData,
  router,
}: SessionSummaryModalProps) {
  const status = sessionSummary?.status;
  const reason = sessionSummary?.reason;

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md rounded-3xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{getSummaryTitle(status, reason)}</DialogTitle>
          <DialogDescription>{getSummarySubtitle(status, reason)}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-2">
          {status === "terminated" ? (
            <TerminatedBody reason={reason} message={sessionSummary?.message} />
          ) : (
            <CompletedBody sessionSummary={sessionSummary} freeMinutes={freeMinutes} />
          )}

          <ReviewForm
            status={status}
            isDarkMode={false}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
            reviewSubmitted={reviewSubmitted}
            setReviewSubmitted={setReviewSubmitted}
            sessionId={sessionId}
            expertData={expertData}
            router={router}
            onSkip={onClose}
          />

          <SummaryActions status={status} isDarkMode={false} router={router} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
