// Hero Section 4 Feature Cards Data
interface CardData {
  id: number;
  image: string;
  altText: string;
  title: string;
  description: string;
  link: string;
}
export const featuredCardsHeroSection: CardData[] = [
  {
    id: 1,
    image: "images/icon1.png",
    altText: "Live Chat Support icon",
    title: "Live Chat Support",
    description:
      "Get instant answers from expert astrologers through live chat sessions.",
    link: "#",
  },
  {
    id: 2,
    image: "images/icon2.png",
    altText: "Speak with Astrologer icon",
    title: "Speak with Astrologer",
    description:
      "Connect via phone call for personal guidance on your life questions.",
    link: "#",
  },
  {
    id: 3,
    image: "images/icon3.png",
    altText: "Astrology Product Store icon",
    title: "Astrology Product Store",
    description:
      "Shop gemstones, yantras, and spiritual items recommended by experts.",
    link: "#",
  },
  {
    id: 4,
    image: "images/icon4.png",
    altText: "Book A Pooja icon",
    title: "Book A Pooja",
    description:
      "Book religious ceremonies & rituals performed by experienced priests.",
    link: "#",
  },
];

// List Astrologers Data
interface AstrologerData {
  id: number;
  image: string;
  ratings: number;
  name: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  chat: boolean;
  call: boolean;
  video: string;
  modalId: string;
}
export const ListOfAllAstrologers: AstrologerData[] = [
  {
    id: 1,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal1",
  },
  {
    id: 2,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal2",
  },
  {
    id: 3,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal3",
  },
  {
    id: 4,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal4",
  },
  {
    id: 5,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal5",
  },
  {
    id: 6,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal6",
  },
  {
    id: 7,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal7",
  },
  {
    id: 8,
    image: "images/astro-img1.png",
    ratings: 5,
    name: "Parbhat Sharma",
    expertise: "Vedic | Numerology",
    experience: 21,
    language: "Hindi, English",
    price: 25,
    chat: true,
    call: true,
    video: "https://www.youtube.com/embed/INoPh_oRooU",
    modalId: "exampleModal8",
  },
];

// Zodiac Signs Data
interface ZodiaData {
  id: number;
  image: string;
  title: string;
  date: string;
}
export const ZodiacSignsData: ZodiaData[] = [
  {
    id: 1,
    image: "/images/icon/aries.webp",
    title: "Aries",
    date: "March 21 - April 19",
  },
  {
    id: 2,
    image: "/images/icon/taurus.webp",
    title: "Taurus",
    date: "April 20 - May 20",
  },
  {
    id: 3,
    image: "/images/icon/gemini.webp",
    title: "Gemini",
    date: "May 21 - June 20",
  },
  {
    id: 4,
    image: "/images/icon/cancer.webp",
    title: "Cancer",
    date: "June 21 - July 22",
  },
  {
    id: 5,
    image: "/images/icon/leo.webp",
    title: "Leo",
    date: "July 23 - August 22",
  },
  {
    id: 6,
    image: "/images/icon/virgo.webp",
    title: "Virgo",
    date: "Aug 23 - Sept 22",
  },
  {
    id: 7,
    image: "/images/icon/libra.webp",
    title: "Libra",
    date: "September 23 - October 22",
  },
  {
    id: 8,
    image: "/images/icon/scorpio.webp",
    title: "Scorpio",
    date: "October 23 - November 21",
  },
  {
    id: 9,
    image: "/images/icon/sagittarius.webp",
    title: "Sagittarius",
    date: "November 22 - December 21",
  },
  {
    id: 10,
    image: "/images/icon/capricorn.webp",
    title: "Capricorn",
    date: "December 22 - January 19",
  },
  {
    id: 11,
    image: "/images/icon/aquarius.webp",
    title: "Aquarius",
    date: "January 20 - February 18",
  },
  {
    id: 12,
    image: "/images/icon/pisces.webp",
    title: "Pisces",
    date: "February 19 - March 20",
  },
];

