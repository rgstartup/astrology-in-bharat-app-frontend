import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "hi";

interface LanguageState {
    lang: Language;
    setLang: (lang: Language) => void;
    toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            lang: "en",
            setLang: (lang: Language) => set({ lang }),
            toggleLang: () => set((state) => ({ lang: state.lang === "en" ? "hi" : "en" })),
        }),
        {
            name: "astrology-language-storage",
        }
    )
);

export const horoscopeTranslations = {
    en: {
        badge: "✨ Daily Vedic Predictions",
        heroTitle1: "Unlock Your",
        heroHighlight: "Destiny",
        heroTitle2: "Through Stars",
        heroDesc:
            "Navigate your life's journey with precision. Our daily horoscopes are crafted using ancient Vedic wisdom to guide you through love, career, and personal growth.",
        features: ["Daily Forecast", "Love Insights", "Career Growth", "Health Tips"],
        heroBtn: "Get Your Horoscope",
        zodiacSectionTitle1: "Choose Your",
        zodiacSectionHighlight: "Zodiac",
        zodiacSectionTitle2: "Sign",
        zodiacSectionDesc:
            "Unlock the secrets of your future by exploring your unique zodiac personality and daily cosmic guidance.",
        dailyLabel: "Daily",
        forecastLabel: "Forecast",
        highlyAccurate: "Highly Accurate",
        cosmicInsight: "Cosmic Insight",
        cosmicText:
            "Patience will be your greatest ally today. The Moon is in a complex position, so avoid making hasty decisions in property or legal matters. Wear the color white for mental peace and meditate for 10 minutes to align your energies.",
        colorWhite: "white",
        predictions: [
            {
                label: "Love & Relations",
                text: "Venus aligns beautifully today, bringing warmth to your relationships. Deep conversations with loved ones will strengthen bonds. Single? A chance encounter may spark something special.",
            },
            {
                label: "Career & Finance",
                text: "Mercury's position favors professional growth. An opportunity for advancement may present itself. Stay confident in negotiations and trust your instincts with financial decisions.",
            },
            {
                label: "Health & Wellbeing",
                text: "Your energy levels are high today. This is an excellent time for physical activities or starting a new wellness routine. Stay hydrated and maintain balance in all things.",
            },
            {
                label: "Travel & Luck",
                text: "Jupiter brings fortunate opportunities, especially in travel or learning. Short trips will be rewarding. Lady Luck is on your side – consider trying something new today!",
            },
        ],
        tabs: {
            daily: "Daily Horoscope",
            weekly: "Weekly Horoscope",
            monthly: "Monthly Horoscope",
            yearly: "Yearly Horoscope",
        },
        bottomCta: {
            title: "Want a more accurate prediction?",
            subtitle: "Get a personalized horoscope based on your birth details.",
            btn: "Generate My Horoscope \u2192",
            templeTitle: "Want to know which temple is best for you?",
            templeSubtitle: "Talk to our Astrology Experts and get personalized temple recommendations.",
            templeBtn: "Talk to Expert",
        },
        zodiacGrid: {
            selectSign: "Select Your Zodiac Sign",
            clickSign: "Click on your sign to view your",
            viewHoroscope: "View Horoscope",
            defaultPreview: "Discover what the stars have in store for you today.",
            previewPrefix: "Select your sign to get detailed insights for your",
        },
        sidebar: {
            overview: "Today's Overview",
            date: "Date",
            tithi: "Tithi",
            nakshatra: "Nakshatra",
            sunrise: "Sunrise",
            sunset: "Sunset",
            planetaryPosition: "Planetary Position",
            personalizedTitle: "Get Personalized Horoscope",
            personalizedSubtitle: "Get detailed predictions based on your birth chart from our expert astrologers.",
            talkToExpert: "Talk to Expert",
        },
        planets: {
            Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury",
            Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn",
            Rahu: "Rahu", Ketu: "Ketu",
        },
        zodiacNames: {
            "Aries": "Aries", "Taurus": "Taurus", "Gemini": "Gemini", "Cancer": "Cancer",
            "Leo": "Leo", "Virgo": "Virgo", "Libra": "Libra", "Scorpio": "Scorpio",
            "Sagittarius": "Sagittarius", "Capricorn": "Capricorn", "Aquarius": "Aquarius", "Pisces": "Pisces",
        },
        months: {
            "Jan": "Jan", "Feb": "Feb", "Mar": "Mar", "Apr": "Apr", "May": "May", "Jun": "Jun",
            "Jul": "Jul", "Aug": "Aug", "Sep": "Sep", "Oct": "Oct", "Nov": "Nov", "Dec": "Dec",
        },
        switchLang: "हिंदी",
        switchLangLabel: "Switch to Hindi",
    },
    hi: {
        badge: "✨ दैनिक वैदिक भविष्यवाणी",
        heroTitle1: "जानिए अपनी",
        heroHighlight: "नियति",
        heroTitle2: "सितारों से",
        heroDesc:
            "सटीकता के साथ अपने जीवन की यात्रा को नेविगेट करें। हमारी दैनिक राशिफल प्राचीन वैदिक ज्ञान का उपयोग करके आपको प्रेम, करियर और व्यक्तिगत विकास में मार्गदर्शन देती है।",
        features: ["दैनिक भविष्यफल", "प्रेम अंतर्दृष्टि", "करियर विकास", "स्वास्थ्य सुझाव"],
        heroBtn: "अपनी राशिफल देखें",
        zodiacSectionTitle1: "अपनी",
        zodiacSectionHighlight: "राशि",
        zodiacSectionTitle2: "चुनें",
        zodiacSectionDesc:
            "अपनी विशिष्ट राशि व्यक्तित्व और दैनिक ब्रह्मांडीय मार्गदर्शन का अन्वेषण करके अपने भविष्य के रहस्यों को उजागर करें।",
        dailyLabel: "दैनिक",
        forecastLabel: "भविष्यफल",
        highlyAccurate: "अत्यंत सटीक",
        cosmicInsight: "ब्रह्मांडीय अंतर्दृष्टि",
        cosmicText:
            "आज धैर्य आपका सबसे बड़ा साथी होगा। चंद्रमा एक जटिल स्थिति में है, इसलिए संपत्ति या कानूनी मामलों में जल्दबाजी में निर्णय लेने से बचें। मानसिक शांति के लिए सफेद रंग पहनें और अपनी ऊर्जाओं को संरेखित करने के लिए 10 मिनट ध्यान करें।",
        colorWhite: "सफेद",
        predictions: [
            {
                label: "प्रेम और रिश्ते",
                text: "शुक्र आज सुंदर ढंग से संरेखित है, जो आपके रिश्तों में गर्माहट लाता है। प्रियजनों के साथ गहरी बातचीत संबंधों को मजबूत करेगी। अकेले हैं? एक आकस्मिक मुलाकात कुछ विशेष शुरू कर सकती है।",
            },
            {
                label: "करियर और वित्त",
                text: "बुध की स्थिति पेशेवर विकास का समर्थन करती है। पदोन्नति का अवसर सामने आ सकता है। बातचीत में आत्मविश्वास रखें और वित्तीय निर्णयों में अपनी प्रवृत्ति पर भरोसा करें।",
            },
            {
                label: "स्वास्थ्य और कल्याण",
                text: "आज आपका ऊर्जा स्तर उच्च है। शारीरिक गतिविधियों या नए स्वास्थ्य नियम शुरू करने का यह उत्तम समय है। हाइड्रेटेड रहें और हर चीज़ में संतुलन बनाए रखें।",
            },
            {
                label: "यात्रा और भाग्य",
                text: "बृहस्पति विशेष रूप से यात्रा या सीखने में भाग्यशाली अवसर लाता है। छोटी यात्राएं पुरस्कृत होंगी। भाग्य आपके साथ है – आज कुछ नया आज़माने पर विचार करें!",
            },
        ],
        tabs: {
            daily: "दैनिक राशिफल",
            weekly: "साप्ताहिक राशिफल",
            monthly: "मासिक राशिफल",
            yearly: "वार्षिक राशिफल",
        },
        bottomCta: {
            title: "क्या आप अधिक सटीक भविष्यवाणी चाहते हैं?",
            subtitle: "अपने जन्म विवरण के आधार पर व्यक्तिगत राशिफल प्राप्त करें।",
            btn: "मेरी राशिफल बनाएँ \u2192",
            templeTitle: "जानना चाहते हैं कि आपके लिए कौन सा मंदिर सबसे अच्छा है?",
            templeSubtitle: "हमारे ज्योतिष विशेषज्ञों से बात करें और व्यक्तिगत मंदिर सिफारिशें प्राप्त करें।",
            templeBtn: "विशेषज्ञ से बात करें",
        },
        zodiacGrid: {
            selectSign: "अपनी राशि चुनें",
            clickSign: "देखने के लिए अपनी राशि पर क्लिक करें",
            viewHoroscope: "राशिफल देखें",
            defaultPreview: "जानें कि आज सितारे आपके लिए क्या लेकर आए हैं।",
            previewPrefix: "विस्तृत जानकारी के लिए अपनी राशि चुनें",
        },
        sidebar: {
            overview: "आज का अवलोकन",
            date: "दिनांक",
            tithi: "तिथि",
            nakshatra: "नक्षत्र",
            sunrise: "सूर्योदय",
            sunset: "सूर्यास्त",
            planetaryPosition: "ग्रहीय स्थिति",
            personalizedTitle: "व्यक्तिगत राशिफल प्राप्त करें",
            personalizedSubtitle: "हमारे विशेषज्ञ ज्योतिषियों से अपनी जन्म कुंडली के आधार पर विस्तृत भविष्यवाणियां प्राप्त करें।",
            talkToExpert: "विशेषज्ञ से बात करें",
        },
        planets: {
            Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
            Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
            Rahu: "राहु", Ketu: "केतु",
        },
        zodiacNames: {
            "Aries": "मेष", "Taurus": "वृषभ", "Gemini": "मिथुन", "Cancer": "कर्क",
            "Leo": "सिंह", "Virgo": "कन्या", "Libra": "तुला", "Scorpio": "वृश्चिक",
            "Sagittarius": "धनु", "Capricorn": "मकर", "Aquarius": "कुंभ", "Pisces": "मीन",
        },
        months: {
            "Jan": "जनवरी", "Feb": "फरवरी", "Mar": "मार्च", "Apr": "अप्रैल", "May": "मई", "Jun": "जून",
            "Jul": "जुलाई", "Aug": "अगस्त", "Sep": "सितंबर", "Oct": "अक्टूबर", "Nov": "नवंबर", "Dec": "दिसंबर",
        },
        switchLang: "English",
        switchLangLabel: "Switch to English",
    },
} as const;

