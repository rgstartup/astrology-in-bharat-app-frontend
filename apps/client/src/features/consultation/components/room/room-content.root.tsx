"use client";

import React, { useState, useMemo } from "react";
import { ChatVerdictWatcher } from "../chat/chat-verdict-watcher";
import { ConsultationSidebar } from "../sidebar/consultation-sidebar";
import { ChatColumnHeader } from "../chat/chat-column-header";
import SessionSummaryModal from "../session-summary/session-summary-modal";

import RoomPendingBanner from "./room-pending-banner";
import RoomBody from "./room-body";
import MainArea from "../root/main-area";

export function RoomContentRoot() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const drawerProps = useMemo(
    () => ({
      open: mobileSidebarOpen,
      onOpenChange: setMobileSidebarOpen,
    }),
    [mobileSidebarOpen, setMobileSidebarOpen],
  );

  return (
    <div className="font-sans fixed inset-0 z-50 flex overflow-hidden bg-[#f5f1ec] text-[#111111]">
      <RoomPendingBanner />
      <ChatVerdictWatcher />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <ChatColumnHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <MainArea drawer={drawerProps}>
          <RoomBody />
        </MainArea>
      </div>

      <ConsultationSidebar />
      <SessionSummaryModal />
    </div>
  );
}
