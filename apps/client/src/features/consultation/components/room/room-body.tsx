"use client";

import React from "react";
import MessageArea from "../message-area/message-area";
import ChatFooter from "../chat/chat-footer";
import { cn } from "@repo/design/cn";
import RoomSecureStrip from "./room-secure-strip";
import { useRoomRevision } from "@/realtime/hooks/use-room-revision";
import { SessionDock } from "../session/session-dock";
import { useRoomSession } from "../../providers/room-lifecycle";
import { useDirectVoiceContext } from "../../providers/direct-voice.provider";
import { useSwitchToVoiceContext } from "../../providers/switch-to-voice.provider";

function RoomSessionDock() {
  const revision = useRoomRevision();
  const { showVoiceStage, isDirectVoice } = useDirectVoiceContext();
  const switchToVoice = useSwitchToVoiceContext();
  const kind = isDirectVoice ? "voice" : (switchToVoice.voice.voiceActive ? "voice" : "video");
  if (!showVoiceStage) return null;
  return <SessionDock key={revision} kind={kind} />;
}

export default function RoomBody() {
  const { sessionStatus, voiceConnecting } = useRoomSession();

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f1ec]">
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        <RoomSecureStrip sessionStatus={sessionStatus} />

        <RoomSessionDock />

        <div
          className={cn(
            "relative flex min-h-0 flex-1 flex-col overflow-hidden",
            voiceConnecting && "blur-sm",
          )}
        >
          <MessageArea />
        </div>

        <ChatFooter />
      </div>
    </div>
  );
}
