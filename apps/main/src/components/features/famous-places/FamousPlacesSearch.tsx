"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchStates, fetchDistricts, State, District } from "@/libs/api-locations";
import { useLanguageStore } from "@repo/store";

interface FamousPlacesSearchProps {
  onSearch: (query: string, location?: string) => void;
  isSearching: boolean;
}



const RADIUS_OPTIONS_EN = ["Within 5 km", "Within 10 km", "Within 25 km", "Within 50 km", "Within 100 km"];
const RADIUS_OPTIONS_HI = ["5 किमी के भीतर", "10 किमी के भीतर", "25 किमी के भीतर", "50 किमी के भीतर", "100 किमी के भीतर"];

const CustomSelect = ({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-[#FAF5EE] border border-[#E8D5C0] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium pr-8 truncate flex items-center justify-between"
      >
        <span className={value ? "text-gray-800" : "text-gray-500"}>{value || placeholder}</span>
        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isOpen ? "rotate-180 text-orange-400" : "text-gray-400"}`} />
      </button>
      
      {isOpen && (
        <div data-lenis-prevent="true" className="absolute top-full mt-1 w-full max-h-64 flex flex-col bg-white border border-[#E8D5C0] rounded-lg shadow-xl z-[100] py-1">
          <div className="px-3 py-2 border-b border-gray-100">
            <input 
              ref={inputRef}
              type="text" 
              placeholder={`Search...`}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-orange-300 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto custom-scrollbar flex-1 pb-1">
            <div 
              onClick={() => { onChange(""); setIsOpen(false); setSearch(""); }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-50 transition-colors ${!value ? "bg-orange-50 font-bold text-[#D35400]" : "text-gray-700"}`}
            >
              {placeholder}
            </div>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">No results found</div>
            ) : (
              filteredOptions.map((opt: string) => (
                <div
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); setSearch(""); }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-50 transition-colors ${value === opt ? "bg-orange-50 font-bold text-[#D35400]" : "text-gray-700"}`}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FamousPlacesSearch: React.FC<FamousPlacesSearchProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState("");
  const { lang } = useLanguageStore();

  const tx = {
    en: {
      searchTitle: "Search Temples",
      searchSubtitle: "Find temples by State, District, City or Area",
      useMyLocation: "Use My Location",
      placeholder: "Enter your area name, city or temple name...",
      selectState: "Select State",
      selectDistrict: "Select District",
      selectCity: "Select City / Area",
      withinRadius: "Within Radius",
      search: "Search",
      toastWarning: "Please enter a search term or select a location before searching.",
      noResults: "No results found",
    },
    hi: {
      searchTitle: "मंदिर खोजें",
      searchSubtitle: "राज्य, जिला, शहर या क्षेत्र द्वारा मंदिर खोजें",
      useMyLocation: "मेरी लोकेशन उपयोग करें",
      placeholder: "अपने क्षेत्र का नाम, शहर या मंदिर का नाम दर्ज करें...",
      selectState: "राज्य चुनें",
      selectDistrict: "जिला चुनें",
      selectCity: "शहर / क्षेत्र चुनें",
      withinRadius: "दायरे के भीतर",
      search: "खोजें",
      toastWarning: "खोज से पहले कृपया एक खोज शब्द दर्ज करें या एक स्थान चुनें।",
      noResults: "कोई परिणाम नहीं मिला",
    },
  }[lang] || { en: {} } as any;

  const RADIUS_OPTIONS = lang === 'hi' ? RADIUS_OPTIONS_HI : RADIUS_OPTIONS_EN;
  
  // Selected values
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState("");

  // Data from API
  const [statesList, setStatesList] = useState<State[]>([]);
  const [districtsList, setDistrictsList] = useState<District[]>([]);

  // 1. Fetch States on Mount
  useEffect(() => {
    fetchStates().then(res => setStatesList(res));
  }, []);

  // 2. Fetch Districts when State changes
  useEffect(() => {
    if (!state) {
      setDistrictsList([]);
      setDistrict(""); // reset district
      return;
    }
    const selectedState = statesList.find(s => s.name === state);
    if (selectedState) {
      fetchDistricts(selectedState.id).then(res => setDistrictsList(res));
    }
  }, [state, statesList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() && !state && !district && !city) {
      toast.warning(tx.toastWarning);
      return;
    }

    let locationStr = [city.trim(), district.trim(), state.trim(), "India"].filter(Boolean).join(", ");
    
    let baseQuery = query.trim() ? query.trim() : "temples";
    if (radius) {
       baseQuery += ` ${radius}`;
    }
    
    onSearch(baseQuery, locationStr);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    // Show a temporary loading state or just proceed
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onSearch("temples", `${latitude},${longitude}`);
      }, 
      (error) => {
        console.error("Geolocation error:", error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please allow location access in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Please check if your device's location services (GPS/Wi-Fi) are turned on.");
            break;
          case error.TIMEOUT:
            alert("The request to get your location timed out. Please try again.");
            break;
          default:
            alert("An unknown error occurred while trying to get your location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <section className="bg-[#FAF5EE] border-b border-orange-100 py-6">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8">

        {/* ── Single White Card Box ── */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-[#ff6b00] hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow px-6 py-6">
            <form onSubmit={handleSubmit}>

              {/* Row 1: Title + Use My Location */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F26500] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-magnifying-glass text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#3D1A0B] leading-tight">{tx.searchTitle}</h2>
                    <p className="text-[13px] text-gray-500 font-medium">{tx.searchSubtitle}</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="hidden sm:flex items-center gap-2 border border-[#E8D5C0] text-[#D35400] px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors"
                >
                  <i className="fa-solid fa-crosshairs"></i> {tx.useMyLocation}
                </button>
              </div>

            {/* Row 2: Text Input */}
            <div className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tx.placeholder}
                className="w-full bg-[#FAF5EE] border border-[#E8D5C0] rounded-lg px-4 py-3 pr-12 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fa-solid fa-magnifying-glass text-sm" />
              </div>
            </div>

            {/* Row 3: Dropdowns + Search Button */}
            <div className="flex flex-wrap gap-2">
              {/* Select State */}
              <div className="flex-1 min-w-[130px]">
                <CustomSelect 
                  value={state} 
                  onChange={setState} 
                  options={statesList.map(s => s.name)} 
                  placeholder={tx.selectState} 
                />
              </div>

              {/* Select District */}
              <div className="flex-1 min-w-[130px]">
                <CustomSelect 
                  value={district} 
                  onChange={setDistrict} 
                  options={districtsList.map(d => d.name)} 
                  placeholder={tx.selectDistrict} 
                />
              </div>

              {/* Select City/Area */}
              <div className="relative flex-1 min-w-[130px]">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={tx.selectCity}
                  className="w-full bg-[#FAF5EE] border border-[#E8D5C0] rounded-lg px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                />
              </div>

              {/* Within Radius */}
              <div className="flex-1 min-w-[130px]">
                <CustomSelect 
                  value={radius} 
                  onChange={setRadius} 
                  options={RADIUS_OPTIONS} 
                  placeholder={tx.withinRadius} 
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isSearching}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-7 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm flex-shrink-0 shadow-sm"
              >
                <i className={`fa-solid ${isSearching ? "fa-spinner fa-spin" : "fa-magnifying-glass"}`} />
                {tx.search}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};

export default FamousPlacesSearch;
