import React from "react";

export default function HinduCalendarSeoContent() {
  return (
    <section className="mt-12 bg-white rounded-3xl p-6 md:p-10 border border-[#F0E0D0] shadow-[0_4px_15px_0_rgba(0,0,0,0.03)]">
      <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#F26500] inline-flex pb-2">Understanding the Hindu Calendar (Panchang)
      </h2>
      
      <p className="text-gray-700 text-[15px] leading-relaxed mb-8">
        The Hindu Calendar, commonly known as the <strong>Panchang</strong> (or Panchangam), is an ancient, highly precise timekeeping system based on the positions of the Sun and the Moon. Unlike the standard Gregorian calendar which simply counts solar days, the Panchang is a dynamic cosmic clock that helps millions of people align their daily activities, religious rituals, and major life events with favorable planetary energies.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl">
        <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">Luni-Solar System Explained
        </h3>
        <p className="text-blue-800 text-[14.5px] leading-relaxed">
          The Hindu calendar is a <strong>Luni-Solar</strong> system. It tracks the Moon's phases to determine the dates (Tithis) and months, while it tracks the Sun's transit into different zodiacs (Sankranti) to determine the solar year and changing seasons. To keep the lunar months in sync with the solar year, an extra month called <em>Adhik Maas</em> (leap month) is added approximately every 32.5 months!
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-black text-[#1A1A1A] mb-6">The 5 Pillars of Panchang
        </h3>
        <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
          The word "Panchang" literally translates to "Five Limbs". Every single day is defined by the mathematical combination of these five elements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-[#F26500] text-[17px] mb-2">1. Tithi (Lunar Day)</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">The angular distance between the Sun and Moon. There are 30 Tithis in a lunar month, divided into Shukla Paksha (waxing) and Krishna Paksha (waning).</p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-[#F26500] text-[17px] mb-2">2. Vaar (Weekday)</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">The 7 days of the week, starting from Sunday (Ravivar) to Saturday (Shanivar). Each day is ruled by a specific planet and deity.</p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-[#F26500] text-[17px] mb-2">3. Nakshatra (Constellation)</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">The specific 13°20' sector of the sky the Moon is traveling through. There are 27 Nakshatras, and they heavily influence human emotions and behavior.</p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-[#F26500] text-[17px] mb-2">4. Yoga (Luni-Solar Arc)</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">Calculated by adding the longitudes of the Sun and Moon. There are 27 Yogas, which indicate the overall auspiciousness or inauspiciousness of the day.</p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow lg:col-span-2">
            <h4 className="font-bold text-[#F26500] text-[17px] mb-2">5. Karana (Half-Tithi)</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">A Karana is precisely half of a Tithi. There are 11 Karanas in total. Certain Karanas (like Bhadra/Vishti) are considered highly unfavorable for starting new, important tasks.</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-[#F26500] p-6 mb-10 rounded-r-xl">
        <p className="text-[#993E00] text-[15px] font-medium leading-relaxed">
          <strong>Why check Muhurat?</strong> Doing the right thing at the wrong time often leads to failure. A Shubh Muhurat ensures that planetary energies are aligned in your favor, significantly boosting the chances of success for marriages, housewarmings, or business launches.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Frequently Asked Questions
        </h3>
        
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
            <h4 className="font-bold text-[#F26500] text-[16px] mb-2">What is the difference between Amavasya and Purnima?</h4>
            <p className="text-gray-700 text-[14.5px] leading-relaxed">
              <strong>Amavasya</strong> is the New Moon day when the night is completely dark. It is dedicated to honoring ancestors and removing negative energies. <strong>Purnima</strong> is the Full Moon day, considered highly auspicious for fasts, pujas, and celebrating the divine feminine.
            </p>
          </div>
          
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
            <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Are all Hindu calendars the same?</h4>
            <p className="text-gray-700 text-[14.5px] leading-relaxed">
              No. India is vast, and different regions follow slightly different systems. The two main systems are <strong>Amanta</strong> (month ends on New Moon, followed mainly in South India) and <strong>Purnimanta</strong> (month ends on Full Moon, followed mainly in North India). However, the major festivals and planetary transits remain the same.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
            <h4 className="font-bold text-[#F26500] text-[16px] mb-2">What is Rahu Kaal?</h4>
            <p className="text-gray-700 text-[14.5px] leading-relaxed">
              Rahu Kaal is a specific time period of about 90 minutes every day ruled by the shadow planet Rahu. It is considered highly inauspicious to start any new, good, or important work during this time window.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
