export interface SampleExpert {
  id: string | number;
  name: string;
  specialization: string;
  experience_years: number;
  ratings: number;
  consultations_count: number;
  is_available: boolean;
  chat_price: number;
  avatar: string;
  languages: string[];
}

export const SAMPLE_RECOMMENDED_EXPERTS: SampleExpert[] = [
  {
    id: "exp-1",
    name: "Acharya Rajesh Sharma",
    specialization: "Vedic Astrology & Kundli Milan",
    experience_years: 18,
    ratings: 4.9,
    consultations_count: 5420,
    is_available: true,
    chat_price: 35,
    avatar: "/images/dummy-expert.jpg",
    languages: ["Hindi", "English", "Sanskrit"],
  },
  {
    id: "exp-2",
    name: "Dr. Sunita Shastri",
    specialization: "Prashna Kundli & Career Astrologer",
    experience_years: 15,
    ratings: 4.9,
    consultations_count: 3890,
    is_available: true,
    chat_price: 30,
    avatar: "/images/dummy-expert.jpg",
    languages: ["Hindi", "English"],
  },
  {
    id: "exp-3",
    name: "Pandit Devendra Nath",
    specialization: "Vimshottari Dasha & Gemology",
    experience_years: 22,
    ratings: 4.8,
    consultations_count: 8150,
    is_available: false,
    chat_price: 45,
    avatar: "/images/dummy-expert.jpg",
    languages: ["Hindi", "Gujarati"],
  },
  {
    id: "exp-4",
    name: "Tarot Reader Ananya",
    specialization: "Tarot Reading & Spiritual Healing",
    experience_years: 9,
    ratings: 4.9,
    consultations_count: 2400,
    is_available: true,
    chat_price: 25,
    avatar: "/images/dummy-expert.jpg",
    languages: ["English", "Hindi"],
  },
];
