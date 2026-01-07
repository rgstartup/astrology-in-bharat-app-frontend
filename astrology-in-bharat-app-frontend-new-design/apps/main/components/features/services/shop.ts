// Products Card Data
interface ProductsData {
    id: number;
    title: string;
    image: string;
    price: number;
    description: string;
}

export const products: ProductsData[] = [
    {
        id: 1,
        title: "Original Rudraksha Mala",
        image: "/images/product-1.webp",
        price: 899,
        description: "Authentic energised Rudraksha for peace and prosperity.",
    },
    {
        id: 2,
        title: "Astrology Kundli Report",
        image: "/images/product-2.webp",
        price: 499,
        description: "Detailed horoscope report by our expert astrologers.",
    },
    {
        id: 3,
        title: "Energised Gemstone Ring",
        image: "/images/product-3.jpg",
        price: 1599,
        description: "Certified natural gemstone ring for positive energy.",
    },
    {
        id: 4,
        title: "Vastu Yantra Bracelet",
        image: "/images/product-4.jpg",
        price: 699,
        description: "Bring harmony in your home with sacred Vastu Yantra.",
    },
    {
        id: 5,
        title: "Crystal Healing Bracelet",
        image: "/images/product-5.jpg",
        price: 349,
        description: "Enhance health and wealth with crystal healing energy.",
    },
    {
        id: 6,
        title: "Hanuman Chalisa  Book",
        image: "/images/product-6.jpg",
        price: 149,
        description: "Carry divine blessings always with you.",
    },
    {
        id: 7,
        title: "Astrology Kundli Report",
        image: "/images/product-2.webp",
        price: 499,
        description: "Detailed horoscope report by our expert astrologers.",
    },
    {
        id: 8,
        title: "Energised Gemstone Ring",
        image: "/images/product-3.jpg",
        price: 1599,
        description: "Certified natural gemstone ring for positive energy.",
    },
];

// Shop By Purpose Data
interface PurposeData {
    id: number;
    title: string;
    image: string;
}

export const purpose: PurposeData[] = [
    {
        id: 1,
        image: "/images/money.webp",
        title: "Money",
    },
    {
        id: 2,
        image: "/images/Love.webp",
        title: "Love",
    },
    {
        id: 3,
        image: "/images/Career.webp",
        title: "Career",
    },
    {
        id: 4,
        image: "/images/evil_eye.webp",
        title: "Evil Eye",
    },
    {
        id: 5,
        image: "/images/Health.webp",
        title: "Health",
    },
    {
        id: 6,
        image: "/images/Gifting.webp",
        title: "Gifting",
    },
];