export const footerTranslations = {
    en: {
        aboutText: "Astrology in Bharat is India's trusted astrology platform offering accurate guidance through verified experts using authentic Indian astrology systems.",
        freeCalculator: "Free Calculator",
        astrologyServices: "Astrology Services",
        importantLinks: "Important Links",
        helpfulInfo: "Helpful Info",
        marriageAge: "Marriage Age",
        dahejCalculator: "Dahej Calculator",
        loveCompatibility: "Love Compatibility",
        luckyNumber: "Lucky Number",
        lifePath: "Life Path",
        nakshatraFinder: "Nakshatra Finder",
        onlinePuja: "Online Puja",
        talkToExpert: "Talk to Expert",
        videoConsultation: "Video Consultation",
        kundliMatching: "Kundli Matching",
        kundliPrediction: "Kundli Prediction",
        numerologyReport: "Numerology Report",
        dailyHoroscope: "Daily Horoscope",
        expertLogin: "Expert Login",
        expertRegistration: "Expert Registration",
        userRegistration: "User Registration",
        merchantLogin: "Merchant Login",
        merchantRegistration: "Merchant Registration",
        shubhMuhurat: "Hindu Calendar",
        shopProducts: "Shop Our Products",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        refundPolicy: "Refund Policy",
        privacyPolicy: "Privacy Policy",
        termsConditions: "Terms & Conditions",
        copyrightNotice: "Copyright Notice",
        helpSupport: "Help & Support",
        sessionHistory: "Session",
        copyright: "© 2026 Astrology in Bharat (Powered by Astrology in Bharat Services). All Rights Reserved.",
    },
    hi: {
        aboutText: "एस्ट्रोलॉजी इन भारत भारत का विश्वसनीय ज्योतिष मंच है जो प्रामाणिक भारतीय ज्योतिष प्रणालियों का उपयोग करके सत्यापित ज्योतिषियों के माध्यम से सटीक मार्गदर्शन प्रदान करता है।",
        freeCalculator: "मुफ्त कैलकुलेटर",
        astrologyServices: "ज्योतिष सेवाएं",
        importantLinks: "महत्वपूर्ण लिंक",
        helpfulInfo: "सहायक जानकारी",
        marriageAge: "विवाह आयु",
        dahejCalculator: "दहेज कैलकुलेटर",
        loveCompatibility: "प्रेम अनुकूलता",
        luckyNumber: "भाग्यशाली अंक",
        lifePath: "जीवन पथ",
        nakshatraFinder: "नक्षत्र खोजक",
        onlinePuja: "ऑनलाइन पूजा",
        talkToExpert: "ज्योतिषी से बात करें",
        videoConsultation: "वीडियो परामर्श",
        kundliMatching: "कुंडली मिलान",
        kundliPrediction: "कुंडली भविष्यवाणी",
        numerologyReport: "अंकशास्त्र रिपोर्ट",
        dailyHoroscope: "दैनिक राशिफल",
        expertLogin: "ज्योतिषी लॉगिन",
        expertRegistration: "ज्योतिषी पंजीकरण",
        userRegistration: "उपयोगकर्ता पंजीकरण",
        merchantLogin: "व्यापारी लॉगिन",
        merchantRegistration: "व्यापारी पंजीकरण",
        shubhMuhurat: "हिन्दू पंचांग",
        shopProducts: "हमारे उत्पाद खरीदें",
        aboutUs: "हमारे बारे में",
        contactUs: "संपर्क करें",
        refundPolicy: "धनवापसी नीति",
        privacyPolicy: "गोपनीयता नीति",
        termsConditions: "नियम और शर्तें",
        copyrightNotice: "कॉपीराइट नोटिस",
        helpSupport: "सहायता और समर्थन",
        sessionHistory: "सत्र",
        copyright: "© 2026 एस्ट्रोलॉजी इन भारत (एस्ट्रोलॉजी इन भारत सर्विसेज द्वारा संचालित)। सर्वाधिकार सुरक्षित।",
    },
} as const;

