export interface ServiceData {
    id: number;
    image: string;
    title: string;
    description: string;
    price?: number;
    longDescription?: string;
    slug: string;
    benefits?: string[];
    process?: string[];
    faq?: { question: string; answer: string }[];
}

export const AstrologyServicesData: ServiceData[] = [
    {
        id: 1,
        image: "/images/ser1.jpg",
        title: "Kundli (Birth Chart)",
        description:
            "Unlock the secrets of your destiny with a personalized birth chart.",
        price: 499,
        longDescription:
            "A Janam Kundli or Birth Chart is a map of the universe at the time of your birth. It reveals your strengths, weaknesses, and potential in life. Our expert astrologers analyze your Kundli to provide detailed predictions about your career, marriage, health, and finance. Get remedies for any doshas present in your chart and pave the way for a successful life.",
        slug: "kundli-birth-chart",
        benefits: [
            "In-depth analysis of your personality and character traits.",
            "Predictions about career, relationships, health, and finance.",
            "Identification of doshas (like Mangal Dosha) and effective remedies.",
            "Guidance for making informed life decisions.",
            "Understanding your strengths and weaknesses."
        ],
        process: [
            "Provide your birth date, time, and place.",
            "Our expert astrologers generate your precise birth chart.",
            "Detailed analysis of planetary positions and houses.",
            "Preparation of a comprehensive report with predictions.",
            "Consultation session (if applicable) to discuss findings."
        ],
        faq: [
            {
                question: "What details do I need to provide?",
                answer: "You need to provide your exact date of birth, time of birth, and place of birth."
            },
            {
                question: "How accurate are the predictions?",
                answer: "Our predictions are based on precise mathematical calculations of planetary positions and ancient Vedic principles, ensuring high accuracy."
            },
            {
                question: "Can I ask specific questions?",
                answer: "Yes, you can ask specific questions related to any aspect of your life during the consultation or while booking the report."
            }
        ]
    },
    {
        id: 2,
        image: "/images/ser2.jpg",
        title: "Panchang",
        description:
            "Daily planetary timings and festivals stay aligned with cosmic time.",
        price: 199,
        longDescription:
            "Panchang is the Hindu astrological almanac that follows traditional Indian cosmology. It helps you identify auspicious timings (Muhurats) for starting new ventures, marriages, or other important activities. Stay aligned with cosmic rhythms by consulting our daily Panchang services.",
        slug: "panchang",
    },
    {
        id: 3,
        image: "/images/ser3.jpg",
        title: "Numerology",
        description:
            "Discover the power of numbers and what they reveal about your life.",
        price: 599,
        longDescription:
            "Numerology is the study of numbers and their mystical connection to your life events. Uncover your Life Path Number, Destiny Number, and Soul Urge Number to understand your true self. Our numerology reports guide you in making better life choices and harmonizing your vibrations with the universe.",
        slug: "numerology",
    },
    {
        id: 4,
        image: "/images/ser4.jpg",
        title: "Vedic Astrology",
        description:
            "Ancient Vedic wisdom to guide your present and shape your future.",
        price: 999,
        longDescription:
            "Vedic Astrology, or Jyotish, is an ancient Indian science that interprets planetary motions and their effects on human life. Our Vedic astrology consultations provide deep insights into your karma, dharma, and future possibilities. Receive authentic guidance rooted in ancient wisdom.",
        slug: "vedic-astrology",
    },
    {
        id: 5,
        image: "/images/ser5.jpg",
        title: "Matchmaking",
        description:
            "Check marriage compatibility based on traditional astrological methods.",
        price: 799,
        longDescription:
            "Marriage is a sacred bond, and compatibility is key to a happy union. Our matchmaking service (Kundli Milan) analyzes the Gunas (traits) of the bride and groom to ensure a harmonious relationship. We look into Mangal Dosha and other factors to provide a comprehensive compatibility report.",
        slug: "matchmaking",
    },
    {
        id: 6,
        image: "/images/ser6.jpg",
        title: "Relationship Guidance",
        description:
            "Strengthen bonds and resolve love challenges through astrology.",
        price: 699,
        longDescription:
            "Relationships can be complex. Whether you are facing misunderstandings, breakups, or lack of harmony, our relationship guidance service can help. By analyzing planetary positions affecting your 7th house and Venus, we offer remedies to strengthen your love life and emotional bonds.",
        slug: "relationship-guidance",
    },
    {
        id: 7,
        image: "/images/ser7.jpg",
        title: "Muhurat (Auspicious Timing)",
        description:
            "Choose the perfect time for important events with expert muhurat analysis.",
        price: 299,
        longDescription:
            "Every moment has a unique energy. Muhurat is the selection of the most auspicious time to perform an activity. Whether it's a wedding, housewarming, or business launch, starting at the right Muhurat ensures success and removes obstacles.",
        slug: "muhurat-auspicious-timing",
    },
    {
        id: 8,
        image: "/images/ser8.jpg",
        title: "Nakshatra",
        description:
            "Know your nakshatra traits and their influence on your personality.",
        price: 399,
        longDescription:
            "Nakshatras (Lunar Mansions) play a crucial role in Vedic astrology. Your birth Nakshatra defines your core nature, behavior, and destiny. Discover your Nakshatra and its Padas to gain a deeper understanding of your psychological and emotional makeup.",
        slug: "nakshatra",
    },
    {
        id: 9,
        image: "/images/ser9.jpg",
        title: "Career Astrology",
        description: "Make smarter career moves with insights based on your stars.",
        price: 899,
        longDescription:
            "Confused about your career path? Our career astrology service analyzes your 10th house and planetary periods to suggest the most suitable professions for you. Get guidance on job changes, promotions, and business ventures to achieve professional success.",
        slug: "career-astrology",
    },
    {
        id: 10,
        image: "/images/ser10.jpg",
        title: "Finance Astrology",
        description:
            "Predict financial highs and lows — align actions with planetary cycles.",
        price: 899,
        longDescription:
            "Financial stability is essential for a stress-free life. Our finance astrology service examines your 2nd and 11th houses to predict wealth accumulation, investment opportunities, and financial risks. Plan your finances better with astrological insights.",
        slug: "finance-astrology",
    },
    {
        id: 11,
        image: "/images/ser11.jpg",
        title: "Family Astrology",
        description:
            "Ensure harmony at home by understanding family dynamics astrologically.",
        price: 699,
        longDescription:
            "Family disputes can disturb mental peace. Our family astrology service helps you understand the astrological reasons behind family conflicts. Get effective remedies to resolve issues between parents, children, or siblings and restore harmony in your home.",
        slug: "family-astrology",
    },
    {
        id: 12,
        image: "/images/ser12.jpg",
        title: "Health Astrology",
        description:
            "Identify potential health concerns through your planetary chart.",
        price: 599,
        longDescription:
            "Health is wealth. Vedic astrology can predict potential health issues by analyzing the 6th, 8th, and 12th houses. Our health astrology report warns you about vulnerable periods and suggests gem therapy or mantras to maintain good physical and mental well-being.",
        slug: "health-astrology",
    },
    {
        id: 13,
        image: "/images/ser13.jpg",
        title: "Zodiac Signs",
        description:
            "Explore personality traits, strengths, and challenges of each sign.",
        price: 199,
        longDescription:
            "Dive deep into the 12 Zodiac signs. Whether you are an Aries or a Pisces, understanding your Sun Sign, Moon Sign, and Ascendant helps you know your strengths and challenges. Get a detailed profile of your zodiac personality.",
        slug: "zodiac-signs",
    },
    {
        id: 14,
        image: "/images/ser14.jpg",
        title: "Tarot Reading",
        description:
            "Get intuitive guidance and answers through powerful tarot insights.",
        price: 499,
        longDescription:
            "Tarot reading is a divine tool for receiving guidance from the universe. Our expert tarot readers interpret the cards to answer your specific questions about love, career, or life decisions. gain clarity and direction through the mystic art of Tarot.",
        slug: "tarot-reading",
    },
    {
        id: 15,
        image: "/images/ser15.jpg",
        title: "Online Pooja",
        description:
            "Book Vedic rituals online for prosperity, peace, and protection.",
        price: 1499,
        longDescription:
            "Perform Vedic Poojas from the comfort of your home. Whether it's a Satyanarayan Pooja, Rudrabhishek, or Grah Shanti, our experienced priests conduct the rituals with full devotion. Receive the divine blessings and Prasad at your doorstep.",
        slug: "online-pooja",
    },
    {
        id: 16,
        image: "/images/ser16.jpg",
        title: "Palmistry",
        description: "Read your destiny through the lines and mounts of your hand.",
        price: 599,
        longDescription:
            "Your destiny is in your hands—literally. Palmistry or Chiromancy analyzes the lines, mounts, and shapes of your hand to predict your future. Get insights into your life line, heart line, and head line to understand your life's trajectory.",
        slug: "palmistry",
    },
];

