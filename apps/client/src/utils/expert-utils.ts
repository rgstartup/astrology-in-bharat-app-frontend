import type { Expert } from "@repo/lib";

/**
 * Extracts and normalizes an array of human-readable specialization names
 * from diverse backend response shapes (string, array of strings, array of objects, etc.).
 */
export function extractSpecializationNames(raw: any): string[] {
  if (!raw) return [];

  // If it's a JSON string, try parsing it
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractSpecializationNames(parsed);
      } catch {
        // Fall back to regular string splitting
      }
    }
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter(
        (s) =>
          Boolean(s) &&
          s !== "[object Object]" &&
          s !== "null" &&
          s !== "undefined" &&
          !s.startsWith("[object"),
      );
  }

  // If it's an array
  if (Array.isArray(raw)) {
    const results: string[] = [];
    for (const item of raw) {
      if (!item) continue;
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (
          trimmed &&
          trimmed !== "[object Object]" &&
          trimmed !== "null" &&
          trimmed !== "undefined" &&
          !trimmed.startsWith("[object")
        ) {
          results.push(trimmed);
        }
      } else if (typeof item === "object") {
        const extracted =
          item.specialization?.name ||
          item.specialization?.title ||
          (typeof item.specialization === "string"
            ? item.specialization
            : "") ||
          item.name ||
          item.title ||
          item.specialization_name ||
          item.label ||
          item.value ||
          "";
        const trimmed = typeof extracted === "string" ? extracted.trim() : "";
        if (
          trimmed &&
          trimmed !== "[object Object]" &&
          trimmed !== "null" &&
          trimmed !== "undefined" &&
          !trimmed.startsWith("[object")
        ) {
          results.push(trimmed);
        }
      }
    }
    return Array.from(new Set(results));
  }

  // If it's a single object
  if (typeof raw === "object") {
    const name =
      raw.specialization?.name ||
      raw.specialization?.title ||
      (typeof raw.specialization === "string" ? raw.specialization : "") ||
      raw.name ||
      raw.title ||
      raw.specialization_name ||
      raw.label ||
      "";
    const trimmed = typeof name === "string" ? name.trim() : "";
    return trimmed &&
      trimmed !== "[object Object]" &&
      trimmed !== "null" &&
      trimmed !== "undefined" &&
      !trimmed.startsWith("[object")
      ? [trimmed]
      : [];
  }

  return [];
}

/**
 * Returns a clean comma-separated string of specializations.
 */
export function formatSpecializationsString(
  raw: any,
  fallback = "Vedic Astrology",
): string {
  const names = extractSpecializationNames(raw);
  return names.length > 0 ? names.join(", ") : fallback;
}

export type BadgeVariantType =
  | "saffron"
  | "purple"
  | "emerald"
  | "blue"
  | "rose"
  | "teal"
  | "amber"
  | "gold"
  | "indigo";

export interface SpecializationBadgeStyle {
  variant: BadgeVariantType;
  iconColor: string;
  badgeBg: string;
}

const SPECIALIZATION_PALETTES: SpecializationBadgeStyle[] = [
  {
    variant: "saffron",
    iconColor: "text-orange",
    badgeBg: "bg-orange/10 border-orange/20 text-orange",
  },
  {
    variant: "purple",
    iconColor: "text-purple-600",
    badgeBg:
      "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    variant: "emerald",
    iconColor: "text-emerald-600",
    badgeBg:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    variant: "blue",
    iconColor: "text-blue-600",
    badgeBg:
      "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    variant: "rose",
    iconColor: "text-rose-600",
    badgeBg:
      "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
  },
  {
    variant: "amber",
    iconColor: "text-amber-600",
    badgeBg:
      "bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300",
  },
  {
    variant: "teal",
    iconColor: "text-teal-600",
    badgeBg:
      "bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-300",
  },
  {
    variant: "indigo",
    iconColor: "text-indigo-600",
    badgeBg:
      "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300",
  },
];

export function getSpecializationBadgeStyle(
  name: string,
  index = 0,
): SpecializationBadgeStyle {
  const lower = (name || "").toLowerCase();
  if (
    lower.includes("vedic") ||
    lower.includes("kundli") ||
    lower.includes("jyotish")
  ) {
    return SPECIALIZATION_PALETTES[0]!;
  }
  if (
    lower.includes("tarot") ||
    lower.includes("psychic") ||
    lower.includes("spiritual")
  ) {
    return SPECIALIZATION_PALETTES[1]!;
  }
  if (lower.includes("vastu") || lower.includes("feng")) {
    return SPECIALIZATION_PALETTES[2]!;
  }
  if (lower.includes("numerology") || lower.includes("prashna")) {
    return SPECIALIZATION_PALETTES[3]!;
  }
  if (
    lower.includes("love") ||
    lower.includes("relationship") ||
    lower.includes("palmistry")
  ) {
    return SPECIALIZATION_PALETTES[4]!;
  }
  if (
    lower.includes("gem") ||
    lower.includes("rudraksha") ||
    lower.includes("remedy")
  ) {
    return SPECIALIZATION_PALETTES[5]!;
  }
  if (lower.includes("kp") || lower.includes("lal kitab")) {
    return SPECIALIZATION_PALETTES[6]!;
  }
  return SPECIALIZATION_PALETTES[index % SPECIALIZATION_PALETTES.length]!;
}

/**
 * Extracts the primary profession title from an expert object,
 * respecting the new `professions` array with `is_primary: true`,
 * and gracefully falling back to legacy fields.
 */
export function extractPrimaryProfession(
  expert: Expert,
  fallback = "Astrologer",
): string {
  if (!expert) {
    console.log("no expert, falling back to astrologer");
    return fallback;
  }

  // 1. Check `professions` array for `is_primary: true`
  const primary = expert.professions?.find((p) => p && p.is_primary === true);
  if (primary) {
    const title = primary.profession?.title;
    if (title && typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  // If no explicit primary flag, pick the first profession
  const first = expert.professions?.[0];
  if (first) {
    const title = first.profession?.title;
    if (title && typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  // 2. Direct string profession
  if (typeof expert.profession === "string" && expert.profession.trim()) {
    return expert.profession.trim();
  }

  // 3. Direct object profession
  if (typeof expert.profession === "object" && expert.profession) {
    const title = expert.profession.title;
    if (title && typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  // 4. primary_profession property
  if (
    typeof expert.primary_profession === "string" &&
    expert.primary_profession.trim()
  ) {
    return expert.primary_profession.trim();
  }

  return fallback;
}

/**
 * Extracts all profession titles as a list of strings.
 */
export function extractProfessionNames(expert: any): string[] {
  if (!expert) return [];

  if (Array.isArray(expert.professions) && expert.professions.length > 0) {
    const names: string[] = [];
    for (const p of expert.professions) {
      if (!p) continue;
      const title =
        p.profession?.title || p.profession?.name || p.title || p.name;
      if (title && typeof title === "string" && title.trim()) {
        names.push(title.trim());
      }
    }
    if (names.length > 0) return names;
  }

  const single = extractPrimaryProfession(expert, "");
  return single ? [single] : [];
}
