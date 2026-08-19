import React from 'react';

interface PanchangHeroBannerProps {
  lang: string;
}

export default function PanchangHeroBanner({ lang }: PanchangHeroBannerProps) {
  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#fef5e7] via-[#fce6c5] to-[#fbc890] shadow-sm mb-6 mt-4 border border-[#f3d3a3]">
      {/* Background Texture/Illustration (using a placeholder for now) */}
      <div 
        className="absolute right-0 top-0 w-1/2 h-full bg-no-repeat bg-cover bg-right opacity-80 mix-blend-multiply"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}
      ></div>

      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#5b2a26] font-display mb-2 drop-shadow-sm">
            {lang === 'hi' ? 'हिन्दू पंचांग' : 'Hindu Panchang'}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#c85a17] mb-4">
            {lang === 'hi' ? 'आज की तिथि, नक्षत्र और मुहूर्त' : 'Today\'s Tithi, Nakshatra & Muhurat'}
          </h2>
          <p className="text-[#6d4c41] text-sm md:text-base font-medium mb-8 max-w-md">
            {lang === 'hi' 
              ? 'ब्रह्मांडीय समय को जानें और ब्रह्मांड के साथ सामंजस्य में अपने दिन की योजना बनाएं।' 
              : 'Know the cosmic time and plan your day in harmony with the universe.'}
          </p>

          <div className="flex items-center gap-4 md:gap-8 flex-wrap">
            {[
              { icon: 'fa-calendar-day', label: lang === 'hi' ? 'दैनिक पंचांग' : 'Daily Panchang' },
              { icon: 'fa-moon', label: lang === 'hi' ? 'तिथि' : 'Tithi' },
              { icon: 'fa-star', label: lang === 'hi' ? 'नक्षत्र' : 'Nakshatra' },
              { icon: 'fa-om', label: lang === 'hi' ? 'शुभ मुहूर्त' : 'Auspicious Muhurat' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-[#c85a17] text-[#c85a17] flex items-center justify-center text-xl mb-2 bg-white/50">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <span className="text-xs font-semibold text-[#5b2a26] text-center max-w-[60px] leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side Image Placeholder (Sun, Moon, Scroll) */}
        <div className="hidden lg:flex relative h-64 w-64 md:h-80 md:w-80 mt-8 md:mt-0 items-center justify-center">
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl"></div>
          {/* We use FontAwesome icons as a placeholder for the beautiful illustration */}
          <div className="relative text-[#d35400] text-9xl drop-shadow-xl">
             <i className="fa-solid fa-scroll"></i>
          </div>
        </div>
      </div>
    </section>
  );
}
