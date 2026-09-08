"use client";

import React, { useState } from "react";
import { FaChevronRight, FaSearch } from "react-icons/fa";

const nakshatras = [
  "1. Ashwini",
  "2. Bharani",
  "3. Krittika",
  "4. Rohini",
  "5. Mrigashirsha",
  "6. Ardra",
  "7. Punarvasu",
  "8. Pushya",
  "9. Ashlesha",
  "10. Magha",
  "11. Purva Phalguni",
  "12. Uttara Phalguni",
  "13. Hasta",
  "14. Chitra",
  "15. Swati",
  "16. Vishakha",
  "17. Anuradha",
  "18. Jyeshtha",
  "19. Mula",
  "20. Purva Ashadha",
  "21. Uttara Ashadha",
  "22. Shravana",
  "23. Dhanishta",
  "24. Shatabhisha",
  "25. Purva Bhadrapada",
  "26. Uttara Bhadrapada",
  "27. Revati",
];

const SidebarSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const filteredNakshatras = nakshatras.filter((nak) =>
    nak.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="sticky top-28 h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-premium overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-slate-950 p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">27 Nakshatras</h3>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">The Stellar Mansions</p>
          </div>
          
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 py-4 ps-12 rounded-2xl text-xs font-bold focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all"
              placeholder="Search mansions..."
            />
            <FaSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors"
              size={12}
            />
          </div>
        </div>

        {/* List Areas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {filteredNakshatras.length > 0 ? (
            filteredNakshatras.map((nak, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(nakshatras.indexOf(nak))}
                className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex justify-between items-center group relative overflow-hidden ${
                  activeIdx === nakshatras.indexOf(nak)
                    ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20 translate-x-2"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="relative z-10">{nak}</span>
                <FaChevronRight
                  size={10}
                  className={`relative z-10 transition-all duration-300 ${
                    activeIdx === nakshatras.indexOf(nak) ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
                
                {activeIdx === nakshatras.indexOf(nak) && (
                   <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent pointer-events-none"></div>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center space-y-4">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                 <FaSearch size={20} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No mansions found for your search.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-slate-50 border-t border-gray-100 italic">
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed text-center">
             Select a nakshatra to view detailed cosmic traits and planetary rulers.
           </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </aside>
  );
};

export default SidebarSection;
