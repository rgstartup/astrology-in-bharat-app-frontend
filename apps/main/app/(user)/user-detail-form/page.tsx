"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UserDetails {
  name: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthLocation: string;
}

const UserDetailFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from URL or defaults
  const astrologerName = searchParams.get("name") || "Astrologer";
  const rate = searchParams.get("price") || "20";

  const [formData, setFormData] = useState<UserDetails>({
    name: "",
    gender: "",
    dateOfBirth: "",
    timeOfBirth: "",
    birthLocation: "",
  });

  // Booking State
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [duration, setDuration] = useState("15");

  const totalAmount = Number(rate) * Number(duration);

  const [errors, setErrors] = useState<
    Partial<UserDetails & { bookingDate: string; bookingTime: string }>
  >({});

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
    const newErrors: Partial<
      UserDetails & { bookingDate: string; bookingTime: string }
    > = {};

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
    if (!bookingDate) {
      newErrors.bookingDate = "Booking date is required";
    }
    if (!bookingTime) {
      newErrors.bookingTime = "Booking time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      sessionStorage.setItem("userDetails", JSON.stringify(formData));

      // Pass all data to checkout
      const params = new URLSearchParams({
        name: astrologerName,
        price: rate,
        // Booking Details
        date: bookingDate,
        time: bookingTime,
        duration,
        total: String(totalAmount),
        // User Details (optional, or rely on session storage)
        userName: formData.name,
      });

      router.push(`/checkout?${params.toString()}`);
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
                  Book Your{" "}
                  <span style={{ color: "#daa23e" }}>Consultation</span>
                </h1>
                <p className="text-white" style={{ fontSize: "18px" }}>
                  Share your details and schedule a session with{" "}
                  {astrologerName}
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
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "15px", border: "solid 1px #daa23e73" }}
              >
                <div className="card-body p-4 text-center">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <i
                      className="fa-solid fa-star"
                      style={{
                        color: "#daa23e",
                        fontSize: "24px",
                        marginRight: "10px",
                      }}
                    ></i>
                    <h5
                      className="mb-0"
                      style={{ color: "#732882", fontWeight: "600" }}
                    >
                      Why We Need Your Birth Details
                    </h5>
                  </div>
                  <p className="mb-0 text-muted">
                    Your birth details help our expert astrologers create an
                    accurate birth chart and provide personalized predictions
                    based on planetary positions at your birth time.
                  </p>
                </div>
              </div>

              {/* Main Form Card */}
              <div
                className="leftcard border-0 shadow-lg"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-4 p-md-5">
                  <h4 className="mb-4 text-center">
                    <strong style={{ color: "#732882" }}>
                      Personal Details
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
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Enter Your Full Name"
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.name
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
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
                          className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.gender
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
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
                          className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.dateOfBirth
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
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
                          className={`form-control ${errors.timeOfBirth ? "is-invalid" : ""}`}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.timeOfBirth
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
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
                          className={`form-control ${errors.birthLocation ? "is-invalid" : ""}`}
                          placeholder="City, State, Country"
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.birthLocation
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
                          }}
                        />
                        {errors.birthLocation && (
                          <div className="invalid-feedback d-block">
                            {errors.birthLocation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Section */}

                    <div className="row g-3 g-md-4 mt-3">
                      {/* Booking Date */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Appointment Date{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={bookingDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            setBookingDate(e.target.value);
                            if (errors.bookingDate)
                              setErrors((prev) => ({
                                ...prev,
                                bookingDate: "",
                              }));
                          }}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.bookingDate
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
                          }}
                        />
                        {errors.bookingDate && (
                          <div className="invalid-feedback d-block">
                            {errors.bookingDate}
                          </div>
                        )}
                      </div>

                      {/* Booking Time */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Appointment Time{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          value={bookingTime}
                          onChange={(e) => {
                            setBookingTime(e.target.value);
                            if (errors.bookingTime)
                              setErrors((prev) => ({
                                ...prev,
                                bookingTime: "",
                              }));
                          }}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: errors.bookingTime
                              ? "1px solid #dc3545"
                              : "1px solid #daa23e73",
                          }}
                        />
                        {errors.bookingTime && (
                          <div className="invalid-feedback d-block">
                            {errors.bookingTime}
                          </div>
                        )}
                      </div>

                      {/* Duration Selection */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Duration (Minutes)
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {["5", "10", "15", "30", "45", "60"].map((mins) => (
                            <button
                              key={mins}
                              type="button"
                              className={`btn ${duration === mins ? "btn-primary" : "btn-outline-primary"}`}
                              onClick={() => setDuration(mins)}
                              style={{
                                backgroundColor:
                                  duration === mins ? "#732882" : "transparent",
                                borderColor: "#732882",
                                color: duration === mins ? "#fff" : "#732882",
                                minWidth: "80px",
                              }}
                            >
                              {mins} min
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Summary Box */}
                      <div className="col-12 mt-4">
                        <div
                          className="p-3"
                          style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "10px",
                            border: "1px dashed #732882",
                          }}
                        >
                          <div className="d-flex justify-content-between mb-2">
                            <span>Rate:</span>
                            <strong>₹{rate}/min</strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Duration:</span>
                            <strong>{duration} mins</strong>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between text-success">
                            <span className="fw-bold">Total Payable:</span>
                            <span className="fw-bold fs-5">₹{totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-4 mt-md-5">
                      <button
                        type="submit"
                        className="submit-button px-5 py-3 text-white fw-semibold"
                        style={{
                          background:
                            "linear-gradient(45deg, #732882, #8a3399)",
                          border: "none",
                          borderRadius: "50px",
                          fontSize: "18px",
                          boxShadow: "0 4px 15px rgba(115, 40, 130, 0.3)",
                          minWidth: "250px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(115, 40, 130, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(115, 40, 130, 0.3)";
                        }}
                      >
                        Proceed to Pay{" "}
                        <i className="fa-solid fa-arrow-right ms-2"></i>
                      </button>
                    </div>

                    {/* Privacy Note */}
                    <p
                      className="text-center text-muted mt-4 mb-0"
                      style={{ fontSize: "14px" }}
                    >
                      <i className="fa-solid fa-lock me-1"></i>
                      Your information is secure and will only be used for
                      astrological consultation
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const UserDetailForm = () => {
  return (
    <Suspense
      fallback={
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <UserDetailFormContent />
    </Suspense>
  );
};

export default UserDetailForm;


