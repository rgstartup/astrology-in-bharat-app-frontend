"use client";

import React, { useState } from "react";
import Link from "next/link";

// Mock Data for Sessions
const MOCK_SESSIONS = [
    {
        id: 1,
        astrologerName: "Acharya Vinod",
        astrologerImage: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "20 Dec 2025",
        time: "10:30 AM",
        duration: "30 mins",
        type: "Chat",
        status: "Completed",
        amount: "₹600",
        rating: 5,
    },
    {
        id: 2,
        astrologerName: "Sushmita Sen",
        astrologerImage: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "22 Dec 2025",
        time: "02:00 PM",
        duration: "15 mins",
        type: "Call",
        status: "Scheduled",
        amount: "₹300",
        rating: null,
    },
    {
        id: 3,
        astrologerName: "Pt. Rahul Shastri",
        astrologerImage: "https://randomuser.me/api/portraits/men/11.jpg",
        date: "15 Dec 2025",
        time: "05:00 PM",
        duration: "45 mins",
        type: "Video",
        status: "Cancelled",
        amount: "₹900",
        rating: null,
    },
    {
        id: 4,
        astrologerName: "Tarot Anita",
        astrologerImage: "https://randomuser.me/api/portraits/women/68.jpg",
        date: "10 Dec 2025",
        time: "11:00 AM",
        duration: "20 mins",
        type: "Chat",
        status: "Completed",
        amount: "₹400",
        rating: 4,
    },
];