export type HeaderTranslations = {
    welcomeText: string;
    notifications: string;
    clearAll: string;
    noNotificationsYet: string;
    noNotificationsDesc: string;
    viewAll: string;
    justNow: string;
    myProfile: string;
    myWallet: string;
    logout: string;
    signIn: string;
    register: string;
    navHome: string;
    navDailyHoroscope: string;
    navAstrologyConsult: string;
    navFamousPlaces: string;
    navLiveDarshan: string;
    dropHoroscope: string;
    dropLoveCalc: string;
    dropDahejCalc: string;
    dropFlamesCalc: string;
    dropLoveCompat: string;
    dropMarriageAge: string;
    dropSoulmateInitials: string;
    dropLuckyNumber: string;
    dropLifePath: string;
    dropNameNumerology: string;
    dropZodiacCompat: string;
    dropNakshatra: string;
    dropLoyalPartner: string;
    dropBreakup: string;
    dropOnlinePuja: string;
    askExpert: string;
    serviceMatchmaking: string;
    serviceGunaMilan: string;
    serviceOnlinePuja: string;
    serviceLoveMatch: string;
    serviceMatchAnalysis: string;
    serviceLiveDarshan: string;
};

export const headerTranslations: Record<Language, HeaderTranslations> = {
    en: {
        welcomeText: "Connect with Verified Astrology Experts for Online Predictions.",
        notifications: "Notifications",
        clearAll: "Clear All",
        noNotificationsYet: "No Notifications Yet",
        noNotificationsDesc:
            "You'll see alerts about your orders and consultations here.",
        viewAll: "View All",
        justNow: "Just now",
        myProfile: "My Profile",
        myWallet: "My Wallet",
        logout: "Logout Session",
        signIn: "Sign In",
        register: "Register",
        navHome: "Home",
        navDailyHoroscope: "Daily Horoscope",
        navAstrologyConsult: "Calculators",
        navFamousPlaces: "Famous Temple",
        navLiveDarshan: "Live Darshan",
        dropHoroscope: "Horoscope",
        dropLoveCalc: "Love Calculator",
        dropDahejCalc: "Dahej Calculator",
        dropFlamesCalc: "Flames Calculator",
        dropLoveCompat: "Love Compatibility Calculator",
        dropMarriageAge: "Marriage Age Calculator",
        dropSoulmateInitials: "Soulmate Name Initials Calculator",
        dropLuckyNumber: "Lucky Number & Colour Calculator",
        dropLifePath: "Life Path Calculator",
        dropNameNumerology: "Name Numerology Calculator",
        dropZodiacCompat: "Zodiac Sign Compatibility Calculator",
        dropNakshatra: "Nakshatra Finder",
        dropLoyalPartner: "Loyal Partner Calculator",
        dropBreakup: "Breakup Patchup Calculator",
        dropOnlinePuja: "Online Puja",
        askExpert: "Ask Expert",
        serviceMatchmaking: "Marriage Calculator",
        serviceGunaMilan: "Guna Milan",
        serviceOnlinePuja: "Online Puja",
        serviceLoveMatch: "Love Match",
        serviceMatchAnalysis: "Kundali Matching",
        serviceLiveDarshan: "Live Darshan",
    },
    hi: {
        welcomeText: "ऑनलाइन भविष्यवाणियों के लिए सत्यापित ज्योतिष विशेषज्ञों से जुड़ें।",
        notifications: "सूचनाएं",
        clearAll: "सभी साफ़ करें",
        noNotificationsYet: "अभी कोई सूचना नहीं",
        noNotificationsDesc: "आपके ऑर्डर और परामर्श से संबंधित अलर्ट यहाँ दिखेंगे।",
        viewAll: "सभी देखें",
        justNow: "अभी",
        myProfile: "मेरी प्रोफ़ाइल",
        myWallet: "मेरा वॉलेट",
        logout: "लॉगआउट करें",
        signIn: "साइन इन",
        register: "रजिस्टर करें",
        navHome: "होम",
        navDailyHoroscope: "दैनिक राशिफल",
        navAstrologyConsult: "ज्योतिष परामर्श",
        navFamousPlaces: "प्रसिद्ध मंदिर",
        navLiveDarshan: "लाइव दर्शन",
        dropHoroscope: "राशिफल",
        dropLoveCalc: "लव कैलकुलेटर",
        dropDahejCalc: "दहेज कैलकुलेटर",
        dropFlamesCalc: "फ्लेम्स कैलकुलेटर",
        dropLoveCompat: "प्रेम अनुकूलता कैलकुलेटर",
        dropMarriageAge: "विवाह आयु कैलकुलेटर",
        dropSoulmateInitials: "सोलमेट नाम कैलकुलेटर",
        dropLuckyNumber: "भाग्यशाली अंक और रंग",
        dropLifePath: "जीवन पथ कैलकुलेटर",
        dropNameNumerology: "नाम अंकशास्त्र",
        dropZodiacCompat: "राशि अनुकूलता कैलकुलेटर",
        dropNakshatra: "नक्षत्र खोजक",
        dropLoyalPartner: "वफादार साथी कैलकुलेटर",
        dropBreakup: "ब्रेकअप पैचअप कैलकुलेटर",
        dropOnlinePuja: "ऑनलाइन पूजा",
        askExpert: "ज्योतिषी से पूछें",
        serviceMatchmaking: "विवाह कैलकुलेटर",
        serviceGunaMilan: "गुण मिलान",
        serviceOnlinePuja: "ऑनलाइन पूजा",
        serviceLoveMatch: "लव मैच",
        serviceMatchAnalysis: "कुंडली मिलान",
        serviceLiveDarshan: "लाइव दर्शन",
    },
} as const;
