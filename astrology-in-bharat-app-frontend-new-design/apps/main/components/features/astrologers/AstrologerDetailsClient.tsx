"use client";

import React, { useState } from "react";
import Link from "next/link";
import { products } from "@/components/features/services/homePagaData";
import { useRouter } from "next/navigation";
import ReviewModal from "@/components/ui/modals/ReviewModal";
import NextImage from "next/image";
import { X } from "lucide-react";

const Image = NextImage as any;
const NextLink = Link as any;
const XIcon = X as any;

interface AstrologerData {
  id: string | number;
  name: string;
  image: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
  ratings: number;
}

export default function AstrologerDetailsClient({
  astrologer,
}: {
  astrologer: AstrologerData;
}) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'reviews' | 'gallery' | 'videos'>('about');
  const router = useRouter();

  const handleChatClick = () => {
    router.push("/user-detail-form");
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Profile Card */}
          <div className="w-full lg:w-[320px] xl:w-[360px] max-w-sm mx-auto lg:mx-0 shrink-0">
            <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[32px] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] hover:border-[#fd6410]/30 hover:-translate-y-1 group">
              <div className="relative pt-6 pb-2 flex flex-col items-center">
                {/* Top Rated Badge */}
                <div className="absolute top-4 right-6 bg-[#fd6410]/10 text-[#fd6410] px-3 py-1 rounded-full flex items-center gap-1 border border-[#fd6410]/20">
                  <i className="fa-solid fa-certificate text-[12px]"></i>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Top Rated</span>
                </div>

                {/* Profile Image & Play Button */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#fd6410] via-[#fd6410]/40 to-transparent">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative shadow-inner">
                      <Image
                        src={astrologer.image}
                        alt={astrologer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="absolute bottom-1 right-1 bg-[#fd6410] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  >
                    <i className="fa-solid fa-play text-[12px]"></i>
                  </button>
                </div>

                {/* Name & Title */}
                <div className="mt-2 text-center px-6">
                  <h2 className="text-xl font-bold text-[#1A2B47]">{astrologer.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{astrologer.expertise}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mx-6 p-3 bg-white/80 backdrop-blur-sm rounded-2xl flex justify-around items-center border border-slate-100 shadow-sm">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Experience</p>
                  <p className="text-sm font-semibold text-[#1A2B47]">{astrologer.experience} Years</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm font-semibold text-[#1A2B47]">{astrologer.ratings}</span>
                    <i className="fa-solid fa-star text-[#fd6410] text-[12px]"></i>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Price</p>
                  <p className="text-sm font-semibold text-emerald-600">₹{astrologer.price}/min</p>
                </div>
              </div>

              {/* Details */}
              <div className="px-8 py-4 space-y-2">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-language text-slate-400 text-[18px] w-5 text-center"></i>
                  <p className="text-sm text-slate-600"><span className="font-bold text-gray-900">Languages:</span> {astrologer.language}</p>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-brain text-slate-400 text-[18px] w-5 text-center"></i>
                  <p className="text-sm text-slate-600"><span className="font-bold text-gray-900">Expertise:</span> {astrologer.expertise}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleChatClick}
                    className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-semibold active:scale-95 transition-all hover:bg-green-100 shadow-sm text-xs"
                  >
                    <i className="fa-solid fa-phone text-[12px]"></i>
                    Call
                  </button>
                  <button
                    onClick={handleChatClick}
                    className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-lg font-semibold active:scale-95 transition-all hover:bg-blue-100 shadow-sm text-xs"
                  >
                    <i className="fa-solid fa-video text-[12px]"></i>
                    Video Call
                  </button>
                </div>
                <button
                  onClick={handleChatClick}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 bg-[#fd6410] text-white border border-[#fd6410] py-2 rounded-lg font-semibold active:scale-95 transition-all hover:bg-[#e35605] shadow-sm text-xs"
                >
                  <i className="fa-solid fa-comments text-[14px]"></i>
                  Chat Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="w-full flex-1">
            <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[24px] border border-[#fd6410]/30 p-6 lg:p-8 h-full shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] hover:border-[#fd6410] hover:-translate-y-1">
              <div className="flex items-center justify-between border-b border-[#fd6410]/10 pb-4 mb-6">
                <h4 className="text-xl font-bold text-gray-900">Profile Details</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-600 text-xs font-semibold uppercase tracking-wide">Online</span>
                </div>
              </div>

              {/* Interactive Tabs */}
              <div className="flex gap-6 border-b border-gray-100 mb-6">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === 'about' ? 'text-gray-900 border-b-2 border-[#fd6410]' : 'text-gray-500 hover:text-[#fd6410]'
                    }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === 'experience' ? 'text-gray-900 border-b-2 border-[#fd6410]' : 'text-gray-500 hover:text-[#fd6410]'
                    }`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === 'reviews' ? 'text-gray-900 border-b-2 border-[#fd6410]' : 'text-gray-500 hover:text-[#fd6410]'
                    }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === 'gallery' ? 'text-gray-900 border-b-2 border-[#fd6410]' : 'text-gray-500 hover:text-[#fd6410]'
                    }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === 'videos' ? 'text-gray-900 border-b-2 border-[#fd6410]' : 'text-gray-500 hover:text-[#fd6410]'
                    }`}
                >
                  Videos
                </button>
              </div>

              {/* Dynamic Content Area */}
              <div className="min-h-[160px] mb-8">
                {activeTab === 'about' && (
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p>
                      <span className="font-bold text-gray-900">Acharya {astrologer.name}</span> is a distinguished expert with profound knowledge in
                      <span className="font-semibold text-[#fd6410]"> Vedic Astrology</span>,
                      <span className="font-semibold text-[#fd6410]"> Nadi Shastra</span>, and
                      <span className="font-semibold text-[#fd6410]"> Crystal Healing</span>.
                      With over {astrologer.experience} years of dedicated practice, they have guided countless individuals towards clarity and success.
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      Specializes in relationship counseling, career guidance, and remedial measures using ancient Vedic wisdom.
                    </p>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[200px] overflow-y-auto pr-1">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex gap-3">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#fd6410] shrink-0"></div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Senior Vedic Astrologer</h5>
                          <p className="text-xs text-gray-500 font-medium">Astrology In Bharat • 2020 - Present</p>
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">Provided accurate predictions for over 5000+ clients globally specializing in career and marriage.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex gap-3">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-400 shrink-0"></div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Certified Vastu Consultant</h5>
                          <p className="text-xs text-gray-500 font-medium">Varanasi Vedic Institute • 2015 - 2020</p>
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">Conducted onsite Vastu audits for residential and commercial properties.</p>
                        </div>
                      </div>
                    </div>

                    {/* Dummy item to demonstrate scrolling if needed, or just keep the 2 as requested but strictly following the card layout */}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-gray-900">Priya Sharma</span>
                        <div className="flex text-[#fd6410] text-[10px]">
                          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"The prediction was 100% accurate. I am very satisfied with the remedies provided."</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-gray-900">Rahul Verma</span>
                        <div className="flex text-[#fd6410] text-[10px]">
                          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-regular fa-star"></i>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"Great experience, Acharya ji listened to my problems very patiently."</p>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[280px] overflow-y-auto pr-1">
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <Image src="/images/astro-img1.png" alt="Gallery 1" fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fa-solid fa-magnifying-glass text-white"></i>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <Image src="/images/astro-img2.png" alt="Gallery 2" fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fa-solid fa-play text-white"></i>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <Image src="/images/astro-img3.png" alt="Gallery 3" fill className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <Image src="/images/astro-img1.png" alt="Gallery 4" fill className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <Image src="/images/astro-img2.png" alt="Gallery 5" fill className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group flex items-center justify-center bg-gray-50">
                      <span className="text-xs text-gray-400 font-medium cursor-pointer hover:text-[#fd6410] transition-colors">Load More</span>
                    </div>
                  </div>
                )}

                {activeTab === 'videos' && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[280px] overflow-y-auto pr-1">
                    <div onClick={() => setIsVideoModalOpen(true)} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group cursor-pointer bg-black">
                      <Image src="/images/astro-img1.png" alt="Video 1" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#fd6410] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-play text-xs pl-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div onClick={() => setIsVideoModalOpen(true)} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group cursor-pointer bg-black">
                      <Image src="/images/astro-img2.png" alt="Video 2" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-lg group-hover:bg-[#fd6410] transition-all">
                          <i className="fa-solid fa-play text-xs pl-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div onClick={() => setIsVideoModalOpen(true)} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group cursor-pointer bg-black">
                      <Image src="/images/astro-img3.png" alt="Video 3" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-lg group-hover:bg-[#fd6410] transition-all">
                          <i className="fa-solid fa-play text-xs pl-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div onClick={() => setIsVideoModalOpen(true)} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group cursor-pointer bg-black">
                      <Image src="/images/astro-img1.png" alt="Video 4" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-lg group-hover:bg-[#fd6410] transition-all">
                          <i className="fa-solid fa-play text-xs pl-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div onClick={() => setIsVideoModalOpen(true)} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group cursor-pointer bg-black">
                      <Image src="/images/astro-img2.png" alt="Video 5" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-lg group-hover:bg-[#fd6410] transition-all">
                          <i className="fa-solid fa-play text-xs pl-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group flex items-center justify-center bg-gray-50">
                      <span className="text-xs text-gray-400 font-medium cursor-pointer hover:text-[#fd6410] transition-colors">Load More</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                <button className="flex-1 min-w-[140px] px-6 py-3 bg-[#fd6410] text-white rounded-xl hover:bg-[#e35605] transition-colors font-semibold text-sm shadow-[#fd6410]/20 shadow-lg active:scale-95 flex items-center justify-center gap-2">
                  <i className="fa-regular fa-bell"></i>
                  Notify Me
                </button>
                <button className="flex-1 min-w-[140px] px-6 py-3 border border-[#fd6410] text-[#fd6410] rounded-xl hover:bg-[#fd6410]/5 transition-colors font-semibold text-sm flex items-center justify-center gap-2 active:scale-95">
                  <i className="fa-regular fa-envelope"></i>
                  Message
                </button>
              </div>
              <p className="text-[11px] text-[#fd6410] flex items-center gap-2 py-2.5 px-4 bg-[#fd6410]/5 rounded-xl border border-[#fd6410]/20">
                <i className="fa-solid fa-circle-info"></i>
                Get an email alert instantly when the astrologer comes online.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 my-12">
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          {/* Birth Details Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 h-full">
            <h4 className="text-xl mb-6 font-medium text-center lg:text-left">
              <span className="text-gray-900 font-bold">Please share your birth details:-</span>
            </h4>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fd6410] focus:border-transparent outline-none transition-all"
                    placeholder="Enter Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fd6410] focus:border-transparent outline-none transition-all"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fd6410] focus:border-transparent outline-none transition-all"
                    placeholder="Mobile"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date Of Birth <span className="text-red-500">*</span>
                  </label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fd6410] focus:border-transparent outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Birth Time <span className="text-red-500">*</span>
                  </label>
                  <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fd6410] focus:border-transparent outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Birth Place <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fd6410] focus:border-transparent outline-none transition-all"
                    placeholder="Birth Place"
                    required
                  />
                </div>
              </div>
              <div className="text-right mt-6">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#fd6410] text-white rounded-lg hover:bg-[#e35605] transition-colors font-semibold shadow-md active:scale-95 transform duration-150"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>


        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={() => setIsReviewModalOpen(false)}
      />

      {/* Astrology Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10 text-gray-900">
            Astrology <span className="text-[#fd6410]">Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                title: "Original Rudraksha Mala",
                price: "₹1,499",
                image: "/images/astro-img1.png",
                description: "Authentic 5 Mukhi Rudraksha mala for peace and meditation."
              },
              {
                id: 2,
                title: "Vedic Astrology Guide",
                price: "₹899",
                image: "/images/astro-img2.png",
                description: "Comprehensive guide to understanding planetary movements."
              },
              {
                id: 3,
                title: "Crystal Tortoise",
                price: "₹599",
                image: "/images/astro-img3.png",
                description: "Feng Shui crystal tortoise for longevity and stability."
              },
              {
                id: 4,
                title: "Shri Yantra",
                price: "₹2,100",
                image: "/images/astro-img1.png",
                description: "Sacred geometry yantra for wealth and prosperity."
              }
            ].map((product) => (
              <div key={product.id} className="group h-full">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col p-4">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{product.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-grow">{product.description}</p>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <h5 className="text-xl font-bold text-[#fd6410]">{product.price}</h5>
                    <NextLink href="/product/id">
                      <button className="flex items-center gap-2 bg-[#fd6410] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e35605] transition-colors shadow-sm active:scale-95">
                        <i className="fas fa-shopping-cart"></i> Buy Now
                      </button>
                    </NextLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal (Custom Implementation) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="text-lg font-bold text-gray-800">
                Meet Astrologer {astrologer.name}
              </h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-0 bg-black aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={astrologer.video}
                title="Intro Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsVideoModalOpen(false)}></div>
        </div>
      )}
    </>
  );
}
