"use client";

import React from "react";
import MessageArea from "../message-area/message-area";
import ChatFooter from "../chat/chat-footer";
import { cn } from "@repo/design/cn";
import RoomSecureStrip from "./room-secure-strip";
import { useRoomRevision } from "../../../../realtime/hooks/use-room-revision";
import { SessionDock, type SessionDockProps } from "../session/session-dock";
import { useRoomSession } from "../../providers/room-lifecycle.provider";
import { useDirectVoiceContext } from "../../providers/direct-voice.provider";
import { useSwitchToVoiceContext } from "../../providers/switch-to-voice.provider";

function RoomSessionDock({ dock }: { dock?: SessionDockProps | null }) {
  const revision = useRoomRevision();
  if (!dock) return null;
  return (
    <SessionDock
      key={revision}
      kind={dock.kind}
      phase={dock.phase}
      elapsedText={dock.elapsedText}
      rate={dock.rate}
      muted={dock.muted}
      onToggleMute={dock.onToggleMute}
      speakerMuted={dock.speakerMuted}
      onToggleSpeaker={dock.onToggleSpeaker}
      expanded={dock.expanded}
      onToggleExpand={dock.onToggleExpand}
      onEnd={dock.onEnd}
      onCancelRequest={dock.onCancelRequest}
    />
  );
}

export default function RoomBody() {
  const { sessionStatus, voiceConnecting } = useRoomSession();
  const { dockProps } = useDirectVoiceContext();

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f1ec]">
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        <RoomSecureStrip sessionStatus={sessionStatus} />

        <RoomSessionDock dock={dockProps} />

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
