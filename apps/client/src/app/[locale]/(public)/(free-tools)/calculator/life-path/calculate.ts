export interface LifePathDetail {
  title: string;
  desc: string;
}

export const LIFE_PATH_DETAILS: Record<number, LifePathDetail> = {
  1: { title: "The Leader", desc: "Independent, innovative, and driven. You are meant to lead and pave new paths." },
  2: { title: "The Peacemaker", desc: "Diplomatic, sensitive, and cooperative. You bring harmony to relationships." },
  3: { title: "The Communicator", desc: "Creative, expressive, and sociable. You inspire others with your joy and art." },
  4: { title: "The Builder", desc: "Practical, hardworking, and reliable. You build solid foundations for the future." },
  5: { title: "The Explorer", desc: "Adventurous, versatile, and freedom-loving. You thrive on change and new experiences." },
  6: { title: "The Nurturer", desc: "Responsible, loving, and protective. You care deeply for family and community." },
  7: { title: "The Seeker", desc: "Analytical, spiritual, and intellectual. You search for truth and deeper meaning." },
  8: { title: "The Powerhouse", desc: "Ambitious, authoritative, and goal-oriented. You are driven by success and material mastery." },
  9: { title: "The Humanitarian", desc: "Compassionate, generous, and idealistic. You want to make the world a better place." },
  11: { title: "The Illuminator", desc: "Intuitive, inspiring, and visionary. You have a deep spiritual awareness." },
  22: { title: "The Master Builder", desc: "Practical idealist. You can turn grand visions into reality." },
  33: { title: "The Master Teacher", desc: "Altruistic and deeply devoted. You serve as an uplifting guide to humanity." },
};

export const calculateLifePath = (dateStr: string): number => {
  if (!dateStr) return 1;
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum || 1;
};

export const getLifePathDetails = (pathNum: number): LifePathDetail => {
  return LIFE_PATH_DETAILS[pathNum] || LIFE_PATH_DETAILS[1]!;
};
