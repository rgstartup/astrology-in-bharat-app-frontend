"use client";

import React, { useEffect, useState } from "react";
import { getSupportSettings, SupportSettings } from "@/libs/api-profile";
import Image from "next/image";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import { Loading } from "@repo/ui";
import ContactSeoContent from "./contact-seo.component";

const HelpSupportPage = () => {
  const [supportSettings, setSupportSettings] = useState<SupportSettings>({
    email: 'support@astrologyinbharat.com',
    phone: '+919876543210',
    whatsapp: '+919876543210'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const [data] = await getSupportSettings();
        if (data) {
          setSupportSettings(data);
        }
      } catch (error) {
        console.error("Failed to load support settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSupport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center">
        <Loading size="lg" text="Loading Support Center..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] pb-20 pt-6 overflow-hidden font-sans">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 lg:px-12">
        
        {/* --- Hero Banner --- */}
        <div className="relative w-full rounded-xl md:rounded-3xl lg:rounded-[24px] overflow-hidden bg-[#2d0f0c] shadow-xl flex flex-col md:flex-row items-stretch border border-[#ffb286]/20 mb-8">
            
            {/* Image Section (Top on mobile, Right on desktop) */}
            <div className="w-full md:w-[55%] h-[240px] md:h-auto md:min-h-[340px] lg:min-h-[360px] relative order-1 md:order-2 bg-[#2d0f0c]">
              {/* Soft fade overlay to blend with left background exactly like Famous Temples */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2d0f0c] from-0% via-[#2d0f0c]/80 via-10% md:via-15% to-transparent to-25% md:to-40% z-10" />
              <Image
                src="/images/contact-bg-clean.jpg"
                alt="Help and Support Center"
                fill
                priority
                className="object-cover object-center brightness-[0.85]"
              />
            </div>

            {/* Content Section (Bottom on mobile, Left on desktop) */}
            <div className="w-full md:w-[50%] p-6 md:p-10 lg:p-12 z-20 order-2 md:order-1 flex flex-col justify-center relative -mt-10 md:mt-0">
              
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#ffb286] border border-[#ffb286]/30 rounded-full w-fit mx-auto md:mx-0 backdrop-blur-sm shadow-sm">
                <i className="fa-solid fa-headset text-[10px]"></i>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Help & Support Center</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-serif font-bold text-white mb-1 text-center md:text-left drop-shadow-md leading-tight">
                Need Help?
              </h1>
              
              <div className="flex flex-col items-center md:items-start mb-3">
                <h2 className="text-[#ffb286] text-xl md:text-2xl lg:text-[22px] font-serif mb-2 text-center md:text-left drop-shadow-md">
                  We're Here For You!
                </h2>
                {/* Decorative divider */}
                <div className="w-32 h-[1px] bg-gradient-to-r from-[#ffb286]/80 via-[#ffb286]/30 to-transparent hidden md:block mb-1"></div>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ffb286]/80 to-transparent md:hidden mb-1"></div>
              </div>
              
              <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-0 text-center md:text-left max-w-md mx-auto md:mx-0 drop-shadow-md">
                Our support team is available 24x7 to assist you with any queries or concerns.
              </p>
            </div>
            
        </div>

        {/* --- 4 Contact Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-20">
          
          {/* Email */}
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-orange hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-orange/10 text-orange flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-envelope-open-text text-2xl"></i>
            </div>
            <h3 className="text-lg font-black text-[#32131b] mb-2">Email Support</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">Drop us an email anytime.<br/>We'll get back to you.</p>
            <p className="text-sm font-bold text-orange mb-6 truncate px-2" title={supportSettings.email}>{supportSettings.email}</p>
            <a href={`mailto:${supportSettings.email}`} className="inline-block w-full py-3 rounded-xl border-2 border-orange/20 text-orange font-bold text-sm hover:bg-orange hover:text-white transition-colors">
              <i className="fa-solid fa-envelope mr-2"></i> Send Email
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-orange hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
              <i className="fa-brands fa-whatsapp text-3xl"></i>
            </div>
            <h3 className="text-lg font-black text-[#32131b] mb-2">WhatsApp Support</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">Chat with us on WhatsApp<br/>for quick support.</p>
            <p className="text-sm font-bold text-green-500 mb-6">{supportSettings.whatsapp}</p>
            <a href={`https://wa.me/${(supportSettings.whatsapp || "").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-block w-full py-3 rounded-xl border-2 border-green-500/20 text-green-600 font-bold text-sm hover:bg-green-500 hover:text-white transition-colors">
              <i className="fa-brands fa-whatsapp mr-2"></i> Chat Now
            </a>
          </div>

          {/* Call */}
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-orange hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-phone-volume text-2xl"></i>
            </div>
            <h3 className="text-lg font-black text-[#32131b] mb-2">Call Support</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">Speak with our support<br/>executive anytime.</p>
            <p className="text-sm font-bold text-blue-500 mb-6">{supportSettings.phone}</p>
            <a href={`tel:${supportSettings.phone}`} className="inline-block w-full py-3 rounded-xl border-2 border-blue-500/20 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors">
              <i className="fa-solid fa-phone mr-2"></i> Call Now
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-orange hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-amber-600/10 text-amber-600 flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-circle-question text-3xl"></i>
            </div>
            <h3 className="text-lg font-black text-[#32131b] mb-2">FAQ Center</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">Find answers to commonly<br/>asked questions.</p>
            <p className="text-sm font-bold text-amber-600 mb-6 invisible">Placeholder</p>
            <Link href="/faq" className="inline-block w-full py-3 rounded-xl border-2 border-amber-600/20 text-amber-600 font-bold text-sm hover:bg-amber-600 hover:text-white transition-colors">
              <i className="fa-solid fa-book-open mr-2"></i> Browse FAQ
            </Link>
          </div>

        </div>



        {/* --- Additional Resources --- */}
        <div className="mb-16 bg-[#fdf3eb] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
           <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none">
              <i className="fa-solid fa-lotus text-[180px] text-orange"></i>
           </div>
           
           <div className="md:w-1/3 relative z-10 text-center md:text-left">
              <h2 className="text-2xl font-black text-[#32131b] mb-2">Additional Resources</h2>
              <p className="text-sm font-medium text-gray-500">Important policies and information</p>
           </div>
           
           <div className="md:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {[
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Refund & Cancellation Policy", href: "/refund-policy" },
                { label: "About Us", href: "/about" },
              ].map((link, idx) => (
                <Link key={idx} href={link.href} className="bg-white px-6 py-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
                        <i className="fa-solid fa-check"></i>
                     </div>
                     <span className="text-sm font-bold text-[#32131b]">{link.label}</span>
                   </div>
                   <i className="fa-solid fa-chevron-right text-orange text-xs group-hover:translate-x-1 transition-transform"></i>
                </Link>
              ))}
           </div>
        </div>

        {/* --- Bottom Banner --- */}
        <div className="bg-gradient-to-r from-[#2c0b11] to-[#4a131b] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-white shadow-2xl">
           {/* Decorative background circle */}
           <div className="absolute right-0 top-0 w-64 h-64 border-[40px] border-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
           
           <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                 <i className="fa-solid fa-headset text-4xl text-orange"></i>
              </div>
              <div>
                 <h2 className="text-2xl md:text-3xl font-black mb-2">Still Have Questions?</h2>
                 <h3 className="text-2xl md:text-3xl font-black text-orange mb-3">We're Just a Message Away!</h3>
                 <p className="text-white/80 font-medium text-sm">Our support team is available 24x7 to help you.</p>
              </div>
           </div>
           
           <div className="flex flex-col items-center md:items-end gap-3 relative z-10 shrink-0">
              <a href={`mailto:${supportSettings.email}`} className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-orange/20 transition-all flex items-center gap-2">
                 <i className="fa-solid fa-comment-dots"></i> Contact Support Now
              </a>
              <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                 <i className="fa-solid fa-shield-check"></i> Safe & Secure Support
              </div>
           </div>
        </div>
        


        {/* --- SEO Section --- */}
        <ContactSeoContent />

      </div>
    </div>
  );
};

export default HelpSupportPage;
