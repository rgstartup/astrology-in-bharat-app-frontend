export interface BreakupPatchupResult {
  patchup: number;
  breakup: number;
  advice: string;
}

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

export const normalizeString = (str: string): string =>
  str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

export const getAdvice = (patchup: number): string => {
  if (patchup >= 70)
    return "High chances of patch-up! A little effort, honest communication, and forgiveness can bring back the lost spark.";
  if (patchup >= 50)
    return "It's a balanced situation. There is hope, but both need to let go of their egos and have a deep heart-to-heart talk.";
  return "The energies are pulling apart right now. Sometimes space is exactly what you both need to heal and gain clarity.";
};

export const calculateBreakupPatchup = (
  yourName: string,
  partnerName: string,
  _yourAge?: string,
  _partnerAge?: string
): BreakupPatchupResult => {
  const key = [normalizeString(yourName), normalizeString(partnerName)]
    .sort()
    .join("|");
  const seed = hashSeed(key);

  const patchup = (seed % 51) + 40; // 40–90
  const breakup = clamp(100 - patchup + ((seed % 11) - 5), 5, 60); // 5–60

  return {
    patchup,
    breakup,
    advice: getAdvice(patchup),
  };
};
