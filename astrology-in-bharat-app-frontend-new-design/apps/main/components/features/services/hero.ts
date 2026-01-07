// Hero Section 4 Feature Cards Data
export interface CardData {
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
        image: "/images/icon1.png",
        altText: "Live Chat Support icon",
        title: "Live Chat Support",
        description:
            "Get instant answers from expert astrologers through live chat sessions.",
        link: "#",
    },
    {
        id: 2,
        image: "/images/icon2.png",
        altText: "Speak with Astrologer icon",
        title: "Speak with Astrologer",
        description:
            "Connect via phone call for personal guidance on your life questions.",
        link: "#",
    },
    {
        id: 3,
        image: "/images/icon3.png",
        altText: "Astrology Product Store icon",
        title: "Astrology Product Store",
        description:
            "Shop gemstones, yantras, and spiritual items recommended by experts.",
        link: "#",
    },
    {
        id: 4,
        image: "/images/icon4.png",
        altText: "Book A Pooja icon",
        title: "Book A Pooja",
        description:
            "Book religious ceremonies & rituals performed by experienced priests.",
        link: "#",
    },
];
