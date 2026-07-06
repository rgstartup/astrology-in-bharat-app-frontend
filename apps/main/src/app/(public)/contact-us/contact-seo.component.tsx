import React from "react";

export default function ContactSeoContent() {
  return (
    <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 mt-16 mb-8 relative z-20">
      
      <h2 className="text-2xl font-black text-[#32131b] mb-6 flex items-center gap-3 border-b-2 border-orange inline-flex pb-2">
        <i className="fa-solid fa-headset text-orange"></i> Get in Touch with Astrology Experts
      </h2>
      
      <p className="text-gray-700 text-[15px] leading-relaxed mb-8 font-medium">
        Whether you have a deep burning question about your destiny, need help booking a complex Vedic Puja, or are facing an issue with your Astromall order, our dedicated support team is here to guide you. We bridge the gap between ancient Vedic wisdom and modern customer service, ensuring you get the clarity and assistance you deserve.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl">
        <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved"></i> 100% Privacy & Confidentiality Guaranteed
        </h3>
        <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
          Astrology deals with the most intimate and personal aspects of your life—be it a difficult breakup, severe financial loss, or a private family matter. We guarantee that all your communication, birth details (Kundali), and consultation records are highly encrypted and kept strictly confidential. Your secret is safe with the stars and with us.
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-black text-[#32131b] mb-6">
          🤝 How Our Support Team Can Assist You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">
              <i className="fa-solid fa-phone-volume"></i> Consultation Support
            </h4>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">Having trouble connecting with an astrologer? Wallet recharge failed? We will resolve all call/chat connectivity issues within minutes.</p>
          </div>
          <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">
              <i className="fa-solid fa-hands-praying"></i> Online Puja Queries
            </h4>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">Need help choosing the right Puja for your Dosh? Want to know how to join the live video link? Our team provides full step-by-step guidance.</p>
          </div>
          <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">
              <i className="fa-solid fa-box"></i> Astromall Orders
            </h4>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">Track your Gemstone, Rudraksha, or Yantra delivery. Ask for lab-certification details or replacement requests if damaged.</p>
          </div>
          <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">
              <i className="fa-solid fa-star"></i> General Guidance
            </h4>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">Not sure where to start? Let our support executives recommend the best astrologer on our platform based on your specific life problem.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-10 rounded-r-xl">
        <p className="text-amber-900 text-[15px] font-medium leading-relaxed">
          <i className="fa-solid fa-clock text-amber-600 mr-2"></i>
          <strong>Fast Response Time:</strong> We understand that astrological emergencies (like matching a Kundali for a sudden proposal) require urgent attention. Our WhatsApp support typically responds within 5-10 minutes during active hours!
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-black text-[#32131b] mb-6">
          ❓ Frequently Asked Questions
        </h3>
        
        <div className="space-y-6">
          <div className="bg-[#fffaf5] p-5 rounded-2xl border border-orange/10">
            <h4 className="font-bold text-orange text-[16px] mb-2">Can I speak directly to an Astrologer on the support number?</h4>
            <p className="text-gray-600 font-medium text-[14.5px] leading-relaxed">
              No. The support numbers provided on this page connect you to our Customer Care team. To speak to an astrologer, please navigate to the "Chat/Call with Astrologer" section on the app or website.
            </p>
          </div>
          
          <div className="bg-[#fffaf5] p-5 rounded-2xl border border-orange/10">
            <h4 className="font-bold text-orange text-[16px] mb-2">What happens if my call gets disconnected during a consultation?</h4>
            <p className="text-gray-600 font-medium text-[14.5px] leading-relaxed">
              Don't worry! If your call drops due to a technical glitch, the system automatically pauses your wallet deduction. Simply reach out to our WhatsApp support with your consultation ID, and we will arrange a reconnect or refund the specific amount.
            </p>
          </div>

          <div className="bg-[#fffaf5] p-5 rounded-2xl border border-orange/10">
            <h4 className="font-bold text-orange text-[16px] mb-2">How can I request a refund for a Puja or Astromall product?</h4>
            <p className="text-gray-600 font-medium text-[14.5px] leading-relaxed">
              Send us an email at our official support email ID with your Order Number and the reason for the refund request. Our team will review the case as per our Cancellation Policy and initiate the process within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
