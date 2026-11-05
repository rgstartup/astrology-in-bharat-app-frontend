"use client";

import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { VoiceCancelDialog } from "@/features/consultation";

function noop() {
  return undefined;
}

const baseArgs = {
  open: true,
  onOpenChange: noop,
  onContinueOverChat: noop,
  onEndSession: noop,
} as const;

const meta: Meta<typeof VoiceCancelDialog> = {
  title: "Chat/Room/VoiceCancelDialog",
  component: VoiceCancelDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof VoiceCancelDialog>;

/** Default warning: no grace countdown (pause ack carried no deadline). */
export const NoGrace: Story = {
  render: () => <VoiceCancelDialog {...baseArgs} busy={false} graceSeconds={null} />,
};

/** Grace just granted: full server window, amber countdown. */
export const GraceFresh: Story = {
  render: () => <VoiceCancelDialog {...baseArgs} graceSeconds={30} />,
};

/** Grace nearly lapsed: red countdown, consultation ends automatically at zero. */
export const GraceCritical: Story = {
  render: () => <VoiceCancelDialog {...baseArgs} graceSeconds={5} />,
};

/** Switch-to-chat request in flight: buttons disabled, countdown frozen. */
export const SwitchingBusy: Story = {
  render: () => <VoiceCancelDialog {...baseArgs} busy graceSeconds={17} />,
};

/**
 * Live countdown harness: ticks down exactly like the real flow where the
 * remaining seconds are derived from the server-granted graceDeadline.
 *
 * @returns Live-ticking dialog element.
 */
function TickingHarness() {
  const [graceSeconds, setGraceSeconds] = useState(30);
  useEffect(() => {
    const id = setInterval(() => {
      setGraceSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <VoiceCancelDialog
      {...baseArgs}
      graceSeconds={graceSeconds}
    />
  );
}

/** Animated case: countdown ticks from 30 to 0, turning red past 10 seconds. */
export const GraceTicking: Story = {
  render: () => <TickingHarness />,
};
