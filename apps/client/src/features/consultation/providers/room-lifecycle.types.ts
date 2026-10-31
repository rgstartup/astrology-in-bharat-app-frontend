import type React from "react";
import type { useRouter } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import type { IAuthUser } from "@/store/authStore";
import type { ChatHistorySessionDto } from "@/actions/chat";
import type { RoomSessionStatus } from "../hooks/use-room-verdict";
import type { useRoomSessionSummary } from "../hooks/use-room-session-summary";
import type {
  ConsultationMode,
  ConsultationStatePayload,
  ConsultationEndedPayload,
} from "@/realtime/types/consultation";
import type { ChatMessagePayload } from "@/realtime/types/chat";
import type {
  ConsultationDecision,
  useConsultation,
} from "@/realtime/hooks/use-consultation";
import type { useRoomBudget } from "../../../realtime/hooks/use-room-budget";

export interface RoomLifecycleContextValue {
  roomConsultationId: number | null;
  expertData: IExpert;
  user: IAuthUser | null;
  balance: number;
  router: ReturnType<typeof useRouter>;
  roomMode: ConsultationMode;
  sessions: ChatHistorySessionDto[];
  refreshSessions: () => Promise<void>;
  sessionId: string | null;
  sessionStatus: RoomSessionStatus;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleEndChat: (force?: boolean) => void;
  pendingExpiresAt: string | null;
  maxMinutes: number | null;
  elapsedTime: number;
  timeLeft: number | null;
  displayElapsedTime: number;
  displayTimeLeft: number;
  isSessionEnded: boolean;
  chatRate: number;
  sessionSummary: ReturnType<typeof useRoomSessionSummary>["sessionSummary"];
  decision: ConsultationDecision;
  acceptedVoiceToken: ReturnType<typeof useConsultation>["voiceToken"];
  isWarning: ReturnType<typeof useRoomBudget>["isWarning"];
  consultationState: ConsultationStatePayload | null;
  endedVerdict: ConsultationEndedPayload | null;
  pausedState: ReturnType<typeof useConsultation>["paused"];
  pauseLiveChat: ReturnType<typeof useConsultation>["pause"];
  resumeLiveChat: ReturnType<typeof useConsultation>["resume"];
  endLiveChat: ReturnType<typeof useConsultation>["end"];
  /** RTC session is live (voice/video). Gates the room timer until true. */
  voiceLive: boolean;
  setVoiceLive: (live: boolean) => void;
  /** RTC is connecting but not yet live. Gates the message-area blur only. */
  voiceConnecting: boolean;
  liveMessages: ChatMessagePayload[];
  sendLiveMessage: ReturnType<typeof useConsultation>["send"];
  sendLiveTyping: ReturnType<typeof useConsultation>["typing"];
  remoteTyping: boolean;
  resumeRevision: number;
  reviewRating: number;
  setReviewRating: React.Dispatch<React.SetStateAction<number>>;
  reviewComment: string;
  setReviewComment: React.Dispatch<React.SetStateAction<string>>;
  reviewSubmitted: boolean;
  setReviewSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RoomLifecycleProviderProps {
  roomConsultationId: number | null;
  expertData: IExpert;
  initialSessions?: ChatHistorySessionDto[];
  children: React.ReactNode;
}
