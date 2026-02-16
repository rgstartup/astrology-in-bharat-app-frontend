"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, FormEvent, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";

// --- Types ---
interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}
interface RegistrationSuccessResponse {
  message: string;
}
interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

// --- API ---
const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/auth/email/register`;

const Page: React.FC = () => {
  const router = useRouter();
  // const searchParams = useSearchParams(); // Unused and causes build error if not suspended
  const { clientLogin } = useClientAuth();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Input handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Validation
  const validateForm = () => {
    setError(null);
    setSuccessMessage(null);

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
      toast.error("All fields marked * are required.");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    // Basic phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    return true;
  };

  const handleGoogleLogin = () => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543").replace(/\/api\/v1\/?$/, "");
    const googleLoginUrl = `${baseUrl}/api/v1/auth/google/login?role=client&redirect_uri=http://localhost:3000`;
    window.location.href = googleLoginUrl;
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const payload: RegistrationPayload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phoneNumber,
    };

    try {
      const response = await axios.post<RegistrationSuccessResponse>(
        API_ENDPOINT,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );


      toast.success(
        response.data.message || "Registration successful! Please check your email to verify your account."
      );

      setFormData({ fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "" });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        const status = error.response.status;
        const msg =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.error ||
          `Server responded with status ${status}.`;

        if (status === 400 || status === 409) {
          toast.error(msg);
        } else if (status >= 500) {
          toast.error("A critical server error occurred. Please try again later.");
        } else {
          toast.error(msg);
        }
      } else if (error.request) {
        toast.error("Network Error: Could not reach the server.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [topExperts, setTopExperts] = useState<any[]>([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  // Fetch Top Rated Experts
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

  // UI
  return (
    <section className="signin-part">
      <div className="container">
        <div className="row">
          {/* Left Section */}
          <div className="col-lg-5">
            <div className="banner-data">
              <h3>
                <span style={{ color: "var(--secondary-color)" }}>Sign Up</span>{" "}
                to <br />
                <span style={{ color: "var(--primary-color)" }}>
                  Astrology Bharat
                </span>
              </h3>
              <p className="text-muted">
                Join us and unlock personalized astrology insights.
              </p>
            </div>

            <div className="popular-astrology m-hidden pt-3">
              <h3 className="text-left text-purple mb-3">Top Rated Experts</h3>
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
                  // Fallback to placeholders if no experts found
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
          </div>

          {/* Right Form Section */}
          <div className="col-lg-7 col-sm-12 ms-auto">
            <div className="form-data shadow-sm p-4 rounded-xl bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  Welcome to <br />
                  <span style={{ color: "var(--primary-color)" }}>
                    Astrology Bharat
                  </span>
                </h6>
                <h6 className="mb-0">
                  Already Account? <br />
                  <Link href="/sign-in" className="sign-up fw-bold">
                    Sign In
                  </Link>
                </h6>
              </div>

              <div className="sign-in-heading mb-4">
                <h2 style={{ color: "var(--primary-color)" }}>Sign Up</h2>
              </div>

              <div className="social-links d-flex gap-3 mb-4">
                <div
                  className="social-button d-flex align-items-center gap-2 border px-3 py-2 rounded pointer"
                  onClick={handleGoogleLogin}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google"
                    height={22}
                    width={22}
                  />
                  <small>Sign in with Google</small>
                </div>

              </div>


              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* First Name */}
                  <div className="col-md-12">
                    <label
                      htmlFor="fullName"
                      className="form-label fw-semibold"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter Your Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="col-12">
                    <label htmlFor="phoneNumber" className="form-label fw-semibold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="Enter 10-digit Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                    />
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter Password"
                        style={{ paddingRight: "40px" }}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ zIndex: 10 }}
                      >
                        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-12">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Re-enter Password"
                        style={{ paddingRight: "40px" }}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ zIndex: 10 }}
                      >
                        <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 mt-4 py-2 fw-semibold bg-primary hover:bg-primary-hover text-white border-0 transition-all font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
