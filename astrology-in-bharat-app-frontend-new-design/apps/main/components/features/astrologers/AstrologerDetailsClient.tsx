"use client";

import React, { useState } from "react";
import Link from "next/link";
import { products } from "@/components/features/services/homePagaData";
import { useRouter } from "next/navigation";
import ReviewModal from "@/components/ui/modals/ReviewModal";
import NextImage from "next/image";
import { X } from "lucide-react";
import ProductSection from "@/components/features/shop/ProductSection";

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
  bio: string;
  detailed_experience: any[];
  gallery: string[];
  videos: string[];
}

export default function AstrologerDetailsClient({
  astrologer,
}: {
  astrologer: AstrologerData;
}) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
                    onClick={() => setSelectedVideo(astrologer.video)}
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
                    {astrologer.bio ? (
                      <p className="whitespace-pre-line">{astrologer.bio}</p>
                    ) : (
                      <p>
                        <span className="font-bold text-gray-900">Acharya {astrologer.name}</span> is a distinguished expert with profound knowledge in
                        <span className="font-semibold text-[#fd6410]"> {astrologer.expertise}</span>.
                        With over {astrologer.experience} years of dedicated practice, they have guided countless individuals towards clarity and success.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[200px] overflow-y-auto pr-1">
                    {astrologer.detailed_experience && astrologer.detailed_experience.length > 0 ? (
                      astrologer.detailed_experience.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex gap-3">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-[#fd6410] shrink-0"></div>
                            <div>
                              <h5 className="text-sm font-bold text-gray-900">{exp.title || exp.role || "Astrologer"}</h5>
                              <p className="text-xs text-gray-500 font-medium">
                                <span className="text-gray-700 font-semibold">Experience:</span>{" "}
                                {exp.organization || exp.company || "Independent"}
                                {exp.duration ? ` • ${exp.duration}` : ""}
                              </p>
                              {exp.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No specific experience details added.</p>
                    )}
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
                  <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[360px] overflow-y-auto pr-1">
                    {astrologer.gallery && astrologer.gallery.length > 0 ? (
                      astrologer.gallery.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group cursor-pointer"
                        >
                          <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-3 text-sm text-gray-500 italic text-center py-4">No gallery images available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'videos' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[320px] overflow-y-auto pr-1">
                    {astrologer.videos && astrologer.videos.length > 0 ? (
                      astrologer.videos.map((vid, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedVideo(vid)}
                          className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-black shadow-sm hover:shadow-md transition-all"
                        >
                          {/* Video */}
                          <video
                            src={vid}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                          />

                          {/* Hover Overlay + Play Icon */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 rounded-full bg-[#fd6410] flex items-center justify-center text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                              <i className="fa-solid fa-play text-lg ml-1"></i>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-sm text-gray-500 italic text-center py-4">
                        No videos available.
                      </p>
                    )}
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
          <ProductSection
            products={[
              {
                id: "1",
                name: "Original Rudraksha Mala",
                price: 1499,
                originalPrice: 2999,
                imageUrl: "/images/astro-img1.png",
                description: "Authentic 5 Mukhi Rudraksha mala for peace and meditation."
              },
              {
                id: "2",
                name: "Vedic Astrology Guide",
                price: 899,
                originalPrice: 1499,
                imageUrl: "/images/astro-img2.png",
                description: "Comprehensive guide to understanding planetary movements."
              },
              {
                id: "3",
                name: "Crystal Tortoise",
                price: 599,
                originalPrice: 999,
                imageUrl: "/images/astro-img3.png",
                description: "Feng Shui crystal tortoise for longevity and stability."
              },
              {
                id: "4",
                name: "Shri Yantra",
                price: 2100,
                originalPrice: 3500,
                imageUrl: "/images/astro-img1.png",
                description: "Sacred geometry yantra for wealth and prosperity."
              }
            ]}
          />
        </div>
      </section>

      {/* Video Modal (Custom Implementation) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full max-h-[80vh]"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="bg-white p-4 flex items-center justify-between border-t border-gray-100">
              <h4 className="text-base font-bold text-gray-800">
                Playing Video
              </h4>
              <span className="text-xs text-gray-500">Astrologer {astrologer.name}</span>
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedVideo(null)}></div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors bg-white/10 rounded-full backdrop-blur-md"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Full view"
                fill
                className="object-contain" // Use object-contain to show full image without cropping
              />
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedImage(null)}></div>
        </div>
      )}
    </>
  );
}
