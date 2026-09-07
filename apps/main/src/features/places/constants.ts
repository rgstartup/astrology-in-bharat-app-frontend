// ─── Constants ────────────────────────────────────────────────────────────────

export const TEMPLE_CATEGORIES = [
  { label: "Shiva Temples",    icon: "fa-om",                query: "Famous Shiva Temples in India" },
  { label: "Vishnu Temples",   icon: "fa-hands-praying",     query: "Famous Vishnu Temples in India" },
  { label: "Shakti Peethas",   icon: "fa-fire-flame-curved", query: "Famous Shakti Peetha temples in India" },
  { label: "Jyotirlingas",     icon: "fa-star-and-crescent", query: "12 Jyotirlinga temples in India" },
  { label: "Famous Temples",   icon: "fa-place-of-worship",  query: "Most famous temples in India" },
  { label: "Near Me",          icon: "fa-location-dot",      query: "Famous temples near me India" },
] as const;

export const WHY_VISIT_ITEMS = [
  {
    icon: "fa-spa",
    title: "Spiritual Peace",
    desc: "Connect with divine energy and inner peace.",
  },
  {
    icon: "fa-sun",
    title: "Positive Energy",
    desc: "Remove negativity and attract positivity.",
  },
  {
    icon: "fa-star",
    title: "Astrology Benefits",
    desc: "Visit temples recommended for your zodiac and planets.",
  },
  {
    icon: "fa-landmark",
    title: "Cultural Heritage",
    desc: "Explore India's rich spiritual and cultural legacy.",
  },
] as const;

export const HERO_BADGES = [
  { icon: "fa-spa",             label: "Spiritual Guidance" },
  { icon: "fa-circle-check",    label: "Verified Information" },
  { icon: "fa-star",            label: "Astrology Benefits" },
  { icon: "fa-shield-halved",   label: "Trusted Platform" },
] as const;

export const DEFAULT_QUERIES = {
  temples:     { q: "Best Temples in Mohali and Chandigarh", location: "Mohali, Punjab, India" },
  pilgrimages: { q: "Famous Holy Pilgrimage sites in India",  location: "India" },
} as const;
