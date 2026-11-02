import type { IExpert } from "@repo/lib";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";

/** Options required to run the consultation request protocol. */
export interface ConsultationRequestOptions {
  expertId: string;
  mode: ConsultationMode;
  expert: Partial<IExpert> | null;
  /** Trips the prep modal's forced-recharge step on INSUFFICIENT_BALANCE. */
  onInsufficientBalance: () => void;
  /** Existing consultation to re-initiate into (e.g. continue chat). */
  consultationId?: number | null;
  /** Closes the prep modal after an expert verdict resolves the request. */
  onVerdictResolved?: () => void;
}

export type ExistingConsultationDetails = {
  consultationId: number;
  expertId: string;
} | null;
