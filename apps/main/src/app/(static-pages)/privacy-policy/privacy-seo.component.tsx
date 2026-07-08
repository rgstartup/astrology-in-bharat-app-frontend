import React from "react";

export default function PrivacySeoContent() {
  return (
    <section className="not-prose pt-0 pb-10 md:pb-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-8 rounded-[3px]">
          
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#F26500] inline-flex pb-2">
            <i className="fa-solid fa-user-lock text-[#F26500]"></i> Your Privacy is Our Highest Priority
          </h2>
          
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6 font-medium">
            At Astrology in Bharat, we understand that seeking astrological guidance requires sharing the most intimate details of your life. Whether you are discussing marital disputes, financial crises, or mental health struggles, we believe that your secrets should remain strictly between you, your astrologer, and the cosmos. 
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-blue-900 mb-2">🛡️ How We Protect Your Kundali Details</h3>
            <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
              Your exact Date, Time, and Place of birth are highly sensitive markers of your identity. When you generate a Kundali or consult an expert on our platform, this data is encrypted using advanced military-grade algorithms. Astrologers can view your chart to provide predictions, but they <strong>cannot</strong> download, export, or access your phone number or email address.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block pb-1">
              📊 What Data Do We Actually Collect?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-address-card"></i> Profile Information
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Basic details like your Name, Phone Number (for OTP login), and Email Address to manage your wallet and send consultation receipts.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-star-and-crescent"></i> Astrological Data
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Birth details required to cast your horoscope. You can delete your saved profiles at any time from your dashboard.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-credit-card"></i> Payment Information
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">We do NOT store your credit card or UPI PINs. All transactions are securely processed by RBI-regulated third-party gateways.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-comments"></i> Consultation Records
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Chat transcripts and call logs are securely archived solely for quality assurance, dispute resolution, and your future reference.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-orange-900 mb-2">🤝 Do We Sell Your Data?</h3>
            <p className="text-orange-800 text-[14.5px] leading-relaxed font-medium">
              <strong>Absolutely Not.</strong> We have a zero-tolerance policy towards data trading. Your personal information, astrological charts, and contact details are never sold, rented, or shared with third-party marketing agencies, insurance companies, or data brokers.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block whitespace-nowrap pb-1">
              ❓ Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Can the astrologer see my phone number?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  No. We use a secure cloud-telephony system. When you initiate a call, our system connects you and the astrologer via a masked bridge. Your actual phone number remains 100% hidden from the expert.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Can I delete my account and all associated data?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Yes. Under the Data Protection laws, you have the right to be forgotten. You can request full account deletion from your profile settings, and all your birth data and chat histories will be permanently wiped from our active servers.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
