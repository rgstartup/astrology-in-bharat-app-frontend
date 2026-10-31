"use client";

import React from "react";
import { ShieldCheck } from "@repo/design/lucide";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/design/shadcn";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import { Button } from "@repo/design/shadcn";
import SessionThankYou, {
  type SessionThankYouExpert,
  StatusBadge,
  getHeadingText,
  getFooterButtonLabel,
  getInitials,
} from "./session-thank-you";
import BillingBreakdown, { type BillingSummary } from "./billing-breakdown";
import ReviewForm from "./review-form";
import SummaryActions from "./summary-actions";
import TerminationNotice from "./termination-notice";

export type SessionSummary = BillingSummary & {
  reason?: string;
  message?: string;
};

export type SessionSummaryModalProps = {
  showModal: boolean;
  onClose?: () => void;
  isDarkMode?: boolean;
  sessionSummary: SessionSummary | null;
  freeMinutes: number;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewComment: string;
  setReviewComment: (val: string) => void;
  reviewSubmitted: boolean;
  setReviewSubmitted: (val: boolean) => void;
  sessionId: string | null;
  expertData: SessionThankYouExpert;
  router: { push: (path: string) => void };
};

type ModalRightPanelProps = {
  status?: string;
  reason?: string;
  sessionSummary: SessionSummary | null;
  freeMinutes: number;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewComment: string;
  setReviewComment: (val: string) => void;
  reviewSubmitted: boolean;
  setReviewSubmitted: (val: boolean) => void;
  sessionId: string | null;
  expertData: SessionThankYouExpert;
  router: { push: (path: string) => void };
  handleClose: () => void;
};

/**
 * Right panel content rendered in strict waterfall style with early returns.
 */
function ModalRightPanel({
  status,
  reason,
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
  handleClose,
}: ModalRightPanelProps) {
  if (status === "terminated") {
    return (
      <div className="flex flex-col gap-4">
        <TerminationNotice reason={reason} message={sessionSummary?.message} />
        <SummaryActions status={status} router={router} onClose={handleClose} isDarkMode={false} />
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-[#ece8e1] bg-[#faf8f5] p-4 text-sm text-[#626260]">
          Your astrologer could not join this session. No amount was deducted from your wallet balance.
        </div>
        <SummaryActions status={status} router={router} onClose={handleClose} isDarkMode={false} />
      </div>
    );
  }

  return (
    <>
      {/* Itemized Session Summary / Billing */}
      <BillingBreakdown
        sessionSummary={sessionSummary}
        freeMinutes={freeMinutes}
        isDarkMode={false}
      />

      {/* Rating Stars + Comment Field + Submit Review */}
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
      />
    </>
  );
}

/**
 * Compact mobile header displaying thank you status and expert chip at the top.
 */
/**
 * Compact chip displaying expert info on mobile without overflowing.
 */
function MobileExpertChip({ expertData }: { expertData?: SessionThankYouExpert }) {
  if (!expertData) return null;
  const expertName = expertData.name || "Expert";
  const avatarSrc = expertData.avatar || expertData.avatar_url || undefined;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[#ece8e1] bg-[#faf8f5] px-2.5 py-1 max-w-[160px] shrink-0">
      <Avatar className="size-4 shrink-0">
        <AvatarImage src={avatarSrc} alt={expertName} />
        <AvatarFallback className="text-[9px] bg-[#ebe7e1]">
          {getInitials(expertName)}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-[#111111] truncate">
        {expertName}
      </span>
    </div>
  );
}

/**
 * Compact mobile header with dedicated right clearance for dialog cross button.
 */
function MobileSummaryHeader({
  status,
  expertData,
}: {
  status?: string;
  expertData?: SessionThankYouExpert;
}) {
  return (
    <div className="flex md:hidden flex-col gap-2 pb-3 border-b border-[#ece8e1] pr-10">
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={status} />
        <MobileExpertChip expertData={expertData} />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-[#111111]">
        {getHeadingText(status)}
      </h2>
    </div>
  );
}

/**
 * Mobile bottom action bar with exit button and security note.
 */
function MobileSummaryFooter({
  status,
  handleClose,
}: {
  status?: string;
  handleClose: () => void;
}) {
  return (
    <div className="flex md:hidden flex-col gap-2.5 pt-3 border-t border-[#ece8e1]">
      <Button
        variant="outline"
        className="h-11 w-full rounded-xl border-[#e3ded6] bg-white text-sm font-medium text-[#111111] hover:bg-[#ebe7e1] cursor-pointer"
        onClick={handleClose}
      >
        {getFooterButtonLabel(status)}
      </Button>
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9c9fa5]">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        <span>Transcript saved securely to consultation history</span>
      </div>
    </div>
  );
}

/**
 * Redesigned Consultation Session Summary Modal with optimized mobile & desktop layout.
 *
 * Responsive behavior:
 * - Desktop: 2-column split (Left: Thank You & details, Right: Billing receipt & review form).
 * - Mobile: Top-of-fold prioritized presentation: Compact status header $\rightarrow$ Immediate Session Summary $\rightarrow$ Review Form $\rightarrow$ Exit action.
 *
 * @param props - Modal properties and review callbacks.
 * @returns Dialog modal JSX.
 */
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

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    router.push("/");
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="w-[94vw] max-w-lg md:max-w-4xl lg:max-w-5xl rounded-2xl md:rounded-3xl border border-[#e3ded6] bg-white p-0 shadow-[0_24px_64px_rgba(17,17,17,0.12)] overflow-hidden">
        {/* Hidden accessible labels for screen readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>Consultation Session Summary</DialogTitle>
          <DialogDescription>
            Review consultation duration, billing breakdown, and share your rating and feedback.
          </DialogDescription>
        </DialogHeader>

        {/* Responsive layout: 2-column desktop grid, prioritized single-column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-0 md:min-h-[520px] md:divide-x divide-[#ece8e1]">
          {/* Left Column on Desktop (Hidden on Mobile to prioritize session summary) */}
          <div className="hidden md:flex md:col-span-5 bg-[#faf8f5] p-6 md:p-8 flex-col justify-between">
            <SessionThankYou
              status={status}
              reason={reason}
              message={sessionSummary?.message}
              sessionId={sessionId}
              expertData={expertData}
              onClose={handleClose}
              router={router}
            />
          </div>

          {/* Right Column on Desktop / Immediate View on Mobile */}
          <div className="col-span-1 md:col-span-7 bg-white p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-5 md:gap-6 flex-1 justify-between">
              {/* Mobile compact header */}
              <MobileSummaryHeader
                status={status}
                expertData={expertData}
              />

              {/* Session breakdown & review */}
              <ModalRightPanel
                status={status}
                reason={reason}
                sessionSummary={sessionSummary}
                freeMinutes={freeMinutes}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                reviewSubmitted={reviewSubmitted}
                setReviewSubmitted={setReviewSubmitted}
                sessionId={sessionId}
                expertData={expertData}
                router={router}
                handleClose={handleClose}
              />

              {/* Mobile bottom footer */}
              <MobileSummaryFooter
                status={status}
                handleClose={handleClose}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
