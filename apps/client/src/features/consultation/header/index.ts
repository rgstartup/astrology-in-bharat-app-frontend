// Feature: consultation/header
// Sub-domain barrel — explicit named exports, tree-shake friendly

/// Components
export type { HeaderProps } from "./components/header";
export { default as Header } from "./components/header";
export { BackAffordance } from "./components/back-affordance";
export { EndSessionButton } from "./components/end-session-button";
export { ExpertIdentity } from "./components/expert-identity";
export { SessionMetrics } from "./components/session-metrics";
export { SessionProgressBar } from "./components/session-progress-bar";
export { SessionStatusBadge } from "./components/session-status-badge";
export { SessionTimer, SessionTimerCompact } from "./components/session-timer";
