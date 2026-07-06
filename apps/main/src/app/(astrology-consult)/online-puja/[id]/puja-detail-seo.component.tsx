import React from "react";

export default function PujaDetailSeoContent({ pujaName }: { pujaName: string }) {
  const safeName = pujaName || "This Vedic Puja";

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 mt-8">
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-[#F0E0D0] shadow-[0_4px_15px_0_rgba(0,0,0,0.03)]">
        <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#FF5500] inline-flex pb-2">
          <i className="fa-solid fa-om text-[#FF5500]"></i> The Spiritual Significance of {safeName}
        </h2>
        
        <p className="text-gray-700 text-[15px] leading-relaxed mb-8">
          Vedic rituals are highly potent cosmic remedies designed to align your individual energy with the universal consciousness. Performing <strong>{safeName}</strong> involves precise chanting of ancient mantras, offering of sacred fire (Havan), and strict adherence to Vedic protocols. This ritual is specifically recommended by astrologers to remove energetic blockages, appease planetary deities, and manifest deep-seated intentions for health, wealth, and peace.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl">
          <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-video"></i> Why Perform {safeName} Online?
          </h3>
          <p className="text-blue-800 text-[14.5px] leading-relaxed">
            In our fast-paced modern world, finding highly qualified, traditional Acharyas locally can be incredibly difficult. By booking {safeName} online, a verified Vedic expert performs the entire ritual at a sacred location on your behalf. The Pandit takes the <strong>Sankalp</strong> in your name (and Gotra), ensuring that 100% of the spiritual merit and cosmic energy is transferred directly to you, while you participate via a live video link from anywhere in the world.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-black text-[#1A1A1A] mb-6">
            ✨ Core Benefits of this Ritual
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                <i className="fa-solid fa-hurricane text-orange-400"></i> Karmic Cleansing
              </h4>
              <p className="text-[14px] text-gray-700 leading-relaxed">The intense vibrations of the mantras used during this puja help dissolve negative karma accumulated over lifetimes, removing unseen obstacles from your current path.</p>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                <i className="fa-solid fa-planet-ringed text-indigo-400"></i> Planetary Peace (Graha Shanti)
              </h4>
              <p className="text-[14px] text-gray-700 leading-relaxed">It neutralizes the negative impacts (Doshas) caused by unfavorable planetary transits in your birth chart, protecting you from sudden misfortunes.</p>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                <i className="fa-solid fa-brain text-pink-400"></i> Mental Clarity & Calmness
              </h4>
              <p className="text-[14px] text-gray-700 leading-relaxed">The sacred smoke from the Havan and the continuous rhythmic chanting purify the surrounding aura, dramatically reducing anxiety, depression, and mental fog.</p>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                <i className="fa-solid fa-arrow-trend-up text-green-500"></i> Success & Prosperity
              </h4>
              <p className="text-[14px] text-gray-700 leading-relaxed">By clearing energetic blockages, this puja opens up new avenues for financial growth, career promotions, and harmony in personal relationships.</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-[#FF5500] p-6 mb-10 rounded-r-xl">
          <p className="text-[#993E00] text-[15px] font-medium leading-relaxed">
            <i className="fa-solid fa-clock text-[#FF5500] mr-2"></i>
            <strong>The Importance of Shubh Muhurat:</strong> The efficacy of {safeName} is multiplied exponentially when performed at the correct astrological timing (Muhurat). Our expert astrologers carefully calculate this timing based on your specific Kundali before beginning the ritual.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-black text-[#1A1A1A] mb-6">
            ❓ Frequently Asked Questions
          </h3>
          
          <div className="space-y-6">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
              <h4 className="font-bold text-[#FF5500] text-[16px] mb-2">Can someone else perform {safeName} on my behalf?</h4>
              <p className="text-gray-700 text-[14.5px] leading-relaxed">
                Yes. If you are physically unwell, traveling, or unavailable, an immediate family member (like a spouse, parent, or child) can sit in the Puja for you. The Pandit will still take the Sankalp using your name, ensuring the benefits reach you.
              </p>
            </div>
            
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
              <h4 className="font-bold text-[#FF5500] text-[16px] mb-2">Are there any rules I must follow during the Puja?</h4>
              <p className="text-gray-700 text-[14.5px] leading-relaxed">
                If you are joining via live video, it is highly recommended to take a bath, wear clean clothes, sit facing East or North, and avoid consuming non-vegetarian food or alcohol on the day of the ritual to maintain spiritual purity.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
              <h4 className="font-bold text-[#FF5500] text-[16px] mb-2">How soon will I see the results of the ritual?</h4>
              <p className="text-gray-700 text-[14.5px] leading-relaxed">
                Spiritual remedies operate on a cosmic timeline. While many people report feeling an immediate sense of peace and clarity, tangible material results usually begin manifesting within 40 to 90 days, depending on the severity of your planetary afflictions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
