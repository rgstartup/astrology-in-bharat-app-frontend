"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPlaceImages, getPlaceBySlug } from "@/libs/serp-api";
import { Place } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useLanguageStore } from "@repo/store";
import { famousPlacesTranslations } from "@/lib/famous-places-translations";
import { Loading } from "@repo/ui";
import GuidanceCTA from "@/components/ui/GuidanceCTA";

const PlaceDetailPage = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t = famousPlacesTranslations[lang as keyof typeof famousPlacesTranslations] || famousPlacesTranslations.en;

  const { slug } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("About Temple");
  
  const [distanceInfo, setDistanceInfo] = useState<{distance: string | null, status: 'idle' | 'requesting' | 'granted' | 'denied' | 'error' | 'no-dest'}>({
    distance: null,
    status: 'idle'
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleGetLocation = () => {
    if (!place) return;
    setDistanceInfo({ distance: null, status: 'requesting' });
    
    // Most Google-based APIs use gps_coordinates or lat/lng
    const destLat = (place as any).gps_coordinates?.latitude || (place as any).latitude;
    const destLon = (place as any).gps_coordinates?.longitude || (place as any).longitude;
    
    const requestUserLocationAndCalculate = (targetLat: number, targetLon: number) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const dist = calculateDistance(position.coords.latitude, position.coords.longitude, targetLat, targetLon);
            setDistanceInfo({ distance: dist.toFixed(1), status: 'granted' });
          },
          (error) => {
            setDistanceInfo({ distance: null, status: 'denied' });
          }
        );
      } else {
        setDistanceInfo({ distance: null, status: 'error' });
      }
    };

    if (destLat && destLon) {
      requestUserLocationAndCalculate(destLat, destLon);
    } else {
      // Fallback: Geocode using openstreetmap
      const searchQueries = [
        encodeURIComponent(place.title),
        encodeURIComponent(place.title.split(',')[0]),
        encodeURIComponent(place.address || "")
      ].filter(Boolean);

      const fetchWithQuery = async (queries: string[]) => {
        for (const q of queries) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'AstrologyBharatApp/1.0' // Required by Nominatim
              }
            });
            const data = await res.json();
            if (data && data.length > 0) {
              return data[0];
            }
          } catch(e) { }
        }
        return null;
      };

      fetchWithQuery(searchQueries).then(data => {
        if (data) {
          requestUserLocationAndCalculate(parseFloat(data.lat), parseFloat(data.lon));
        } else {
          setDistanceInfo({ distance: null, status: 'no-dest' });
        }
      }).catch(() => setDistanceInfo({ distance: null, status: 'error' }));
    }
  };

  const getDynamicHighlights = (title: string = "") => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('gurudwara') || lowerTitle.includes('sahib') || lowerTitle.includes('golden temple')) {
      return ["Langar Seva (Free Food)", "24x7 Kirtan & Prayers", "Sarovar (Holy Pool)", "Community Service", "Open to All Religions"];
    } else if (lowerTitle.includes('hanuman') || lowerTitle.includes('balaji')) {
      return ["Sacred Atmosphere", "Tuesday/Saturday Special Puja", "Divine Energy", "Ancient Idols", "Peaceful Environment"];
    } else if (lowerTitle.includes('shiv') || lowerTitle.includes('mahadev')) {
      return ["Maha Aarti", "Sacred Shivling", "Peaceful Meditation Spots", "Historical Significance", "Bhasma Aarti"];
    } else if (lowerTitle.includes('laxmi') || lowerTitle.includes('narayan') || lowerTitle.includes('krishna')) {
      return ["Stunning Architecture", "Sacred Atmosphere", "Daily Aarti & Puja", "Spiritual Healing", "Festive Celebrations"];
    } else if (lowerTitle.includes('church')) {
      return ["Beautiful Architecture", "Sunday Mass", "Peaceful Environment", "Community Choir", "Historical Significance"];
    } else if (lowerTitle.includes('mosque') || lowerTitle.includes('masjid')) {
      return ["Stunning Architecture", "Daily Prayers", "Peaceful Ambience", "Historical Significance", "Community Gathering"];
    }
    return ["Stunning Architecture", "Peaceful Atmosphere", "Historical Significance", "Open to All", "Highly Rated by Devotees"];
  };

  const getDynamicAstrologyBenefits = (title: string = "") => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('shiv') || lowerTitle.includes('mahadev')) {
       return ["Calms the mind and reduces anxiety", "Strengthens the Moon in your horoscope", "Removes negativity and fears", "Brings inner peace"];
    } else if (lowerTitle.includes('hanuman') || lowerTitle.includes('balaji')) {
       return ["Gives courage and confidence", "Protects from evil eyes (Buri Nazar)", "Strengthens Mars in kundli", "Helps overcome obstacles"];
    } else if (lowerTitle.includes('laxmi') || lowerTitle.includes('narayan') || lowerTitle.includes('krishna')) {
       return ["Brings wealth and prosperity", "Improves Venus and Jupiter alignments", "Harmonizes married life", "Success in career"];
    } else if (lowerTitle.includes('durga') || lowerTitle.includes('mata') || lowerTitle.includes('devi')) {
       return ["Empowers with strength and protection", "Overcomes obstacles in life", "Brings peace and prosperity", "Strengthens willpower"];
    }
    return [
      "Peace of mind and spiritual upliftment",
      "Removal of negative energies",
      "Blessings for prosperity and happiness",
      "Spiritual growth and wisdom"
    ];
  };

  const getDynamicSignificance = (title: string = "") => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('gurudwara') || lowerTitle.includes('sahib') || lowerTitle.includes('golden temple')) {
      return [
        "Represents equality, selfless service, and spiritual harmony.",
        "A must-visit spiritual place for inner peace and divine blessings.",
        "Engages in massive community welfare activities and daily meals for thousands."
      ];
    } else if (lowerTitle.includes('hanuman') || lowerTitle.includes('balaji')) {
      return [
        "Known for fulfilling deep desires and removing life's obstacles.",
        "A powerful center of devotion, courage, and divine energy.",
        "Devotees experience a profound sense of protection and fearlessness."
      ];
    } else if (lowerTitle.includes('shiv') || lowerTitle.includes('mahadev')) {
      return [
        "A highly revered site for meditation and spiritual awakening.",
        "Devotees believe it liberates the soul from the cycle of birth and death.",
        "Celebrates Maha Shivaratri with grand festivities and devotion."
      ];
    } else if (lowerTitle.includes('laxmi') || lowerTitle.includes('narayan') || lowerTitle.includes('krishna')) {
      return [
        "A spiritual haven for wealth, prosperity, and righteous living.",
        "Renowned for beautiful architecture and enchanting bhajans.",
        "Attracts thousands of devotees seeking joy and spiritual growth."
      ];
    }
    return [
      "A sacred destination known for its profound spiritual vibrations.",
      "A must-visit place for inner peace and divine blessings.",
      "Holds immense historical and cultural importance in the region."
    ];
  };

  const scrollToSection = (sectionId: string, label: string) => {
    setActiveTab(label);
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleShare = (platform: string) => {
    if (typeof window === 'undefined' || !place) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${place.title} on Astrology In Bharat!`);
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${text}&body=You should visit this amazing place: ${window.location.href}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: place.title,
            text: `Check out ${place.title}!`,
            url: window.location.href,
          }).catch(console.error);
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        }
        break;
    }
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getPlaceBySlug(slug as string);
      
      if (!data) {
        setLoading(false);
        return;
      }

      setPlace(data);

      const imgs = await fetchPlaceImages(data.title);
      setImages(imgs);
      setLoading(false);
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loading size="lg" text="Loading Details..." />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-6">
        <div className="text-center p-6 bg-[#1A1A1A] rounded-lg border border-slate-200 max-w-sm">
          <h2 className="text-base font-bold text-brown mb-1">{t.detail.notFound}</h2>
          <Link
            href="/famous-places"
            className="text-xs font-bold text-orange"
          >
            {t.detail.returnDirectory}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 pt-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold text-[#F26500] mb-6">
          <i className="fa-solid fa-house"></i>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/famous-places" className="hover:underline">Famous Temples</Link>
          <span className="text-gray-400">›</span>
          <span className="text-[#F26500]">{place.title}</span>
        </div>

        {/* Main Card */}
        <div className="bg-[#1A1A1A] rounded-[24px] p-6 shadow-sm border border-[#E8D5C0] mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Images */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={images[currentImageIndex] || place.thumbnailUrl || "/images/temple-placeholder.png"}
                  alt={place.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <i className="fa-solid fa-om text-[#F26500]"></i>
                  {place.category || "Spiritual Place"}
                </div>
              </div>
              
              {/* Thumbnails */}
              {images.length > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="w-10 h-10 rounded-full border border-[#F26500] text-[#F26500] bg-[#1A1A1A] flex items-center justify-center hover:bg-orange-50 shrink-0 shadow-sm"
                  >
                    <i className="fa-solid fa-chevron-left text-[14px]"></i>
                  </button>
                  <div className="flex-1 flex gap-3 overflow-hidden px-1">
                    {images.slice(0, 5).map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden flex-1 border-[2.5px] transition-all ${currentImageIndex === idx ? 'border-[#F26500]' : 'border-transparent hover:border-orange-200'}`}
                      >
                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="w-10 h-10 rounded-full border border-[#F26500] text-[#F26500] bg-[#1A1A1A] flex items-center justify-center hover:bg-orange-50 shrink-0 shadow-sm"
                  >
                    <i className="fa-solid fa-chevron-right text-[14px]"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-[42px] font-serif font-black text-[#3D1A0B] mb-2 leading-tight truncate" title={place.title}>
                {place.title}
              </h1>
              
              <h2 className="text-[18px] md:text-[22px] font-bold text-[#F26500] mb-4">
                {place.title}, {place.address?.split(",")[0] || "India"}
              </h2>
              
              <div className="flex items-center gap-2 text-white font-medium mb-4">
                <i className="fa-solid fa-location-dot text-[#F26500]"></i>
                {place.address || "India"}
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="text-[15px] font-bold text-white">
                  {place.rating || "4.9"} <i className="fa-solid fa-star text-[#F26500]"></i> 
                  <span className="text-white ml-1">({place.reviews || "24K"} Reviews)</span>
                </div>
                
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                
                {distanceInfo.status === 'idle' && (
                  <button onClick={handleGetLocation} className="text-[13px] font-bold text-[#F26500] hover:underline flex items-center gap-1">
                    <i className="fa-solid fa-location-crosshairs"></i> Get Distance
                  </button>
                )}
                {distanceInfo.status === 'requesting' && (
                  <div className="text-[13px] font-bold text-gray-500 flex items-center gap-1">
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Calculating...
                  </div>
                )}
                {distanceInfo.status === 'granted' && (
                  <div className="text-[14px] font-bold text-green-600 flex items-center gap-1">
                    <i className="fa-solid fa-check-circle"></i> {distanceInfo.distance} km from you
                  </div>
                )}
                {distanceInfo.status === 'denied' && (
                  <div className="text-[13px] font-bold text-red-500" title="Please enable location permissions in your browser">
                    Location Denied
                  </div>
                )}
                {(distanceInfo.status === 'no-dest' || distanceInfo.status === 'error') && (
                  <div className="text-[13px] font-bold text-gray-500">
                    Distance unavailable
                  </div>
                )}
              </div>

              <p className="text-white leading-relaxed mb-8 text-[15px]">
                {place.description || `Sri Harmandir Sahib, also known as the ${place.title}, is the most revered spiritual center. It welcomes people from all walks of life.`}
              </p>

              {/* 4 Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-y border-dashed border-[#E8D5C0] py-6">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-[#F26500]"><i className="fa-regular fa-clock text-xl"></i></div>
                  <div className="text-[11px] font-bold text-gray-500">Open</div>
                  <div className="text-[13px] font-bold text-[#3D1A0B]">24 Hours</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-[#F26500]"><i className="fa-solid fa-calendar-check text-xl"></i></div>
                  <div className="text-[11px] font-bold text-gray-500">Best Time</div>
                  <div className="text-[13px] font-bold text-[#3D1A0B]">All Time</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-[#F26500]"><i className="fa-solid fa-ticket text-xl"></i></div>
                  <div className="text-[11px] font-bold text-gray-500">Entry Fee</div>
                  <div className="text-[13px] font-bold text-[#3D1A0B]">Free</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-[#F26500]"><i className="fa-solid fa-shirt text-xl"></i></div>
                  <div className="text-[11px] font-bold text-gray-500">Dress Code</div>
                  <div className="text-[13px] font-bold text-[#3D1A0B]">Traditional</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.title} ${place.address || ''}`)}`, '_blank')}
                  className="w-full sm:flex-1 bg-[#D95F18] hover:bg-[#C25313] text-white font-bold py-3.5 px-4 sm:px-6 text-[15px] sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-location-arrow"></i> Get Directions
                </button>
                <button onClick={() => handleShare('native')} className="w-full sm:flex-1 bg-[#1A1A1A] border-[2px] border-[#D95F18] text-[#D95F18] hover:bg-orange-50 font-bold py-3.5 px-4 sm:px-6 text-[15px] sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2">
                  <i className="fa-solid fa-share-nodes"></i> Share
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {[
            { label: "About Temple", icon: "fa-om", id: "about" },
            { label: "Timings", icon: "fa-clock", id: "timings" },
            { label: "History", icon: "fa-book-open", id: "history" },
            { label: "Significance", icon: "fa-hands-praying", id: "significance" },
            { label: "Astrology Benefits", icon: "fa-star", id: "astrology" },
            { label: "Nearby Places", icon: "fa-map-location-dot", id: "nearby" },
            { label: "Reviews", icon: "fa-comment-dots", id: "reviews" }
          ].map((tab, idx) => {
            const isActive = activeTab === tab.label;
            return (
              <button 
                key={idx} 
                onClick={() => scrollToSection(tab.id, tab.label)}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 transition-colors ${isActive ? 'bg-[#3D1A0B] text-white border border-[#3D1A0B]' : 'bg-[#1A1A1A] border border-[#E8D5C0] hover:border-orange-300 text-gray-300'}`}
              >
                <i className={`fa-solid ${tab.icon} text-[#F26500]`}></i> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bottom Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* About Card */}
            <div id="about" className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-4 flex items-center gap-2">
                <i className="fa-brands fa-pagelines text-[#F26500]"></i> About {place.title}
              </h3>
              <div className="text-white text-[15px] leading-relaxed space-y-4 mb-6">
                <p>
                  {place.description || `${place.title} is a highly revered spiritual destination located in ${place.address || "India"}. It is renowned for its stunning architecture, serene ambiance, and divine presence.`}
                </p>
                <p>
                  The temple welcomes millions of devotees and tourists every year, symbolizing purity and equality. Visitors can experience peace, participate in daily rituals, and seek blessings.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Spiritual Center", "Open for All", "Langar Service", "Peace & Harmony"].map((pill, i) => (
                  <div key={i} className="bg-[#FFF8F0] text-[#3D1A0B] font-bold text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-2 border border-[#F26500]/10">
                    <i className="fa-solid fa-dharmachakra text-[#F26500]"></i> {pill}
                  </div>
                ))}
              </div>
            </div>

            {/* History Card */}
            <div id="history" className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-book-open text-[#F26500]"></i> History
              </h3>
              <p className="text-white text-[15px] leading-relaxed">
                The foundation of {place.title} is deeply rooted in history and tradition. It has witnessed various historical events but continues to stand as a powerful symbol of faith, humanity, and devotion throughout the centuries.
              </p>
            </div>

            {/* Significance Card */}
            <div id="significance" className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-hands-praying text-[#F26500]"></i> Significance
              </h3>
              <ul className="space-y-3">
                {getDynamicSignificance(place.title).map((sig, i) => (
                  <li key={i} className="flex items-start gap-3 text-white text-[15px]">
                    <i className="fa-solid fa-check text-[#F26500] mt-1"></i>
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Astrology Benefits Card */}
            <div id="astrology" className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0] relative overflow-hidden">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-4 flex items-center gap-2 relative z-10">
                <i className="fa-regular fa-sun text-[#F26500]"></i> Astrology Benefits
              </h3>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 space-y-4">
                  <p className="text-white text-[15px]">
                    Visiting {place.title} is believed to bring:
                  </p>
                  <ul className="space-y-4 relative z-10">
                    {getDynamicAstrologyBenefits(place.title).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-white text-[14px]">
                        <i className="fa-regular fa-circle-dot text-[#F26500]"></i>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Decorative Astrology Wheel (Using Icon as placeholder for the image in screenshot) */}
              <div className="absolute right-[-40px] bottom-[-80px] opacity-[0.07] pointer-events-none transform rotate-45">
                <i className="fa-solid fa-dharmachakra text-[#F26500] text-[280px]"></i>
              </div>
            </div>

            {/* Reviews Card */}
            <div id="reviews" className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-[20px] font-bold text-[#3D1A0B] flex items-center gap-2">
                  <i className="fa-solid fa-comment-dots text-[#F26500]"></i> Reviews & Ratings
                </h3>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + " " + (place.address || ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FFF8F0] text-[#F26500] hover:bg-[#F26500] hover:text-white transition-colors border border-[#F26500] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Write Review
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
                <div className="text-center min-w-[120px]">
                  <div className="text-5xl font-black text-[#3D1A0B]">{place.rating || "4.8"}</div>
                  <div className="flex text-[#F26500] text-sm justify-center my-2 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < Math.floor(Number(place.rating) || 4) ? "" : "text-gray-300"}`}></i>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{place.reviews || "1,200+"} reviews</div>
                </div>
                
                {/* Progress bars for stars */}
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <div className="w-8 text-gray-400 font-medium">{star} <i className="fa-solid fa-star text-xs text-gray-400"></i></div>
                      <div className="flex-1 h-2.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#F26500] rounded-full" 
                          style={{ width: `${star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Location Card */}
            <div className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-map-location-dot text-[#F26500]"></i> Location
              </h3>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + " " + (place.address || ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[220px] rounded-xl overflow-hidden bg-[#FAF5EE] flex flex-col items-center justify-center relative border border-[#E8D5C0] mb-5 group hover:border-orange-300 transition-all no-underline"
              >
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <i className="fa-solid fa-map-location-dot text-3xl text-[#F26500]"></i>
                </div>
                <p className="text-sm font-bold text-[#3D1A0B] group-hover:text-[#F26500] transition-colors m-0">Click to open Interactive Map</p>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">Opens in a new tab</p>
              </a>
              <div className="flex items-start gap-3 text-white text-[14px] font-medium mb-6">
                <i className="fa-solid fa-location-dot text-[#F26500] mt-1"></i>
                <p className="leading-relaxed">{place.title}, {place.address || "India"}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + " " + (place.address || ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#1A1A1A] border-[2px] border-[#F26500] hover:bg-orange-50 text-[#F26500] font-bold py-3.5 rounded-xl transition-colors"
              >
                View on Google Maps
              </a>
            </div>

            {/* Temple Highlights Card */}
            <div className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-5 flex items-center gap-2">
                <i className="fa-solid fa-building-columns text-[#F26500]"></i> Temple Highlights
              </h3>
              <ul className="space-y-4">
                {getDynamicHighlights(place.title).map((highlight, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-[14px] font-medium">
                    <i className="fa-regular fa-circle-dot text-[#F26500]"></i>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share this Temple Card */}
            <div className="bg-[#1A1A1A] rounded-[20px] p-6 shadow-sm border border-[#E8D5C0]">
              <h3 className="text-[20px] font-bold text-[#3D1A0B] mb-5 flex items-center gap-2">
                <i className="fa-solid fa-share-nodes text-[#F26500]"></i> Share this Temple
              </h3>
              <div className="flex items-center justify-between gap-2">
                <button onClick={() => handleShare('facebook')} className="w-12 h-12 rounded-full border border-[#333333] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow bg-[#1A1A1A] text-[#1877F2]">
                  <i className="fa-brands fa-facebook-f text-xl"></i>
                </button>
                <button onClick={() => handleShare('whatsapp')} className="w-12 h-12 rounded-full border border-[#333333] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow bg-[#1A1A1A] text-[#25D366]">
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                </button>
                <button onClick={() => handleShare('twitter')} className="w-12 h-12 rounded-full border border-[#333333] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow bg-[#1A1A1A] text-[#1DA1F2]">
                  <i className="fa-brands fa-twitter text-xl"></i>
                </button>
                <button onClick={() => handleShare('email')} className="w-12 h-12 rounded-full border border-[#333333] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow bg-[#1A1A1A] text-[#EA4335]">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom CTA Banner */}
        <GuidanceCTA 
          className="mt-12 mb-8"
          subtitle="Personalized Guidance"
          title="Want to know more about this temple?"
          description="Talk to our Astrology Experts and get personalized guidance and temple recommendations."
          buttonText="Talk to Expert"
          buttonLink="/chat"
          buttonIcon="fa-solid fa-comments"
        />

      </div>
    </div>
  );
};

export default PlaceDetailPage;
