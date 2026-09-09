export interface LoyaltyFeedback {
  label: string;
  text: string;
  color: string;
  bg: string;
}

export interface LoyalPartnerResult {
  score: number;
  feedback: LoyaltyFeedback;
}

export const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const normalizeString = (str: string): string =>
  str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

export const getLoyaltyFeedback = (score: number): LoyaltyFeedback => {
  if (score >= 90)
    return {
      label: "Extremely Loyal",
      text: "You two share an unbreakable bond built on deep trust and mutual respect.",
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
    };
  if (score >= 75)
    return {
      label: "Highly Loyal",
      text: "A strong and faithful connection. Keep nurturing your beautiful relationship.",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    };
  if (score >= 60)
    return {
      label: "Moderate Trust",
      text: "There's good potential, but open communication is needed to build deeper trust.",
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
    };
  return {
    label: "Needs Work",
    text: "Trust takes time to build. Be patient and honest with each other.",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  };
};

export const calculateLoyaltyScore = (
  yourName: string,
  partnerName: string,
  yourDob: string,
  partnerDob: string
): LoyalPartnerResult => {
  const key = [
    normalizeString(yourName + yourDob),
    normalizeString(partnerName + partnerDob),
  ]
    .sort()
    .join("|");
  const seed = hashSeed(key);
  const score = (seed % 51) + 50; // Returns 50-100

  return {
    score,
    feedback: getLoyaltyFeedback(score),
  };
};
