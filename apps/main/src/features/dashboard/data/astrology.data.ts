export interface KundliPlanetData {
  planet: string;
  sign: string;
  house: number;
  degree: string;
  isRetrograde?: boolean;
  nakshatra: string;
  lord: string;
}

export interface KundliHouseData {
  house: number;
  sign: string;
  signLord: string;
  signification: string;
  planetsPresent: string[];
}

export interface DashaPeriod {
  planet: string;
  period: string;
  status: "completed" | "current" | "upcoming";
  impact: string;
}

export interface DoshaStatus {
  name: string;
  present: boolean;
  intensity: "Mild" | "Moderate" | "High" | "None";
  description: string;
  remedy: string;
}

export const DEFAULT_BIRTH_ASTROLOGY = {
  sunSign: "Aries",
  moonSign: "Taurus",
  ascendant: "Gemini",
  nakshatra: "Rohini",
  nakshatraLord: "Moon",
  birthDate: "1996-05-15",
  birthTime: "10:30 AM",
  birthPlace: "New Delhi, India",
};

export const SAMPLE_KUNDLI_PLANETS: KundliPlanetData[] = [
  {
    planet: "Ascendant (Lagna)",
    sign: "Gemini",
    house: 1,
    degree: "14° 28'",
    nakshatra: "Ardra",
    lord: "Rahu",
  },
  {
    planet: "Sun (Surya)",
    sign: "Aries",
    house: 11,
    degree: "28° 12'",
    nakshatra: "Krittika",
    lord: "Sun",
  },
  {
    planet: "Moon (Chandra)",
    sign: "Taurus",
    house: 12,
    degree: "06° 45'",
    nakshatra: "Krittika",
    lord: "Sun",
  },
  {
    planet: "Mars (Mangal)",
    sign: "Aries",
    house: 11,
    degree: "19° 04'",
    nakshatra: "Bharani",
    lord: "Venus",
  },
  {
    planet: "Mercury (Budha)",
    sign: "Taurus",
    house: 12,
    degree: "11° 50'",
    nakshatra: "Rohini",
    lord: "Moon",
  },
  {
    planet: "Jupiter (Guru)",
    sign: "Sagittarius",
    house: 7,
    degree: "22° 15'",
    isRetrograde: true,
    nakshatra: "Purva Ashadha",
    lord: "Venus",
  },
  {
    planet: "Venus (Shukra)",
    sign: "Gemini",
    house: 1,
    degree: "04° 32'",
    nakshatra: "Mrigashira",
    lord: "Mars",
  },
  {
    planet: "Saturn (Shani)",
    sign: "Pisces",
    house: 10,
    degree: "09° 18'",
    nakshatra: "Uttara Bhadrapada",
    lord: "Saturn",
  },
  {
    planet: "Rahu",
    sign: "Virgo",
    house: 4,
    degree: "21° 02'",
    isRetrograde: true,
    nakshatra: "Hasta",
    lord: "Moon",
  },
  {
    planet: "Ketu",
    sign: "Pisces",
    house: 10,
    degree: "21° 02'",
    isRetrograde: true,
    nakshatra: "Revati",
    lord: "Mercury",
  },
];

export const SAMPLE_KUNDLI_HOUSES: KundliHouseData[] = [
  {
    house: 1,
    sign: "Gemini",
    signLord: "Mercury",
    signification: "Self, Vitality & Physical Appearance",
    planetsPresent: ["Venus"],
  },
  {
    house: 2,
    sign: "Cancer",
    signLord: "Moon",
    signification: "Wealth, Family, Speech & Possessions",
    planetsPresent: [],
  },
  {
    house: 3,
    sign: "Leo",
    signLord: "Sun",
    signification: "Courage, Siblings, Communication & Short Journeys",
    planetsPresent: [],
  },
  {
    house: 4,
    sign: "Virgo",
    signLord: "Mercury",
    signification: "Mother, Vehicles, Mind & Domestic Happiness",
    planetsPresent: ["Rahu"],
  },
  {
    house: 5,
    sign: "Libra",
    signLord: "Venus",
    signification: "Intellect, Romance, Children & Past Merits",
    planetsPresent: [],
  },
  {
    house: 6,
    sign: "Scorpio",
    signLord: "Mars",
    signification: "Daily Work, Health, Service & Overcoming Obstacles",
    planetsPresent: [],
  },
  {
    house: 7,
    sign: "Sagittarius",
    signLord: "Jupiter",
    signification: "Partnerships, Marriage, Legalities & Trade",
    planetsPresent: ["Jupiter"],
  },
  {
    house: 8,
    sign: "Capricorn",
    signLord: "Saturn",
    signification: "Longevity, Transformation, Secrets & Sudden Gains",
    planetsPresent: [],
  },
  {
    house: 9,
    sign: "Aquarius",
    signLord: "Saturn",
    signification: "Dharma, Fortune, Higher Wisdom & Mentors",
    planetsPresent: [],
  },
  {
    house: 10,
    sign: "Pisces",
    signLord: "Jupiter",
    signification: "Career, Social Status, Authority & Achievements",
    planetsPresent: ["Saturn", "Ketu"],
  },
  {
    house: 11,
    sign: "Aries",
    signLord: "Mars",
    signification: "Income, Elder Siblings, Aspirations & Social Circles",
    planetsPresent: ["Sun", "Mars"],
  },
  {
    house: 12,
    sign: "Taurus",
    signLord: "Venus",
    signification: "Subconscious, Foreign Lands, Solitude & Spiritual Growth",
    planetsPresent: ["Moon", "Mercury"],
  },
];

