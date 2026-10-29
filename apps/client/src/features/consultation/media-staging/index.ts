// Feature: consultation/media-staging
// Sub-domain barrel — explicit named exports, tree-shake friendly

/// Components
export { MediaConnectionStage } from "./components/media-connection-stage";
export type { MediaConnectionStageProps } from "./components/media-connection-stage";
export { MediaConnectionBadge } from "./components/media-connection-badge";
export { MediaZeroChargeBanner } from "./components/media-zero-charge-banner";
export { MediaControlsPreview } from "./components/media-controls-preview";

/// Types
export type { MediaConnectionStep, MediaKind } from "./types/media-connection-types";
export {
  getMediaStepSubtitle,
  getMediaStepTitle,
} from "./types/media-connection-types";
