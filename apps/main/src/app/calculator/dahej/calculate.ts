import { hashSeed, normalizeName, formatIndianCurrency } from "./helpers";

export interface DahejEstimateResult {
  education: string;
  profession: string;
  income: string;
  city: string;
  minFormatted: string;
  maxFormatted: string;
}

export interface AwarenessItem {
  icon: string;
  title: string;
  desc: string;
}

export const EDUCATION_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
];

export const PROFESSION_OPTIONS = [
  "Government Employee",
  "Software Engineer",
  "Doctor",
  "Lawyer",
  "Business Owner",
  "Teacher / Professor",
  "Engineer",
  "Banker",
  "CA / Finance",
  "Other",
];

export const INCOME_OPTIONS = [
  "Below 2 Lakh",
  "2 - 5 Lakh",
  "5 - 10 Lakh",
  "10 - 15 Lakh",
  "15 - 20 Lakh",
  "20 - 30 Lakh",
  "30 - 50 Lakh",
  "Above 50 Lakh",
];

export const CITY_OPTIONS = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Bhopal",
  "Patna",
  "Indore",
  "Nagpur",
  "Other",
];

export const incomeMultiplier: Record<string, number> = {
  "Below 2 Lakh": 0.4,
  "2 - 5 Lakh": 0.6,
  "5 - 10 Lakh": 0.8,
  "10 - 15 Lakh": 1.0,
  "15 - 20 Lakh": 1.2,
  "20 - 30 Lakh": 1.5,
  "30 - 50 Lakh": 2.0,
  "Above 50 Lakh": 3.0,
};

export const educationMultiplier: Record<string, number> = {
  "High School": 0.5,
  "Diploma": 0.7,
  "Bachelor's Degree": 1.0,
  "Master's Degree": 1.3,
  "PhD / Doctorate": 1.6,
};

export const cityMultiplier: Record<string, number> = {
  "Delhi": 1.5,
  "Mumbai": 1.6,
  "Bangalore": 1.4,
  "Hyderabad": 1.3,
  "Chennai": 1.2,
  "Kolkata": 1.1,
  "Pune": 1.2,
  "Chandigarh": 1.3,
  "Ahmedabad": 1.1,
  "Jaipur": 1.0,
  "Other": 0.9,
};

export const AWARENESS: AwarenessItem[] = [
  { icon: "fa-solid fa-scale-balanced", title: "Legal Awareness", desc: "Dowry is a punishable offense under the Dowry Prohibition Act, 1961." },
  { icon: "fa-solid fa-handshake", title: "Respect & Equality", desc: "Support a dowry-free society and promote equal relationships." },
  { icon: "fa-solid fa-people-group", title: "Build Better Future", desc: "Say no to dowry and build a better tomorrow." },
  { icon: "fa-solid fa-shield-halved", title: "Report & Support", desc: "Report dowry demands and help stop this social evil." },
];

export const calculateDahejEstimate = (
  education: string,
  profession: string,
  income: string,
  city: string
): DahejEstimateResult => {
  const seed = hashSeed(normalizeName(`${education}${profession}${city}`));
  const eduMul = educationMultiplier[education] ?? 1;
  const incMul = incomeMultiplier[income] ?? 1;
  const citMul = cityMultiplier[city] ?? 1;
  const base = 500000 + (seed % 500000);
  const amount = Math.round(base * eduMul * incMul * citMul);
  const min = Math.round(amount * 0.85);
  const max = Math.round(amount * 1.15);

  return {
    education,
    profession,
    income,
    city,
    minFormatted: formatIndianCurrency(min, { lakh: "Lakh", cr: "Cr" }),
    maxFormatted: formatIndianCurrency(max, { lakh: "Lakh", cr: "Cr" }),
  };
};
