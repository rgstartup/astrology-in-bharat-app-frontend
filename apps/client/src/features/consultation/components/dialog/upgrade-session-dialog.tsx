import { ConsultationMode } from "@/features/consultation-prep";
import { Button } from "@repo/design/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design/shadcn/dialog";
import React from "react";

interface IUpgradeSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmUpgrade: () => void;
  onReject: () => void;
  rates: {
    voiceRate: number;
    videoRate: number;
    chatRate: number;
  };
  targetRate: number;
  modalTitle: string;
  modalDescription: string;
}

const UpgradeSessionDialog = (props: IUpgradeSessionDialogProps) => {
  return (
    <Dialog open={props.open} onOpenChange={(open) => props.onOpenChange(open)}>
      <DialogContent className="rounded-xl border border-[#d3cec6] bg-white">
        <DialogHeader>
          <DialogTitle className="font-sans text-[#111111]">
            {props.modalTitle}
          </DialogTitle>
          <DialogDescription className="font-sans text-[#626260]">
            {props.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-[#f0ebe3] bg-[#fdfbf9] p-4 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#7b7b78]">Current chat rate:</span>
            <span className="font-semibold text-[#111111]">
              ₹{props.rates.chatRate} / min
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-[#f0ebe3] py-1.5 font-bold">
            <span className="text-[#111111]">New upgraded rate:</span>
            <span className="text-sm font-bold text-emerald-700">
              ₹{props.targetRate} / min
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#7b7b78]">
            Your session time will continue seamlessly without interruption. The
            new per-minute rate takes effect upon connection.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            className="rounded-lg text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
            onClick={props.onReject}
          >
            Keep in chat
          </Button>
          <Button
            className="rounded-lg bg-[#111111] font-medium text-white hover:bg-[#111111]/90"
            onClick={props.onConfirmUpgrade}
          >
            Confirm upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeSessionDialog;
