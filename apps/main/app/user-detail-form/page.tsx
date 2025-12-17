"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface UserDetails {
  name: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthLocation: string;
}

const UserDetailForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserDetails>({
    name: "",
    gender: "",
    dateOfBirth: "",
    timeOfBirth: "",
    birthLocation: "",
  });

  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserDetails]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = "Time of birth is required";
    }
    if (!formData.birthLocation.trim()) {
      newErrors.birthLocation = "Birth location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      sessionStorage.setItem("userDetails", JSON.stringify(formData));
      console.log("Form submitted:", formData);
      alert("Details saved! Connecting you with an astrologer...");
      // router.push('/consultation');
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 text-center">
                <h1 className="mb-3">
                  Share Your <span style={{ color: "#daa23e" }}>Birth Details</span>
                </h1>
                <p className="text-white" style={{ fontSize: "18px" }}>
                  Get personalized astrological guidance based on your birth chart
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-5" style={{ background: "#ffe3b852" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              {/* Info Card */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "15px", border: "solid 1px #daa23e73" }}>
                <div className="card-body p-4 text-center">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <i className="fa-solid fa-star" style={{ color: "#daa23e", fontSize: "24px", marginRight: "10px" }}></i>
                    <h5 className="mb-0" style={{ color: "#732882", fontWeight: "600" }}>
                      Why We Need Your Birth Details
                    </h5>
                  </div>
                  <p className="mb-0 text-muted">
                    Your birth details help our expert astrologers create an accurate birth chart 
                    and provide personalized predictions based on planetary positions at your birth time.
                  </p>
                </div>
              </div>

              {/* Main Form Card */}
              <div className="leftcard border-0 shadow-lg" style={{ borderRadius: "15px" }}>
                <div className="card-body p-4 p-md-5">
                  <h4 className="mb-4 text-center">
                    <strong style={{ color: "#732882" }}>
                      Please Share Your Birth Details
                    </strong>
                  </h4>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 g-md-4">
                      {/* Name Field */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          placeholder="Enter Your Full Name"
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.name ? "1px solid #dc3545" : "1px solid #daa23e73",
                          }}
                        />
                        {errors.name && (
                          <div className="invalid-feedback d-block">
                            {errors.name}
                          </div>
                        )}
                      </div>

                      {/* Gender Field */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.gender ? "1px solid #dc3545" : "1px solid #daa23e73",
                          }}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                          <div className="invalid-feedback d-block">
                            {errors.gender}
                          </div>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          max={new Date().toISOString().split("T")[0]}
                          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.dateOfBirth ? "1px solid #dc3545" : "1px solid #daa23e73",
                          }}
                        />
                        {errors.dateOfBirth && (
                          <div className="invalid-feedback d-block">
                            {errors.dateOfBirth}
                          </div>
                        )}
                      </div>

                      {/* Time of Birth */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Time of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          type="time"
                          name="timeOfBirth"
                          value={formData.timeOfBirth}
                          onChange={handleChange}
                          className={`form-control ${errors.timeOfBirth ? 'is-invalid' : ''}`}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.timeOfBirth ? "1px solid #dc3545" : "1px solid #daa23e73",
                          }}
                        />
                        {errors.timeOfBirth && (
                          <div className="invalid-feedback d-block">
                            {errors.timeOfBirth}
                          </div>
                        )}
                      </div>

                      {/* Birth Location */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Birth Location <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="birthLocation"
                          value={formData.birthLocation}
                          onChange={handleChange}
                          className={`form-control ${errors.birthLocation ? 'is-invalid' : ''}`}
                          placeholder="City, State, Country"
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.birthLocation ? "1px solid #dc3545" : "1px solid #daa23e73",
                          }}
                        />
                        {errors.birthLocation && (
                          <div className="invalid-feedback d-block">
                            {errors.birthLocation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-4 mt-md-5">
                      <button
                        type="submit"
                        className="submit-button px-5 py-3 text-white fw-semibold"
                        style={{
                          background: "linear-gradient(45deg, #732882, #8a3399)",
                          border: "none",
                          borderRadius: "50px",
                          fontSize: "18px",
                          boxShadow: "0 4px 15px rgba(115, 40, 130, 0.3)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(115, 40, 130, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(115, 40, 130, 0.3)";
                        }}
                      >
                        <i className="fa-solid fa-comments me-2"></i>
                        Talk to Astrologer
                      </button>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: "14px" }}>
                      <i className="fa-solid fa-lock me-1"></i>
                      Your information is secure and will only be used for astrological consultation
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="row mt-5 justify-content-center">
            <div className="col-lg-8">
              <div className="row g-3">
                <div className="col-md-4 col-6">
                  <div className="ser-card text-center h-100">
                    <div className="mb-3">
                      <i className="fa-solid fa-shield-halved" style={{ fontSize: "40px", color: "#732882" }}></i>
                    </div>
                    <h5 style={{ color: "#daa23e", fontSize: "16px", fontWeight: "600" }}>100% Secure</h5>
                    <p style={{ fontSize: "14px", margin: "0" }}>Your data is encrypted</p>
                  </div>
                </div>

                <div className="col-md-4 col-6">
                  <div className="ser-card text-center h-100">
                    <div className="mb-3">
                      <i className="fa-solid fa-user-check" style={{ fontSize: "40px", color: "#732882" }}></i>
                    </div>
                    <h5 style={{ color: "#daa23e", fontSize: "16px", fontWeight: "600" }}>Verified Experts</h5>
                    <p style={{ fontSize: "14px", margin: "0" }}>Certified astrologers</p>
                  </div>
                </div>

                <div className="col-md-4 col-12">
                  <div className="ser-card text-center h-100">
                    <div className="mb-3">
                      <i className="fa-solid fa-bolt" style={{ fontSize: "40px", color: "#732882" }}></i>
                    </div>
                    <h5 style={{ color: "#daa23e", fontSize: "16px", fontWeight: "600" }}>Quick Response</h5>
                    <p style={{ fontSize: "14px", margin: "0" }}>Instant connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDetailForm;

