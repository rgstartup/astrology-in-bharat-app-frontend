import {
  RelationshipType,
  TimelineResult,
} from "@/lib/types/calculator";

export const normalizeName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getLabelAndMessage = (percent: number, tResults: any) => {
  if (percent <= 40) {
    return {
      label: tResults.labels.low,
      message: tResults.messages.low,
    };
  }
  if (percent <= 70) {
    return {
      label: tResults.labels.balanced,
      message: tResults.messages.balanced,
    };
  }
  return {
    label: tResults.labels.strong,
    message: tResults.messages.strong,
  };
};

export const getWeights = (type: RelationshipType) => {
  if (type === "Crush") return { mood: 10, bond: -5, stability: -15 };
  if (type === "Dating") return { mood: 5, bond: 5, stability: 0 };
  return { mood: 0, bond: 10, stability: 15 }; // Married
};

export const calculateRelationshipTimeline = (
  formData: {
    yourName: string;
    partnerName: string;
    relationshipType: RelationshipType;
    yourDob?: string;
    partnerDob?: string;
  },
  tResults: any
): TimelineResult => {
  const { yourName, partnerName, relationshipType, yourDob = "", partnerDob = "" } = formData;

  const key = [
    normalizeName(yourName) + yourDob,
    normalizeName(partnerName) + partnerDob,
  ]
    .sort()
    .join("|");

  const seed = hashSeed(key);

  // Deterministic scores
  let mood7 = (seed + 7) % 101;
  let bond30 = (seed + 30) % 101;
  let stability180 = (seed + 180) % 101;

  // Apply weights
  const w = getWeights(relationshipType);
  mood7 = clamp(mood7 + w.mood, 0, 100);
  bond30 = clamp(bond30 + w.bond, 0, 100);
  stability180 = clamp(stability180 + w.stability, 0, 100);

  // Realism rule
  stability180 = Math.min(stability180, bond30 + 15);

  const moodInfo = getLabelAndMessage(mood7, tResults);
  const bondInfo = getLabelAndMessage(bond30, tResults);
  const stabilityInfo = getLabelAndMessage(stability180, tResults);

  const summary =
    mood7 <= 40 || bond30 <= 40 || stability180 <= 40
      ? tResults.summaries.needsPatience
      : mood7 <= 70 || bond30 <= 70 || stability180 <= 70
        ? tResults.summaries.balanced
        : tResults.summaries.strong;

  return {
    mood7: {
      title: tResults.periods.mood,
      percent: mood7,
      label: moodInfo.label,
      message: moodInfo.message,
    },
    bond30: {
      title: tResults.periods.bond,
      percent: bond30,
      label: bondInfo.label,
      message: bondInfo.message,
    },
    stability180: {
      title: tResults.periods.stability,
      percent: stability180,
      label: stabilityInfo.label,
      message: stabilityInfo.message,
    },
    summary,
  };
};
