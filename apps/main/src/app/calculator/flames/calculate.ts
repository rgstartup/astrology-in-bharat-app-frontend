export interface FlamesItem {
  letter: string;
  label: string;
  desc: string;
}

export const FLAMES_DATA: FlamesItem[] = [
  { letter: "F", label: "Friends", desc: "You are good friends and enjoy each other's company." },
  { letter: "L", label: "Love", desc: "There is a strong feeling of love and attraction." },
  { letter: "A", label: "Affection", desc: "You care deeply about each other and show affection." },
  { letter: "M", label: "Marriage", desc: "You have a good chance of a happy and successful married life." },
  { letter: "E", label: "Enemies", desc: "There may be some ego clashes or misunderstandings." },
  { letter: "S", label: "Siblings", desc: "You are like siblings, very close and comfortable." },
];

export const resultConfig: Record<string, { color: string; icon: string }> = {
  F: { color: "#F26500", icon: "fa-solid fa-user-group" },
  L: { color: "#E63E6D", icon: "fa-solid fa-heart" },
  A: { color: "#9B59B6", icon: "fa-solid fa-hands-holding-heart" },
  M: { color: "#2ECC71", icon: "fa-solid fa-rings-wedding" },
  E: { color: "#E74C3C", icon: "fa-solid fa-bolt" },
  S: { color: "#3498DB", icon: "fa-solid fa-people-arrows" },
};

export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");
}

export function calculateFLAMES(name1: string, name2: string): string {
  const n1 = normalizeName(name1).split("");
  const n2 = normalizeName(name2).split("");

  for (let i = 0; i < n1.length; i++) {
    const idx = n2.indexOf(n1[i]!);
    if (idx !== -1) {
      n1[i] = "";
      n2[idx] = "";
    }
  }
  const count = n1.filter(Boolean).length + n2.filter(Boolean).length;

  const flames = ["F", "L", "A", "M", "E", "S"];
  let idx = 0;
  while (flames.length > 1) {
    idx = (idx + count - 1) % flames.length;
    flames.splice(idx, 1);
    if (idx === flames.length) idx = 0;
  }
  return flames[0]!;
}