export const SAMPLE_MAHADASHA: DashaPeriod[] = [
  {
    planet: "Rahu",
    period: "2008 – 2026",
    status: "current",
    impact: "Brings worldly ambition, analytical depth, and overseas connections.",
  },
  {
    planet: "Jupiter",
    period: "2026 – 2042",
    status: "upcoming",
    impact: "Auspicious period for spiritual elevation, marriage, and financial stabilization.",
  },
  {
    planet: "Saturn",
    period: "2042 – 2061",
    status: "upcoming",
    impact: "Disciplined maturity, leadership obligations, and lasting legacy.",
  },
];

export const SAMPLE_DOSHA_ANALYSIS: DoshaStatus[] = [
  {
    name: "Manglik Dosha",
    present: false,
    intensity: "None",
    description: "Mars is favorably positioned in the 11th house, away from marital afflictions.",
    remedy: "No specific remedy required. Auspicious alignment for partnerships.",
  },
  {
    name: "Kaal Sarp Dosha",
    present: false,
    intensity: "None",
    description: "Planets are distributed outside the Rahu-Ketu nodal axis.",
    remedy: "Natural freedom from nodal constraints.",
  },
  {
    name: "Sadhe Sati",
    present: true,
    intensity: "Mild",
    description: "Saturn transits the 11th from natal Moon, bringing fruitful rewards for discipline.",
    remedy: "Chant Hanuman Chalisa on Tuesdays & Saturdays for sustained peace of mind.",
  },
];

export interface PlanetTableRow {
  planet: string;
  sign: string;
  deg: string;
  nak: string;
  status: string;
}

export const SAMPLE_PLANETS_TABLE: PlanetTableRow[] = [
  { planet: "Sun (Surya)", sign: "Gemini", deg: "08° 14'", nak: "Mrigashira", status: "Direct" },
  { planet: "Moon (Chandra)", sign: "Taurus", deg: "14° 22'", nak: "Rohini", status: "Exalted" },
  { planet: "Mars (Mangal)", sign: "Aries", deg: "21° 04'", nak: "Bharani", status: "Own House" },
  { planet: "Mercury (Budh)", sign: "Taurus", deg: "29° 18'", nak: "Mrigashira", status: "Direct" },
  { planet: "Jupiter (Guru)", sign: "Cancer", deg: "11° 45'", nak: "Pushya", status: "Exalted" },
  { planet: "Venus (Shukra)", sign: "Gemini", deg: "04° 12'", nak: "Ardra", status: "Friendly" },
  { planet: "Saturn (Shani)", sign: "Taurus", deg: "19° 50'", nak: "Rohini", status: "Direct" },
  { planet: "Rahu", sign: "Taurus", deg: "24° 10'", nak: "Mrigashira", status: "Retrograde" },
  { planet: "Ketu", sign: "Scorpio", deg: "24° 10'", nak: "Jyeshtha", status: "Retrograde" },
];

export interface HouseItem {
  house: string;
  sign: string;
  sig: string;
}

export const SAMPLE_HOUSES_LIST: HouseItem[] = [
  { house: "1st House (Tanu Bhava)", sign: "Gemini", sig: "Self, Physical body, Life vitality, Personality" },
  { house: "2nd House (Dhana Bhava)", sign: "Cancer", sig: "Wealth, Speech, Family heritage, Values" },
  { house: "3rd House (Sahaja Bhava)", sign: "Leo", sig: "Siblings, Courage, Communication, Short journeys" },
  { house: "4th House (Bandhu Bhava)", sign: "Virgo", sig: "Mother, Vehicles, Domestic comfort, Real estate" },
  { house: "5th House (Putra Bhava)", sign: "Libra", sig: "Intellect, Children, Creativity, Past-life merits" },
  { house: "6th House (Ari Bhava)", sign: "Scorpio", sig: "Daily duty, Health resilience, Overcoming challenges" },
  { house: "7th House (Yuvati Bhava)", sign: "Sagittarius", sig: "Partnerships, Marriage, Global contracts, Public image" },
  { house: "8th House (Randhra Bhava)", sign: "Capricorn", sig: "Longevity, Occult research, Inheritance, Transformation" },
  { house: "9th House (Dharma Bhava)", sign: "Aquarius", sig: "Dharma, Higher wisdom, Fortunate journeys, Mentors" },
  { house: "10th House (Karma Bhava)", sign: "Pisces", sig: "Career, Leadership, Recognition, Public legacy" },
  { house: "11th House (Labha Bhava)", sign: "Aries", sig: "Aspirations, Inflow of wealth, Network circles" },
  { house: "12th House (Vyaya Bhava)", sign: "Taurus", sig: "Spiritual liberation, Foreign connections, Subconscious peace" },
];

