export { default as ConsultationPrepHost } from "./components/root/consultation-prep-host.component";
export { default as ConsultationPrepModal } from "./components/modal";
export { useConsultationPrep } from "./hooks/use-consultation-prep";
export { resolveModePrice } from "@/lib/pricing";
export { requestConsultationPrep } from "./api";
export type { RequestConsultationDeps } from "./api";
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
