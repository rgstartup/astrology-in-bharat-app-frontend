"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const TopExpertsSection: React.FC = () => {
    const [topExperts, setTopExperts] = useState<any[]>([]);
    const [expertsLoading, setExpertsLoading] = useState(false);

    useEffect(() => {
        const fetchTopExperts = async () => {
            setExpertsLoading(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
                const response = await axios.get(`${baseUrl}/api/v1/expert/top-rated?limit=3`);
                setTopExperts(response.data);
            } catch (err) {
                console.error("Failed to fetch top experts:", err);
            } finally {
                setExpertsLoading(false);
            }
        };

        fetchTopExperts();
    }, []);

    return (
        <div className="popular-astrology m-hidden pt-3">
            <h3 className="text-purple mb-3 text-left">Top Rated Experts</h3>
            <div className="row g-3">
                {expertsLoading ? (
                    <div className="col-12 text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : topExperts.length > 0 ? (
                    topExperts.map((expert, idx) => (
                        <div className="col-lg-4 col-sm-6 col-md-4 col-6" key={expert.id || idx}>
                            <div className="horoscopes-items text-center">
                                <div className="position-relative d-inline-block">
                                    <Image
                                        src={expert.user?.avatar || "/images/dummy-astrologer.jpg"}
                                        alt={expert.user?.name || "Expert"}
                                        height={80}
                                        width={80}
                                        className="rounded-circle object-cover"
                                        style={{ border: "2px solid var(--primary-color, black)", padding: "2px" }}
                                    />
                                    {expert.is_online && (
                                        <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: "12px", height: "12px" }}></span>
                                    )}
                                </div>
                                <h6 className="fw-bold mt-2 mb-1 text-truncate" style={{ fontSize: '14px' }}>
                                    {expert.user?.name || 'Expert'}
                                </h6>
                                <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                                    <i className="fa-solid fa-star text-warning" style={{ fontSize: '12px' }}></i>
                                    <small className="fw-bold">{expert.rating || '5.0'}</small>
                                </div>
                                <small
                                    className="text-muted d-block text-truncate"
                                    style={{ fontSize: "11px" }}
                                >
                                    {expert.specialization || "Astrology"}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    [1, 2, 3].map((_, idx) => (
                        <div className="col-lg-4 col-sm-6 col-md-4 col-6" key={idx}>
                            <div className="horoscopes-items text-center opacity-50">
                                <Image
                                    src="/images/dummy-astrologer.jpg"
                                    alt="placeholder"
                                    height={80}
                                    width={80}
                                />
                                <h6 className="fw-bold mt-2">Expert</h6>
                                <small className="text-muted">No Expert Found</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopExpertsSection;