export interface DashaTimelineItem {
  planet: string;
  period: string;
  status: string;
  current: boolean;
}

export const SAMPLE_VIMSHOTTARI_TIMELINE: DashaTimelineItem[] = [
  { planet: "Moon Mahadasha", period: "2018 – 2028", status: "Active (Current)", current: true },
  { planet: "Mars Mahadasha", period: "2028 – 2035", status: "Upcoming", current: false },
  { planet: "Rahu Mahadasha", period: "2035 – 2053", status: "Upcoming", current: false },
  { planet: "Jupiter Mahadasha", period: "2053 – 2069", status: "Upcoming", current: false },
];

export interface YogaItem {
  name: string;
  description: string;
}

export const SAMPLE_YOGAS_LIST: YogaItem[] = [
  {
    name: "Gaja Kesari Yoga",
    description: "Jupiter is placed in Kendra from the Moon, granting wisdom, leadership intellect, and broad respect.",
  },
  {
    name: "Budhaditya Yoga",
    description: "Sun and Mercury conjunction provides sharp analytical intelligence and oratorical ability.",
  },
  {
    name: "Amala Yoga",
    description: "Benefic planet in the 10th house from Ascendant/Moon fosters impeccable moral reputation in career.",
  },
  {
    name: "Veshi Yoga",
    description: "Planets in the 2nd from the Sun provide balanced speech, virtue, and steady prosperity.",
  },
];

export interface AstrologyHubModule {
  id: string;
  title: string;
  desc: string;
  href: string;
  iconName: "Scroll" | "Sun" | "Orbit" | "Star" | "Clock" | "ShieldAlert" | "HeartHandshake" | "FileText";
  badge: string;
  color: string;
}

export const ASTROLOGY_HUB_MODULES: AstrologyHubModule[] = [
  {
    id: "kundli",
    title: "My Kundli",
    desc: "Explore your complete Vedic Janam Kundli based on your saved birth coordinates.",
    href: "/dashboard/astrology/kundli",
    iconName: "Scroll",
    badge: "Core Chart",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    id: "horoscope",
    title: "My Horoscope",
    desc: "Personalized daily transit predictions, auspicious timings, and planetary favors.",
    href: "/dashboard/astrology/horoscope",
    iconName: "Sun",
    badge: "Daily Forecast",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    id: "planets",
    title: "Planetary Positions",
    desc: "Detailed planetary degrees, retrograde movements, and house positions at birth.",
    href: "/dashboard/astrology/kundli?tab=planets",
    iconName: "Orbit",
    badge: "Graha Sthiti",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "nakshatra",
    title: "Nakshatra & Pada",
    desc: "Your birth star deity, ruling planet, Gana, Nadi, and subconscious characteristics.",
    href: "/dashboard/astrology/kundli?tab=nakshatra",
    iconName: "Star",
    badge: "Birth Star",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    id: "dasha",
    title: "Vimshottari Dasha",
    desc: "Analyze your past, current, and upcoming Mahadasha, Antardasha, and life epochs.",
    href: "/dashboard/astrology/kundli?tab=dasha",
    iconName: "Clock",
    badge: "Time Periods",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "doshas",
    title: "Yogas & Doshas",
    desc: "Identification of auspicious Raj Yogas, Manglik Dosha, Kaal Sarp, and Vedic remedies.",
    href: "/dashboard/astrology/kundli?tab=doshas",
    iconName: "ShieldAlert",
    badge: "Afflictions & Yogas",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    id: "matching",
    title: "Kundli Matching",
    desc: "Ashtakoot Gana Milan with a partner using your saved astrological profile.",
    href: "/dashboard/astrology/matching",
    iconName: "HeartHandshake",
    badge: "Compatibility",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    id: "reports",
    title: "Saved Reports",
    desc: "Review and print your previously saved Kundli matching and consultation reports.",
    href: "/dashboard/reports",
    iconName: "FileText",
    badge: "Archive",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];


