"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// --- Types ---
interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
}
interface RegistrationSuccessResponse {
  message: string;
}
interface FormData {
  fullName: string;
  email: string;
  password: string;
}

// --- API ---
const API_ENDPOINT = "http://localhost:4000/api/v1/auth/email/register";

const Page: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
  });

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

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("All fields marked * are required.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
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


      setSuccessMessage(
        response.data.message || "Registration successful! You can now sign in."
      );

      setFormData({ fullName: "", email: "", password: "" });
      router.push('/')
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        const status = error.response.status;
        const msg =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.error ||
          `Server responded with status ${status}.`;

        if (status === 400 || status === 409) {
          setError(msg);
        } else if (status >= 500) {
          setError("A critical server error occurred. Please try again later.");
        } else {
          setError(msg);
        }
      } else if (error.request) {
        setError("Network Error: Could not reach the server.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <h3 className="text-left text-purple mb-3">Popular Astrology</h3>
              <div className="row g-3">
                {[
                  { name: "Aries", desc: "Vastu, Vedic" },
                  { name: "Tarus", desc: "Vastu, Vedic" },
                  { name: "Tarus", desc: "Vedic, Vastu" },
                ].map((item, idx) => (
                  <div className="col-lg-4 col-sm-6 col-md-4 col-6" key={idx}>
                    <div className="horoscopes-items text-center">
                      <Image
                        src="/images/astro-img1.png"
                        alt="Popular Astrology"
                        height={80}
                        width={80}
                      />
                      <h6 className="fw-bold mt-2">{item.name}</h6>
                      <small className="text-muted" style={{ fontSize: "13px" }}>
                        {item.desc}
                      </small>
                    </div>
                  </div>
                ))}
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

              {/* Social Login */}
              <div className="social-links d-flex gap-3 mb-4">
                <div className="social-button d-flex align-items-center gap-2 border px-3 py-2 rounded pointer">
                  <Image
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google"
                    height={22}
                    width={22}
                  />
                  <small>Sign in with Google</small>
                </div>
                <div className="social-button2 d-flex align-items-center gap-2 border px-3 py-2 rounded pointer">
                  <Image
                    src="/images/facebook-1-svgrepo-com.svg"
                    alt="Facebook"
                    height={22}
                    width={22}
                  />
                  <small>Facebook</small>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  <b>Error:</b> {error}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success mb-3" role="alert">
                  <b>Success:</b> {successMessage}
                </div>
              )}

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

                  {/* Password */}
                  <div className="col-12">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4 py-2 fw-semibold sign-button"
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
