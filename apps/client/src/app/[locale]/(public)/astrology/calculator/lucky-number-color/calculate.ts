export interface NumberDetail {
  color: string;
  hex: string;
  desc: string;
  traits: string;
}

export const NUMBER_DETAILS: Record<number, NumberDetail> = {
  1: { color: "Red", hex: "#E74C3C", desc: "Sun", traits: "Leadership, Independence, Originality" },
  2: { color: "White", hex: "#FDFEFE", desc: "Moon", traits: "Cooperation, Adaptability, Harmony" },
  3: { color: "Yellow", hex: "#F1C40F", desc: "Jupiter", traits: "Creativity, Expression, Joy" },
  4: { color: "Brown", hex: "#8E44AD", desc: "Rahu", traits: "Order, Service, Struggle" },
  5: { color: "Green", hex: "#2ECC71", desc: "Mercury", traits: "Expansion, Vision, Adventure" },
  6: { color: "Pink", hex: "#FFB6C1", desc: "Venus", traits: "Responsibility, Love, Sympathy" },
  7: { color: "Grey", hex: "#95A5A6", desc: "Ketu", traits: "Analysis, Understanding, Knowledge" },
  8: { color: "Blue", hex: "#3498DB", desc: "Saturn", traits: "Practical Endeavors, Status, Power" },
  9: { color: "Orange", hex: "#E67E22", desc: "Mars", traits: "Humanitarian, Giving Nature, Selflessness" },
};

export const calculateLuckyNumber = (dateStr: string): number => {
  if (!dateStr) return 1;
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum || 1;
};

export const getLuckyNumberDetails = (num: number): NumberDetail => {
  return NUMBER_DETAILS[num] || NUMBER_DETAILS[1]!;
};
