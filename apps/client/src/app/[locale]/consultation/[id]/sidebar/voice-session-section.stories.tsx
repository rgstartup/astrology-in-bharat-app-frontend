"use client";

import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { VoiceSessionSection } from "./voice-session-section.component";

function noop() {
  return undefined;
}

const meta: Meta<typeof VoiceSessionSection> = {
  title: "Chat/Sidebar/VoiceSessionSection",
  component: VoiceSessionSection,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof VoiceSessionSection>;

/**
 * Voice-active sidebar block: live voice mode with rate plus
 * switch-to-chat and upgrade-to-video targets.
 */
export const VoiceActive: Story = {
  render: () => (
    <div className="w-80 border-l border-[#d3cec6] bg-white p-5">
      <VoiceSessionSection
        voiceRate={30}
        chatRate={25}
        videoRate={50}
        onSwitchToChat={noop}
        onUpgradeToVideo={noop}
      />
    </div>
  ),
};

/** Higher voice rate variant to preview rate rendering. */
export const PremiumRate: Story = {
  render: () => (
    <div className="w-80 border-l border-[#d3cec6] bg-white p-5">
      <VoiceSessionSection
        voiceRate={99}
        chatRate={51}
        videoRate={149}
        onSwitchToChat={noop}
        onUpgradeToVideo={noop}
      />
    </div>
  ),
};

/** Video-active variant: switch targets are chat and voice. */
export const VideoActive: Story = {
  render: () => (
    <div className="w-80 border-l border-[#d3cec6] bg-white p-5">
      <VoiceSessionSection
        kind="video"
        voiceRate={30}
        chatRate={25}
        videoRate={50}
        onSwitchToChat={noop}
        onSwitchToVoice={noop}
      />
    </div>
  ),
};
