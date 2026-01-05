"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api/v1";

interface ExpertProfile {
  id: number;
  user: {
    id: number;
    name: string;
  };
  specialization: string;
  experience_in_years: number;
  languages: string[];
  price: number;
  rating: number;
  is_available: boolean;
}

const AstrologerList = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchAstrologers = useCallback(async (currentOffset: number, isLoadMore: boolean = false) => {
    if (loading || (!hasMore && isLoadMore)) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/expert/profile/list`, {
        params: {
          limit,
          offset: currentOffset,
        },
      });

      const { data, pagination } = response.data;

      const mappedData = data.map((item: ExpertProfile) => ({
        id: item.id,
        image: "/images/astro-img1.png", // Default image
        ratings: Math.round(item.rating) || 5,
        name: item.user.name || "Astrologer",
        expertise: item.specialization || "Vedic Astrology",
        experience: item.experience_in_years || 0,
        language: item.languages.join(", ") || "Hindi",
        price: item.price || 0,
        video: "https://www.youtube.com/embed/INoPh_oRooU", // Default video
        modalId: `home-modal-${item.id}`,
      }));

      if (isLoadMore) {
        setAstrologers((prev) => [...prev, ...mappedData]);
      } else {
        setAstrologers(mappedData);
      }
      setHasMore(pagination.hasMore);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchAstrologers(0);
  }, []);

  const handleScroll = useCallback(() => {
    if (!cardScrollRef.current || loading || !hasMore) return;

    const { scrollLeft, scrollWidth, clientWidth } = cardScrollRef.current;
    // If we're within 300px of the end, load more
    if (scrollLeft + clientWidth >= scrollWidth - 300) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchAstrologers(nextOffset, true);
    }
  }, [offset, loading, hasMore, fetchAstrologers]);

  useEffect(() => {
    const scrollEl = cardScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      return () => scrollEl.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const scrollCards = (direction: "left" | "right") => {
    if (cardScrollRef.current) {
      const { current } = cardScrollRef;
      const scrollAmount = 300; // Scrolls approximately one card width
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="astrologer-list back-img">
      <div className="container">
        <h2 className="title-line color-light">
          <span>Find Your Astrologer</span>
        </h2>
        <div className="row align  ">
          <div className="col-sm-5">
            <div className="search-box">
              <input
                type="text"
                className="bg-white"
                placeholder="Search Astrologer, Type, Language..."
              />
              <button>Search</button>
            </div>
          </div>
          <div className="col-sm-3 text-end">
            <a href="#" className="filter-btn">
              <i className="fa-solid fa-filter"></i> Filter
            </a>
            <a href="#" className="filter-btn sort-btn">
              <i className="fa-solid fa-sort"></i> Sort
            </a>
          </div>
          <div className="col-sm-4 d-flex align-items-center">
            <button
              onClick={() => scroll("left")}
              className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full mr-2 hover:bg-[#fd64101a] transition flex-shrink-0"
              style={{
                width: "30px",
                height: "30px",
                border: "none",
                background: "transparent",
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div
              className="flex gap-2.5 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2.5 [&::-webkit-scrollbar]:hidden w-full px-1"
              id="list-slider"
              ref={scrollContainerRef}
            >
              <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                Numerology
              </div>
              <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                Vedic
              </div>
              <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                Zodiac Compatibility
              </div>
              <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                Astrocartography
              </div>
              <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                Lunar Node Analysis
              </div>
            </div>
            <button
              onClick={() => scroll("right")}
              className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full ml-2 hover:bg-[#fd64101a] transition flex-shrink-0"
              style={{
                width: "30px",
                height: "30px",
                border: "none",
                background: "transparent",
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center relative mt-4">
          <button
            onClick={() => scrollCards("left")}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
            style={{ background: "transparent" }}
          >
            <i className="fa-solid fa-chevron-left fa-2x"></i>
          </button>

          <div
            className="flex-1 min-w-0 flex overflow-x-auto gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden py-4"
            ref={cardScrollRef}
          >
            {astrologers.length > 0 ? (
              astrologers.map((item) => (
                <React.Fragment key={item.id}>
                  <div className="grid-item">
                    <Link
                      href={{
                        pathname: "/astrologer-details",
                        query: {
                          id: item.id,
                        },
                      }}
                      className="text-decoration-none"
                    >
                      <div className="astro-card min-w-[300px]">
                        <div className="vid-part">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="astro-profile-img"
                          />
                          <span
                            className="play-vid fa-beat"
                            data-bs-toggle="modal"
                            data-bs-target={`#${item.modalId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <i className="fa-solid fa-circle-play"></i>
                          </span>
                        </div>
                        <div className="rating-star">{"★".repeat(item.ratings)}</div>
                        <div className="astro-name">{item.name}</div>
                        <div className="astro-tags">{item.expertise}</div>
                        <div className="astro-info">
                          <strong>Exp:</strong> {item.experience} Years
                        </div>
                        <div className="astro-info">
                          <strong>Lang:</strong> {item.language}
                        </div>
                        <div className="astro-info">
                          <strong>Price:</strong> ₹{item.price}/min
                        </div>
                        <div className="astro-actions">
                          <button>
                            <i className="fa-regular fa-comment-dots"></i> Chat
                          </button>
                          <button className="call">
                            <i className="fa-solid fa-phone-volume"></i> Call
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Modal */}
                  <div
                    className="modal fade"
                    id={item.modalId}
                    tabIndex={-1}
                    aria-labelledby={`${item.modalId}Label`}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4
                            className="modal-title-astro-about"
                            id={`${item.modalId}Label`}
                          >
                            Meet Astrologer {item.name} Introduction Video
                          </h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <div className="modal-body">
                          <iframe
                            width="100%"
                            height="500"
                            src={item.video}
                            title={`${item.name} Introduction Video`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : !loading && (
              <div className="w-full text-center py-10 text-white">
                No astrologers found.
              </div>
            )}

            {loading && (
              <div className="d-flex align-items-center justify-content-center min-w-[200px]">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollCards("right")}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
            style={{ background: "transparent" }}
          >
            <i className="fa-solid fa-chevron-right fa-2x"></i>
          </button>
        </div>

        <div className="view-all">
          <Link href="/our-astrologers" className="btn-link wfc m-auto">
            <i className="fa-regular fa-user"></i> View All Astrologers
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AstrologerList