export interface ConsultationData {
    id: number;
    image: string;
    title: string;
    price?: number;
    longDescription?: string;
    slug: string;
    description?: string;
    benefits?: string[];
    process?: string[];
    faq?: { question: string; answer: string }[];
}

export const ConsultationServicesData: ConsultationData[] = [
    {
        id: 1,
        image: "images/services/services1.jpg",
        title: "Love Problem Solution",
        price: 599,
        longDescription:
            "Facing issues in your love life? Our expert astrologers provide effective remedies to solve love problems, bring back lost love, and ensure a happy relationship.",
        slug: "love-problem-solution",
        description: "Expert remedies to solve love problems and bring back lost love.",
        benefits: [
            "Resolve misunderstandings and conflicts with your partner.",
            "Attract your desired partner or bring back a lost love.",
            "Strengthen the emotional bond and trust in your relationship.",
            "Overcome 3rd party interference or family objections.",
            "Ensure a long-lasting and harmonious relationship."
        ],
        process: [
            "Share your specific love problem and relationship details.",
            "Our astrologer analyzes both birth charts (if available) or uses Prasna Kundli.",
            "Identification of planetary influences affecting your love life.",
            "Recommendation of powerful remedies, mantras, or gemstones.",
            "Follow-up guidance to ensure positive results."
        ],
        faq: [
            {
                question: "Is my privacy guaranteed?",
                answer: "Yes, 100%. We maintain strict confidentiality regarding your personal details and the problems you share with us."
            },
            {
                question: "How long does it take to see results?",
                answer: "Results can vary based on individual karma and the complexity of the issue, but many clients start seeing positive changes within a few weeks of performing the remedies."
            },
            {
                question: "Do I need my partner's birth details?",
                answer: "It is helpful but not mandatory. If you don't have their details, we can use your chart and other astrological methods to provide a solution."
            }
        ]
    },
    {
        id: 2,
        image: "images/services/services2.jpg",
        title: "Marriage Problem",
        price: 699,
        longDescription:
            "Marriage is a beautiful journey, but hurdles can arise. Get solutions for reliable marriage predictions, compatibility issues, and delay in marriage.",
        slug: "marriage-problem",
        description: "Solutions for marriage predictions, compatibility, and delays.",
    },
    {
        id: 3,
        image: "images/services/services3.jpg",
        title: "Divorce Problem Solution",
        price: 999,
        longDescription:
            "If you are facing divorce or separation issues, our astrology services can help you find clarity and potentially save your marriage with powerful remedies.",
        slug: "divorce-problem-solution",
        description: "FIND clarity and remedies to potentially save your marriage.",
    },
    {
        id: 4,
        image: "images/services/services4.jpg",
        title: "Breakup Problem Solution",
        price: 499,
        longDescription:
            "Healing from a breakup is hard. Get guidance on how to move on or reunite with your partner using astrological insights.",
        slug: "breakup-problem-solution",
        description: "Guidance to move on or reunite with your partner.",
    },
    {
        id: 5,
        image: "images/services/services5.jpg",
        title: "Get Your Ex Love Back",
        price: 799,
        longDescription:
            "Still miss your ex? Our specialized Vashikaran and astrological remedies can help you attract your lost love back into your life.",
        slug: "get-your-ex-love-back",
        description: "Attract your lost love back with specialized remedies.",
    },
    {
        id: 6,
        image: "images/services/services6.jpg",
        title: "Family Problem Solution",
        price: 599,
        longDescription:
            "Family disputes can drain your energy. Find peace and harmony in your family life with our expert astrological consultation.",
        slug: "family-problem-solution",
        description: "Find peace and harmony in your family life.",
    },
    {
        id: 7,
        image: "images/services/services8.jpg",
        title: "Dispute Solution",
        price: 699,
        longDescription:
            "Legal or personal disputes can be stressful. Get astrological advice to resolve conflicts and win over your adversaries.",
        slug: "dispute-solution",
        description: "Astrological advice to resolve conflicts and disputes.",
    },
    {
        id: 8,
        image: "images/services/services9.jpg",
        title: "Childless Couple Solution",
        price: 899,
        longDescription:
            "Struggling to conceive? Our santan gopal mantras and astrological remedies can help childless couples fulfill their dream of parenthood.",
        slug: "childless-couple-solution",
        description: "Mantras and remedies for childless couples to fulfill parenthood dreams.",
    },
];


