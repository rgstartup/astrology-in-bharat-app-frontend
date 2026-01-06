"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "../../services/apiClient";
import { useRouter } from "next/navigation";

interface ProfileData {
    full_name: string;
    gender: "male" | "female" | "other" | "";
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
    phone: string;
    language_preference: string;
    preferences: string;
}

export default function ProfilePage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState<ProfileData>({
        full_name: "",
        gender: "",
        date_of_birth: "",
        time_of_birth: "",
        place_of_birth: "",
        phone: "",
        language_preference: "",
        preferences: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/sign-in");
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await apiClient.get("/client/profile");
                if (data) {
                    setFormData({
                        full_name: data.full_name || user?.name || "",
                        gender: data.gender || "",
                        date_of_birth: data.date_of_birth || "",
                        time_of_birth: data.time_of_birth || "",
                        place_of_birth: data.place_of_birth || "",
                        phone: data.phone || "",
                        language_preference: data.language_preference || "",
                        preferences: data.preferences || "",
                    });
                }
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                if (err.response?.status !== 404) {
                    setError("Failed to load profile details.");
                } else if (user) {
                    setFormData(prev => ({ ...prev, full_name: user.name || "" }));
                }
            } finally {
                setFetching(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, user]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (
            !formData.full_name ||
            !formData.gender ||
            !formData.date_of_birth ||
            !formData.time_of_birth ||
            !formData.place_of_birth
        ) {
            setError("Please fill in all required birth details.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await apiClient.post("/client/profile", formData);
            setSuccess("Profile updated successfully!");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            console.error("Error saving profile:", err);
            setError(
                err.response?.data?.message ||
                "Failed to save profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || fetching) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="signin-part profile-section">
            <div className="container">
                <div className="row">
                    {/* Left Side: Branding and Astrology Identity */}
                    <div className="col-lg-5">
                        <div className="banner-data">
                            <h3>
                                <span className="text-secondary" style={{ color: "var(--secondary-color)" }}>My Profile</span>
                                <br />
                                <span style={{ color: "var(--primary-color)" }}>
                                    Personal Insights
                                </span>
                            </h3>
                            <p className="text-muted mt-3">
                                Maintaining accurate birth details ensures the most precise
                                astrological calculations and personalized daily horoscopes.
                            </p>
                        </div>

                        {/* Reusable Astrology Item Pattern from Sign-in */}
                        <div className="popular-astrology m-hidden pt-4">
                            <h4 className="text-purple mb-4" style={{ color: "var(--primary-color)" }}>
                                Profile Benefits
                            </h4>
                            <div className="row g-3">
                                {[
                                    { name: "Kundli", desc: "Detailed Charts", icon: "/images/top-icon1.png" },
                                    { name: "Matching", desc: "Accurate Analysis", icon: "/images/top-icon6.png" },
                                    { name: "Pooja", desc: "Remedial Suggestion", icon: "/images/top-icon3.png" },
                                ].map((item, idx) => (
                                    <div className="col-lg-4 col-sm-6 col-md-4 col-6" key={idx}>
                                        <div className="horoscopes-items text-center bg-white shadow-sm">
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                height={60}
                                                width={60}
                                                className="mb-2"
                                            />
                                            <h6 className="fw-bold">{item.name}</h6>
                                            <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                                                {item.desc}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Profile Form */}
                    <div className="col-lg-7 col-sm-12 ms-auto">
                        <div className="form-data shadow-sm p-4 p-md-5 rounded-xl bg-white border-0 mt-3 mt-lg-0">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="mb-0" style={{ color: "var(--primary-color)" }}>
                                    Update Profile
                                </h2>
                                <div className="text-end">
                                    <small className="text-muted d-block">Account Level</small>
                                    <span className="badge bg-primary rounded-pill px-3">Standard User</span>
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <strong>Error!</strong> {error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <strong>Success!</strong> {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Basic Info */}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Contact Email (Linked)</label>
                                        <input
                                            type="email"
                                            className="form-control bg-light"
                                            value={user?.email || ""}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    {/* Birth Details */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Gender *</label>
                                        <select
                                            className="form-select"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter mobile number"
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Date of Birth *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Time of Birth *</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="time_of_birth"
                                            value={formData.time_of_birth}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Place of Birth *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="place_of_birth"
                                            value={formData.place_of_birth}
                                            onChange={handleChange}
                                            placeholder="City, State, Country"
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Language Preference</label>
                                        <select
                                            className="form-select"
                                            name="language_preference"
                                            value={formData.language_preference}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Language</option>
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Marathi">Marathi</option>
                                            <option value="Tamil">Tamil</option>
                                            <option value="Sanskrit">Sanskrit</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Personal Notes / Preferences</label>
                                        <textarea
                                            className="form-control"
                                            name="preferences"
                                            value={formData.preferences}
                                            onChange={handleChange}
                                            placeholder="Interests (e.g. Career, Relationship, Finance)"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3 fw-bold sign-button text-white border-0"
                                            disabled={loading}
                                            style={{ borderRadius: "12px" }}
                                        >
                                            {loading ? (
                                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            ) : (
                                                <i className="fa-solid fa-cloud-arrow-up me-2"></i>
                                            )}
                                            {loading ? "Syncing..." : "Update Profile Information"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