const SessionHistory = () => {
    const [activeTab, setActiveTab] = useState("All");

    const filteredSessions =
        activeTab === "All"
            ? MOCK_SESSIONS
            : MOCK_SESSIONS.filter((session) => session.status === activeTab);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "text-success";
            case "Scheduled":
                return "text-warning"; // Goldish/Orange
            case "Cancelled":
                return "text-danger";
            default:
                return "text-muted";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Chat":
                return "fa-comments";
            case "Call":
                return "fa-phone";
            case "Video":
                return "fa-video";
            default:
                return "fa-star";
        }
    };

    return (
        <>
            <section className="banner-part">
                <div className="overlay-hero">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12 text-center">
                                <h1 className="mb-3">
                                    My <span style={{ color: "#daa23e" }}>Sessions</span>
                                </h1>
                                <p className="text-white" style={{ fontSize: "18px" }}>
                                    View your past and upcoming consultations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-cream" style={{ minHeight: "80vh" }}>
                <div className="container">
                    {/* Tabs */}
                    <div className="row mb-4">
                        <div className="col-12 d-flex justify-content-center">
                            <div className="session-tabs">
                                {["All", "Scheduled", "Completed", "Cancelled"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Session List */}
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-md-12">
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session) => (
                                    <div key={session.id} className="session-card row align-items-center vert-move mb-3">

                                        {/* Left: Astrologer Info */}
                                        <div className="col-12 col-md-4 d-flex align-items-center mb-3 mb-md-0">
                                            <div className="astro-img-wrapper me-3">
                                                <img
                                                    src={session.astrologerImage}
                                                    alt={session.astrologerName}
                                                />
                                                <span className="type-badge">
                                                    <i className={`fa-solid ${getTypeIcon(session.type)}`}></i>
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-purple fw-bold">{session.astrologerName}</h5>
                                                <p className="mb-0 text-muted fs-6">
                                                    {session.date} | {session.time}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Middle: Session Details */}
                                        <div className="col-6 col-md-3 text-start text-md-center mb-3 mb-md-0">
                                            <p className="mb-1 text-muted small-label">Duration</p>
                                            <h6 className="fw-semi-bold">{session.duration}</h6>
                                        </div>

                                        <div className="col-6 col-md-2 text-start text-md-center mb-3 mb-md-0">
                                            <p className="mb-1 text-muted small-label">Amount</p>
                                            <h6 className="fw-semi-bold">{session.amount}</h6>
                                        </div>


                                        {/* Right: Status & Action */}
                                        <div className="col-12 col-md-3 d-flex flex-column align-items-md-end align-items-start gap-2">
                                            <div className={`status-badge ${session.status.toLowerCase()}`}>
                                                <i className="fa-solid fa-circle me-1" style={{ fontSize: "8px" }}></i>
                                                {session.status}
                                            </div>

                                            {session.status === "Completed" && (
                                                <Link href={`/astrologer-details?id=${session.id}`} className="btn-action">
                                                    Rebook <i className="fa-solid fa-arrow-right ms-1"></i>
                                                </Link>
                                            )}
                                            {session.status === "Scheduled" && (
                                                <button className="btn-action primary">
                                                    Join Now
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <div className="empty-state-icon mb-3">
                                        <i className="fa-solid fa-calendar-xmark"></i>
                                    </div>
                                    <h4 className="text-muted">No sessions found</h4>
                                    <p className="text-muted">You haven't booked any consultations in this category yet.</p>
                                    <Link href="/our-astrologers" className="btn-global btn-primary mt-3">
                                        Book a Consultation
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
        /* Reuse Variables from variables.css ideally, but defining local scope for specifics */
        .bg-cream {
            background-color: #ffe3b852;
        }
        .text-purple {
            color: #732882;
        }

        /* Tabs Styling */
        .session-tabs {
            background: #fff;
            padding: 5px;
            border-radius: 50px;
            display: inline-flex;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            flex-wrap: wrap;
            justify-content: center;
            border: 1px solid #daa23e40;
        }
        
        .tab-btn {
            border: none;
            background: transparent;
            padding: 8px 24px;
            border-radius: 50px;
            font-weight: 500;
            color: #555;
            transition: all 0.3s ease;
            font-size: 15px;
        }

        .tab-btn.active {
            background: #732882;
            color: #fff;
            box-shadow: 0 2px 5px rgba(115, 40, 130, 0.3);
        }

        .tab-btn:hover:not(.active) {
            background: #f0f0f0;
            color: #732882;
        }

        /* Card Styling */
        .session-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            border: 1px solid transparent;
            transition: all 0.3s ease;
        }

        .session-card:hover {
            border-color: #daa23e;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        /* Astrologer Image Area */
        .astro-img-wrapper {
            position: relative;
            width: 60px;
            height: 60px;
        }

        .astro-img-wrapper img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #daa23e;
        }

        .type-badge {
            position: absolute;
            bottom: -2px;
            right: -2px;
            background: #732882;
            color: #fff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid #fff;
        }

        .small-label {
            font-size: 13px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        /* Status Badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }

        .status-badge.completed {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-badge.scheduled {
            background: #fff8e1;
            color: #ff8f00;
        }

        .status-badge.cancelled {
            background: #ffebee;
            color: #c62828;
        }

        /* Action Buttons */
        .btn-action {
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s;
            border: 1px solid #732882;
            color: #732882;
            background: transparent;
            white-space: nowrap;
        }

        .btn-action.primary {
            background: #732882;
            color: #fff;
        }

        .btn-action:hover {
            background: #732882;
            color: #fff;
        }

        .btn-action.primary:hover {
            background: #5a1f6b;
             border-color: #5a1f6b;
        }

        /* Empty State */
        .empty-state-icon {
            font-size: 60px;
            color: #ddd;
        }

        /* Mobile Adjustments */
        @media (max-width: 576px) {
            .session-tabs {
                width: 100%;
                justify-content: space-between;
                border-radius: 12px;
            }
            .tab-btn {
                flex: 1;
                padding: 10px 0;
                font-size: 13px;
                border-radius: 10px;
            }
            
            .astro-img-wrapper {
                width: 50px;
                height: 50px;
            }

            .session-card {
                padding: 15px;
            }
            
            .btn-action {
                width: 100%;
                text-align: center;
            }
        }
      `}</style>
        </>
    );
};

export default SessionHistory;


