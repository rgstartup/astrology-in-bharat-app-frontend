export { default as ConsultationPrepHost } from "./ConsultationPrepHost";
export {
  default as ConsultationPrepModal,
} from "./components/consultation-prep-modal";
export { useConsultationPrep } from "./hooks/use-consultation-prep";
export { resolveModePrice } from "@/lib/pricing";
export {
  requestConsultationPrep,
} from "./request-consultation";
export type { RequestConsultationDeps } from "./request-consultation";
export {
  ConsultationModeIcon,
  ConsultationModeBadge,
  getConsultationModeLabel,
} from "./components/consultation-mode-icon";
export type {
  ConsultationMode,
  ConsultationVerdict,
  WaitOutcome,
  SomeoneElseData,
} from "./types";
