"use client";

import React, { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { VoiceCancelDialog } from "@/features/consultation/components/session";

type CancelHarnessProps = {
  busy?: boolean;
};

/**
 * Harness for the leave-voice warning: the trigger mirrors the dock button
 * that opens the popup.
 *
 * @param props - Busy flag of the switch request.
 * @returns Trigger button and the warning popup.
 */
function CancelHarness({ busy = false }: CancelHarnessProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] p-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-[#111111] px-4 py-2 text-sm font-medium text-white hover:bg-black"
      >
        Leave the voice call
      </button>
      <VoiceCancelDialog
        open={open}
        onOpenChange={setOpen}
        onContinueOverChat={() => setOpen(false)}
        onEndSession={() => setOpen(false)}
        busy={busy}
      />
    </div>
  );
}

const meta: Meta<typeof CancelHarness> = {
  title: "Chat/Room/VoiceCancelWarning",
  component: CancelHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof CancelHarness>;

/** Warning popup: continue the consultation over chat or end it entirely. */
export const Warning: Story = {
  render: () => <CancelHarness />,
};

/** Busy state while the backend opens the new chat session. */
export const Switching: Story = {
  render: () => <CancelHarness busy />,
};
