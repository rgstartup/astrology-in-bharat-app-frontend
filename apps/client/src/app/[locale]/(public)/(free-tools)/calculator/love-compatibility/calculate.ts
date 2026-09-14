export interface LoveCompatibilityResult {
  love: number;
  loveMetric: number;
  trust: number;
  communication: number;
  emotions: number;
  understanding: number;
}

export interface MeaningItem {
  range: string;
  label: string;
  icon: string;
  desc: string;
}

export const MEANING_DATA: MeaningItem[] = [
  { range: "0% - 20%", label: "Very Low", icon: "fa-heart-crack text-red-500", desc: "You both are not compatible. Work on your relationship." },
  { range: "21% - 40%", label: "Low Compatibility", icon: "fa-face-frown text-orange-400", desc: "You may face challenges in your relationship." },
  { range: "41% - 60%", label: "Average Compatibility", icon: "fa-face-meh text-yellow-500", desc: "Your relationship can grow with effort." },
  { range: "61% - 80%", label: "Good Compatibility", icon: "fa-face-smile text-green-500", desc: "You both understand each other well." },
  { range: "81% - 100%", label: "Excellent Compatibility", icon: "fa-heart text-pink-500", desc: "You are perfect for each other." },
];

export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const clamp = (num: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, num));

export const getLoveCompatibilityLabelAndDesc = (score: number) => {
  const label =
    score >= 81
      ? "Excellent Compatibility"
      : score >= 61
      ? "Good Compatibility"
      : score >= 41
      ? "Average Compatibility"
      : score >= 21
      ? "Low Compatibility"
      : "Very Low Compatibility";

  const desc =
    score >= 81
      ? "You are perfect for each other. Your bond is deep, passionate, and full of love."
      : score >= 61
      ? "You share a strong emotional connection and understand each other well. Keep nurturing your relationship with trust, love and patience."
      : score >= 41
      ? "Your relationship can grow with effort. There are some areas to work on, but love and patience can overcome them."
      : "You may face challenges in your relationship. Communication and understanding are required to make it work.";

  return { label, desc };
};

export const calculateLoveCompatibility = (
  yourName: string,
  partnerName: string
): LoveCompatibilityResult => {
  const seed = hashSeed(
    (yourName + partnerName).toLowerCase().replace(/\s+/g, "")
  );
  const love = (seed % 61) + 40; // 40 to 100

  return {
    love,
    loveMetric: clamp(love + ((seed % 15) - 7), 0, 100),
    trust: clamp(love + (((seed >> 2) % 21) - 10), 0, 100),
    communication: clamp(love + (((seed >> 4) % 15) - 5), 0, 100),
    emotions: clamp(love + (((seed >> 6) % 11) - 2), 0, 100),
    understanding: clamp(love + (((seed >> 8) % 17) - 8), 0, 100),
  };
};
