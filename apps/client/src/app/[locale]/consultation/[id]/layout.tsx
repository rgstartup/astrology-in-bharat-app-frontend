import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getChatHistoryAction, getChatPrepExpertAction } from "@/actions/chat";
import { RoomLifecycleProvider } from "@/features/consultation/providers";

type ConsultationLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

/**
 * Fetches the authenticated consultation seed on the server and provides it
 * through `RoomLifecycleProvider` — the single seed source every consultation
 * hook derives from. Dynamic rendering lets router.refresh() request a fresh
 * seed after accept.
 */
export const dynamic = "force-dynamic";

export default async function ConsultationLayout({
  children,
  params,
}: ConsultationLayoutProps) {
  const { id } = await params;
  const consultationId = Number(id);

  if (!Number.isSafeInteger(consultationId) || consultationId <= 0) {
    redirect("/");
  }

  const historyResult = await getChatHistoryAction(consultationId);
  if (!historyResult.ok || !historyResult.data) {
    throw new Error("Failed to load consultation history");
  }

  const expertResult = await getChatPrepExpertAction(
    historyResult.data.expertId,
  );
  if (!expertResult.ok) {
    throw new Error("Failed to load expert");
  }

  const sessions = historyResult.data.sessions ?? [];

  return (
    <RoomLifecycleProvider
      roomConsultationId={consultationId}
      expertData={expertResult.data}
      initialSessions={sessions}
    >
      {children}
    </RoomLifecycleProvider>
  );
}
