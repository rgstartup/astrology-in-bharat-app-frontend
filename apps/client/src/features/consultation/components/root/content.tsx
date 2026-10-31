"use client";

import React from "react";
import type { ChatMessage } from "@/lib/types";
import {
  RoomChatProvider,
  RechargeDialogProvider,
  SwitchToVoiceProvider,
  DirectVoiceProvider,
} from "../../providers";
import { RoomContentRoot } from "../room/room-content.root";

export type RoomContentProps = {
  initialMessages: ChatMessage[];
};

/**
 * Room root for chat, voice, and video consultations: composes the realtime
 * chat, recharge dialog, switch to voice, and direct voice providers, then
 * renders the declarative room layout. The `RoomLifecycleProvider` (seed
 * source) is supplied by the route layout above.
 *
 * @param props - Initial seed messages
 */
export default function RoomContent({
  initialMessages = [],
}: RoomContentProps) {
  return (
    <RoomChatProvider initialMessages={initialMessages}>
      <RechargeDialogProvider>
        <SwitchToVoiceProvider>
          <DirectVoiceProvider>
            <RoomContentRoot />
          </DirectVoiceProvider>
        </SwitchToVoiceProvider>
      </RechargeDialogProvider>
    </RoomChatProvider>
  );
}