// Astrology Services Data
interface ServiceData {
  id: number;
  image: string;
  title: string;
  description: string;
}
export const AstrologyServicesData: ServiceData[] = [
  {
    id: 1,
    image: "images/ser1.jpg",
    title: "Kundli (Birth Chart)",
    description:
      "Unlock the secrets of your destiny with a personalized birth chart.",
  },
  {
    id: 2,
    image: "images/ser2.jpg",
    title: "Panchang",
    description:
      "Daily planetary timings and festivals stay aligned with cosmic time.",
  },
  {
    id: 3,
    image: "images/ser3.jpg",
    title: "Numerology",
    description:
      "Discover the power of numbers and what they reveal about your life.",
  },
  {
    id: 4,
    image: "images/ser4.jpg",
    title: "Vedic Astrology",
    description:
      "Ancient Vedic wisdom to guide your present and shape your future.",
  },
  {
    id: 5,
    image: "images/ser5.jpg",
    title: "Matchmaking",
    description:
      "Check marriage compatibility based on traditional astrological methods.",
  },
  {
    id: 6,
    image: "images/ser6.jpg",
    title: "Relationship Guidance",
    description:
      "Strengthen bonds and resolve love challenges through astrology.",
  },
  {
    id: 7,
    image: "images/ser7.jpg",
    title: "Muhurat (Auspicious Timing)",
    description:
      "Choose the perfect time for important events with expert muhurat analysis.",
  },
  {
    id: 8,
    image: "images/ser8.jpg",
    title: "Nakshatra",
    description:
      "Know your nakshatra traits and their influence on your personality.",
  },
  {
    id: 9,
    image: "images/ser9.jpg",
    title: "Career Astrology",
    description: "Make smarter career moves with insights based on your stars.",
  },
  {
    id: 10,
    image: "images/ser10.jpg",
    title: "Finance Astrology",
    description:
      "Predict financial highs and lows — align actions with planetary cycles.",
  },
  {
    id: 11,
    image: "images/ser11.jpg",
    title: "Family Astrology",
    description:
      "Ensure harmony at home by understanding family dynamics astrologically.",
  },
  {
    id: 12,
    image: "images/ser12.jpg",
    title: "Health Astrology",
    description:
      "Identify potential health concerns through your planetary chart.",
  },
  {
    id: 13,
    image: "images/ser13.jpg",
    title: "Zodiac Signs",
    description:
      "Explore personality traits, strengths, and challenges of each sign.",
  },
  {
    id: 14,
    image: "images/ser14.jpg",
    title: "Tarot Reading",
    description:
      "Get intuitive guidance and answers through powerful tarot insights.",
  },
  {
    id: 15,
    image: "images/ser15.jpg",
    title: "Online Pooja",
    description:
      "Book Vedic rituals online for prosperity, peace, and protection.",
  },
  {
    id: 16,
    image: "images/ser16.jpg",
    title: "Palmistry",
    description: "Read your destiny through the lines and mounts of your hand.",
  },
];

// Products Data
interface ProductsData {
  id: number;
  title: string;
  image: string;
  price: string;
  description: string;
}

export const products: ProductsData[] = [
  {
    id: 1,
    title: "Horoscope Reading",
    image: "/images/ser1.jpg",
    price: "₹499",
    description: "Detailed insights into your future and life path.",
  },
  {
    id: 2,
    title: "Kundli Matching",
    image: "/images/ser2.jpg",
    price: "₹799",
    description: "Comprehensive compatibility analysis for marriage.",
  },
  {
    id: 3,
    title: "Gemstone ",
    image: "/images/ser3.jpg",
    price: "₹1,299",
    description: "Find the perfect gemstone to enhance your luck and energy.",
  },
  {
    id: 4,
    title: "Vastu Consultation",
    image: "/images/ser4.jpg",
    price: "₹1,999",
    description: "Harmonize your living space for prosperity and peace.",
  },
  {
    id: 5,
    title: "Palm Reading",
    image: "/images/ser5.jpg",
    price: "₹399",
    description: "Discover your destiny through the lines of your palm.",
  },
];

//  Clients Testimoinial Data
interface TestimoinialData {
  id: number;
  name: string;
  review: string;
  image: string;
  rating: number;
}
export const ClientsTestimoinialData: TestimoinialData[] = [
  {
    id: 1,
    name: "Rahul Verma",
    review:
      "Amazing experience! The astrologer was very accurate and gave me practical solutions. Highly recommended.",
    image: "images/client1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    review:
      "Very satisfied! The consultation was insightful and helped me make better decisions in my career.",
    image: "images/client2.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Ankit Singh",
    review:
      "Great guidance and very polite. The remedies suggested worked really well for me.",
    image: "images/client3.jpg",
    rating: 4.5,
  },
];
