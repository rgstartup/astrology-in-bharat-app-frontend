"use client";

import React from "react";
import MessageArea from "../message-area/message-area";
import ChatFooter from "../chat/chat-footer";
import RoomSecureStrip from "./room-secure-strip";
import { useRoomRevision } from "@/realtime/hooks/use-room-revision";
import { SessionDock } from "../session/session-dock";
import { VoiceStage } from "../voice/voice-stage";
import { useVoiceContext } from "../../providers/voice.provider";

function RoomSessionDock() {
  const revision = useRoomRevision();
  const { active, phase } = useVoiceContext();
  if (!active || phase === "ended") return null;
  return <SessionDock key={revision} kind="voice" />;
}

export default function RoomBody() {
  const { showVoiceStage } = useVoiceContext();

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f1ec]">
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        {/* <RoomSecureStrip sessionStatus={sessionStatus} /> */}
        <RoomSessionDock />
        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {showVoiceStage ? <VoiceStage /> : <MessageArea />}
        </div>
        <ChatFooter />
      </div>
    </div>
  );
}
