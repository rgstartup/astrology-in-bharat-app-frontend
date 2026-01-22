"use client";

import NextLink from "next/link";
const Link = NextLink as any;

import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { toast } from "react-toastify";

interface Astrologer {
  id?: number | string;
  userId?: number | string;
  image: string;
  name: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  video?: string;
  ratings?: number;
  is_available?: boolean;
  total_likes?: number;
  custom_services?: { id: string; name: string; price: number; unit: string }[];
}

interface AstrologerCardProps {
  astrologerData: Astrologer;
  cardClassName?: string;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  astrologerData,
  cardClassName = "",
}) => {
  const {
    id,
    userId,
    image,
    name,
    expertise,
    experience,
    language,
    price,
    chat_price,
    call_price,
    video_call_price,
    report_price,
    horoscope_price,
    video,
    ratings = 0,
    is_available,
    total_likes = 0,
    custom_services = [],
  } = astrologerData;

  const [show, setShow] = useState(false);
  const [serviceIndex, setServiceIndex] = useState(0);
  const { isExpertInWishlist, toggleExpertWishlist } = useWishlist();
  const { isClientAuthenticated } = useClientAuth();
  const router = useRouter();

  // Local state for optimistic updates
  const [currentLikes, setCurrentLikes] = useState(total_likes);

  // Sync with prop if it changes
  React.useEffect(() => {
    setCurrentLikes(total_likes);
  }, [total_likes]);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  };

  const videoId = video ? getYoutubeId(video) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : video;

  // For wishlist, we use userId (user table ID)
  const wishlistTargetId = userId ? Number(userId) : Number(id);
  const isLiked = wishlistTargetId ? isExpertInWishlist(wishlistTargetId) : false;

  // For chat/consultation, we use id (expert profile ID)
  const expertProfileId = Number(id);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isClientAuthenticated) {
      toast.error("Please login first to use wishlist", {
        onClick: () => router.push("/sign-in"),
        autoClose: 3000,
        style: { cursor: "pointer" },
      });
      return;
    }

    // Optimistic Update
    const newIsLiked = !isLiked;
    setCurrentLikes((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await toggleExpertWishlist(wishlistTargetId);
    } catch (error) {
      // Revert on failure
      setCurrentLikes((prev) => (newIsLiked ? prev - 1 : prev + 1));
      console.error("Failed to toggle wishlist", error);
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use expert profile ID for chat
    router.push(`/chat/prep/${expertProfileId}`);
  };

  const createDetailsUrl = () => (id ? `/astrologer/${id}` : "#");

  // Combine expertise and custom services for display
  const allServices = [
    expertise,
    ...custom_services.map(s => s.name)
  ].filter(Boolean);

  const displayServices = allServices.slice(0, 3);
  const remainingCount = allServices.length - 3;

  return (
    <div className="grid-item">
      <div className={`astro-card ${cardClassName}`}>
        <Link href={createDetailsUrl()}>
          {/* IMAGE SECTION */}
          <div className="relative flex justify-center pt-8">
            {/* ❤️ LIKE & COUNT — TOP LEFT (OUTSIDE IMAGE) */}
            <div className="absolute top-2 left-3 z-20 flex flex-col items-center gap-1">
              <button
                onClick={handleLike}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition"
              >
                <i
                  className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`}
                  style={{ color: isLiked ? "#ff4d4d" : "#555" }}
                />
              </button>
              {/* Total Likes Count */}
              {currentLikes > 0 && (
                <span className="text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {currentLikes}
                </span>
              )}
            </div>

            {/* 🟢 ONLINE / OFFLINE — TOP RIGHT (OUTSIDE IMAGE) */}
            <div
              className={`absolute top-2 right-3 z-20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-md
              ${is_available
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              <i
                className={`fa-solid fa-circle ${is_available ? "text-green-500" : "text-gray-400"
                  }`}
              />
              {is_available ? "Online" : "Offline"}
            </div>

            {/* PROFILE IMAGE */}
            <div className="relative">
              <img
                src={image}
                alt={name}
                className="astro-profile-img"
              />

              {/* ▶ PLAY VIDEO */}
              <span
                className="
    absolute 
    top-[85%] 
    left-[60%] 
    -translate-x-1/2 
    -translate-y-1/2 
    text-white 
    text-5xl 
    cursor-pointer 
    z-10 
    drop-shadow-lg
    transition-all
    duration-300
    hover:text-orange-500
    hover:scale-110
  "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShow(true);
                }}
              >
                <i className="fa-solid fa-circle-play" />
              </span>


            </div>
          </div>

          {/* RATING */}
          <div
            className="rating-star d-flex justify-content-center align-items-center text-center"
            style={{ gap: 6, fontSize: "1.05rem", padding: "12px 16px 0" }}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const starIndex = i + 1;
              if (ratings >= starIndex)
                return <i key={i} className="fa-solid fa-star color-secondary" />;
              if (ratings >= starIndex - 0.5)
                return (
                  <i
                    key={i}
                    className="fa-solid fa-star-half-stroke color-secondary"
                  />
                );
              return (
                <i
                  key={i}
                  className="fa-regular fa-star"
                  style={{ color: "#ccc" }}
                />
              );
            })}
            <span className="text-muted small ms-2">
              {ratings.toFixed(1)} / 5
            </span>
          </div>


          {/* DETAILS */}
          {/* Name */}
          <div className="px-4 pt-2 pb-1 text-[18px] font-semibold text-[#301118]">
            {name}
          </div>

          {/* Expertise Tag */}
          <div className="px-4 mt-1 relative group h-7">
            {/* Show arrows only if more than 2 services */}
            {allServices.length > 2 && (
              <>
                {/* Left Scroll Arrow */}
                {serviceIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setServiceIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full w-5 h-5 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white text-gray-700 border border-gray-100"
                  >
                    <i className="fa-solid fa-chevron-left text-[10px]" />
                  </button>
                )}

                {/* Right Scroll Arrow */}
                {serviceIndex + 2 < allServices.length && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setServiceIndex((prev) => Math.min(allServices.length - 2, prev + 1));
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full w-5 h-5 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white text-gray-700 border border-gray-100"
                  >
                    <i className="fa-solid fa-chevron-right text-[10px]" />
                  </button>
                )}
              </>
            )}

            {/* Services Container */}
            <div className={`flex gap-1 justify-center ${allServices.length > 2 ? 'px-6' : ''}`}>
              {(allServices.length > 2
                ? allServices.slice(serviceIndex, serviceIndex + 2)
                : allServices
              ).map((service, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap inline-block bg-[#fd6410] text-white text-[12px] px-2 py-0.5 rounded-full flex-shrink-0 animate-fadeIn"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="px-4 my-2 text-[16px] text-[#1a1a1a]">
            <strong>Exp:</strong>
            <span className="ml-2 font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {experience} Years
            </span>
          </div>

          {/* Language */}
          <div className="px-4 my-2 text-[16px] text-[#1a1a1a]">
            <strong>Lang:</strong>
            <span className="ml-2 font-semibold bg-gray-100 px-2 py-0.5 rounded">
              {language}
            </span>
          </div>
        </Link>

        {/* ACTION BUTTONS WITH PRICES POINTER */}
        <div className="px-4 pb-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleChatClick}
              className="flex-1 py-1.5 bg-orange-500 text-white text-[13px] font-bold rounded-full flex flex-col items-center justify-center leading-tight hover:bg-orange-600 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <i className="fa-regular fa-comment-dots" /> Chat
              </div>
              <span className="text-[11px] opacity-90 font-medium">
                {chat_price && chat_price > 0 ? `₹${chat_price}/min` : (price > 0 ? `₹${price}/min` : "Free")}
              </span>
            </button>

            <button
              onClick={handleChatClick}
              className="flex-1 py-1.5 bg-orange-500 text-white text-[13px] font-bold rounded-full flex flex-col items-center justify-center leading-tight hover:bg-orange-600 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-phone-volume" /> Call
              </div>
              <span className="text-[11px] opacity-90 font-medium">
                {call_price && call_price > 0 ? `₹${call_price}/min` : (price > 0 ? `₹${price}/min` : "Free")}
              </span>
            </button>
          </div>

          <button
            onClick={handleChatClick}
            className="w-full py-1.5 bg-orange-500 text-white text-[13px] font-bold rounded-full flex flex-col items-center justify-center leading-tight hover:bg-orange-600 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-video" /> Video Call
            </div>
            <span className="text-[11px] opacity-90 font-medium">
              {video_call_price && video_call_price > 0 ? `₹${video_call_price}/min` : (price > 0 ? `₹${price * 2}/min` : "Free")}
            </span>
          </button>
        </div>
      </div>

      {/* VIDEO MODAL */}
      <Modal show={show} onHide={() => setShow(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Meet Astrologer {name} Introduction Video
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {video ? (
            videoId ? (
              <iframe
                width="100%"
                height="500"
                src={embedUrl}
                title={`Astrologer ${name} Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={video}
                width="100%"
                height="500"
                controls
                className="bg-black"
              />
            )
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded">
              <div className="text-center">
                <i className="fa-solid fa-video-slash text-5xl text-gray-400 mb-3" />
                <p className="text-gray-500">No introduction video available yet.</p>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AstrologerCard;
