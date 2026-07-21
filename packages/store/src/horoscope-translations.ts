export type Language = "en" | "hi";

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
            yearly: "Yearly Horoscope"
        },
        bottomCta: {
            title: "Want a more accurate prediction?",
            subtitle: "Get a personalized horoscope based on your birth details.",
            btn: "Generate My Horoscope \u2192",
            templeTitle: "Want to know which temple is best for you?",
            templeSubtitle: "Talk to our Astrology Experts and get personalized temple recommendations.",
            templeBtn: "Talk to Expert"
        },
        zodiacGrid: {
            selectSign: "Select Your Zodiac Sign",
            clickSign: "Click on your sign to view your",
            viewHoroscope: "View Horoscope",
            defaultPreview: "Discover what the stars have in store for you today.",
            previewPrefix: "Select your sign to get detailed insights for your"
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
            talkToExpert: "Talk to Expert"
        },
        planets: {
            Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", 
            Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", 
            Rahu: "Rahu", Ketu: "Ketu"
        },
        zodiacNames: {
            "Aries": "Aries", "Taurus": "Taurus", "Gemini": "Gemini", "Cancer": "Cancer",
            "Leo": "Leo", "Virgo": "Virgo", "Libra": "Libra", "Scorpio": "Scorpio",
            "Sagittarius": "Sagittarius", "Capricorn": "Capricorn", "Aquarius": "Aquarius", "Pisces": "Pisces"
        },
        months: {
            "Jan": "Jan", "Feb": "Feb", "Mar": "Mar", "Apr": "Apr", "May": "May", "Jun": "Jun",
            "Jul": "Jul", "Aug": "Aug", "Sep": "Sep", "Oct": "Oct", "Nov": "Nov", "Dec": "Dec"
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
            yearly: "वार्षिक राशिफल"
        },
        bottomCta: {
            title: "क्या आप अधिक सटीक भविष्यवाणी चाहते हैं?",
            subtitle: "अपने जन्म विवरण के आधार पर व्यक्तिगत राशिफल प्राप्त करें।",
            btn: "मेरी राशिफल बनाएँ \u2192",
            templeTitle: "जानना चाहते हैं कि आपके लिए कौन सा मंदिर सबसे अच्छा है?",
            templeSubtitle: "हमारे ज्योतिष विशेषज्ञों से बात करें और व्यक्तिगत मंदिर सिफारिशें प्राप्त करें।",
            templeBtn: "विशेषज्ञ से बात करें"
        },
        zodiacGrid: {
            selectSign: "अपनी राशि चुनें",
            clickSign: "देखने के लिए अपनी राशि पर क्लिक करें",
            viewHoroscope: "राशिफल देखें",
            defaultPreview: "जानें कि आज सितारे आपके लिए क्या लेकर आए हैं।",
            previewPrefix: "विस्तृत जानकारी के लिए अपनी राशि चुनें"
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
            talkToExpert: "विशेषज्ञ से बात करें"
        },
        planets: {
            Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", 
            Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", 
            Rahu: "राहु", Ketu: "केतु"
        },
        zodiacNames: {
            "Aries": "मेष", "Taurus": "वृषभ", "Gemini": "मिथुन", "Cancer": "कर्क",
            "Leo": "सिंह", "Virgo": "कन्या", "Libra": "तुला", "Scorpio": "वृश्चिक",
            "Sagittarius": "धनु", "Capricorn": "मकर", "Aquarius": "कुंभ", "Pisces": "मीन"
        },
        months: {
            "Jan": "जनवरी", "Feb": "फरवरी", "Mar": "मार्च", "Apr": "अप्रैल", "May": "मई", "Jun": "जून",
            "Jul": "जुलाई", "Aug": "अगस्त", "Sep": "सितंबर", "Oct": "अक्टूबर", "Nov": "नवंबर", "Dec": "दिसंबर"
        },

        switchLang: "English",
        switchLangLabel: "Switch to English",
    },
} as const;
