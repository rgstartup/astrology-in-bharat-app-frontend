"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";

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

interface PaginationInfo {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
}

const OurAstrologer = () => {
    const [astrologers, setAstrologers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const limit = 20;

    const fetchAstrologers = useCallback(async (currentOffset: number, isLoadMore: boolean = false) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/expert/profile/list`, {
                params: {
                    limit,
                    offset: currentOffset,
                },
            });

            const { data, pagination }: { data: ExpertProfile[]; pagination: PaginationInfo } = response.data;

            const mappedData = data.map((item) => ({
                id: item.id,
                image: "/images/astro-img1.png", // Default image as backend doesn't provide one yet
                ratings: Math.round(item.rating) || 5,
                name: item.user.name || "Astrologer",
                expertise: item.specialization || "Vedic Astrology",
                experience: item.experience_in_years || 0,
                language: item.languages.join(", ") || "Hindi",
                price: item.price || 0,
                video: "https://www.youtube.com/embed/INoPh_oRooU", // Default video
                modalId: `modal-${item.id}`,
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
    }, []);

    useEffect(() => {
        fetchAstrologers(0);
    }, [fetchAstrologers]);

    const handleLoadMore = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextOffset = offset + limit;
        setOffset(nextOffset);
        fetchAstrologers(nextOffset, true);
    };

    return (
        <section className="astrologer-list">
            <div className="container">
                <h2 className="mt-4" >Find Your Astrologer</h2>

                <div className="search-box mb-4">
                    <input
                        type="text"
                        placeholder="Search Astrologer, Type, Language..."
                    />
                    <button>Search</button>
                </div>

                {/* <!-- Astrologer Card Grid --> */}
                <div className="astro-grid">
                    {astrologers.map((item) => {
                        return (
                            <div className="grid-item" key={item.id}>
                                <Link
                                    href={{
                                        pathname: "/astrologer-details",
                                        query: {
                                            name: item.name,
                                            image: item.image,
                                            expertise: item.expertise,
                                            experience: item.experience,
                                            language: item.language,
                                            price: item.price,
                                            video: item.video,
                                            ratings: item.ratings,
                                        },
                                    }}
                                    className="text-decoration-none"
                                >
                                    <div className="astro-card">
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
                                        <div className="rating-star">
                                            {"★".repeat(item.ratings)}
                                        </div>
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

                                {/* <!-- Modal --> */}
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
                            </div>
                        );
                    })}
                </div>

                {loading && (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {hasMore && !loading && (
                    <div className="view-all mb-4">
                        <button
                            onClick={handleLoadMore}
                            className="btn-link wfc m-auto border-0 bg-transparent"
                            style={{ cursor: "pointer" }}
                        >
                            Load More Astrologers
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurAstrologer;
