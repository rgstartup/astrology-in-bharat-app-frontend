import React from "react";

export default function TermsSeoContent() {
  return (
    <section className="not-prose pt-0 pb-10 md:pb-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-8 rounded-[3px]">
          
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#F26500] inline-flex pb-2">Understanding Our Platform Guidelines
          </h2>
          
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6 font-medium">
            Astrology in Bharat is designed to be a safe, spiritual, and respectful community for both seekers and Vedic experts. To maintain the highest standards of service and ensure a smooth experience during your consultations, pujas, or purchases, we have established a set of core guidelines. By joining our platform, you agree to uphold these mutual standards of respect and fair use.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-blue-900 mb-2">The Nature of Astrological Advice</h3>
            <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
              Vedic Astrology is an ancient science of probabilities and cosmic energies, not absolute certainties. The predictions, remedies, and guidance provided by astrologers on our platform are meant for spiritual and personal development. They should <strong>never</strong> be used as a substitute for professional medical, legal, psychiatric, or financial advice. You are solely responsible for the life decisions you make based on these consultations.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block pb-1">Your Responsibilities as a User
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Account Security
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">You are responsible for maintaining the confidentiality of your OTPs and wallet balance. Do not share your login credentials with anyone.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Respectful Conduct
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Astrologers are respectable scholars. Abusive language, threats, or inappropriate behavior during a chat/call will result in a permanent ban.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">No Direct Transactions
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Attempting to bypass the platform by asking astrologers for their personal phone numbers or offering direct payments is strictly prohibited.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Accurate Information
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Astrology relies heavily on exact birth details. Providing incorrect time or place of birth will lead to inaccurate readings, which cannot be refunded.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-orange-900 mb-2">Wallet & Payment Security</h3>
            <p className="text-orange-800 text-[14.5px] leading-relaxed font-medium">
              All transactions on Astrology in Bharat are processed through secure, RBI-approved payment gateways. Your consultation fees are deducted per-minute from your wallet only while the call or chat is actively connected. If a call drops due to a technical error, the deduction stops automatically, ensuring fair usage.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block whitespace-nowrap pb-1">Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Can I ask an astrologer for medical diagnosis?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  No. While medical astrology can indicate planetary weaknesses related to health, our astrologers are not licensed doctors. You must always consult a medical professional for health issues.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">What happens if I don't like the astrologer's prediction?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Astrology reveals both positive and challenging planetary periods. If an expert delivers an honest, negative prediction based on your chart, it is not grounds for a refund. We encourage users to seek remedies rather than just favorable answers.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
