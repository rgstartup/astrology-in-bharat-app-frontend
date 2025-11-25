"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, FormEvent } from "react";
import axios, { AxiosError } from "axios";

// --- 1. Define Typescript Interfaces for Type Safety ---

/** The shape of the data sent to the server (request body). */
interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
}

/** The shape of the expected successful server response. */
interface RegistrationSuccessResponse {
  message: string;
  // Add other relevant fields you expect from the server
}

/** The shape of the data managed in the component state (all form fields). */
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// --- API Endpoint Constant ---
const API_ENDPOINT = "http://localhost:4000/api/v1/auth/email/register";

const Page: React.FC = () => {
  // --- 2. State Management ---
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Handlers ---

  // Input Change Handler (Uses useCallback for performance)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  // Form Validation Logic
  const validateForm = (): boolean => {
    setError(null);
    setSuccessMessage(null);

    if (
      !formData.firstName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields marked * are required.");
      console.error("Validation Error: Missing required field.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      console.error("Validation Error: Password too short.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      console.error("Validation Error: Passwords do not match.");
      return false;
    }

    return true;
  };

  // 3. Form Submission Handler with API Call and Error Handling
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const payload: RegistrationPayload = {
      name: fullName,
      email: formData.email,
      password: formData.password,
    };

    console.log("API Request Start. Endpoint:", API_ENDPOINT);
    console.log("Request Payload (Body):", payload);

    try {
      const response = await axios.post<RegistrationSuccessResponse>(
        API_ENDPOINT,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
           withCredentials: true, 
        }
      );

      console.log("API Request Success. Status:", response.status);
      console.log("Server Response Data:", response.data);

      setSuccessMessage(
        response.data.message || "Registration successful! You can now sign in."
      );

      // Clear passwords for security
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      const error = err as AxiosError;
      console.error("API Request Failed. Error object:", error);

      if (error.response) {
        const status = error.response.status;
        const serverMessage =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.error ||
          `Server responded with status ${status}.`;

        console.error(
          `Server Error Details: Status ${status}. Message: ${serverMessage}`
        );

        if (status === 400 || status === 409) {
          setError(`Error: ${serverMessage}`);
        } else if (status >= 500) {
          setError("A critical server error occurred. Please try again later.");
        } else {
          setError(`Registration failed: ${serverMessage}`);
        }
      } else if (error.request) {
        setError(
          "Network Error: Could not reach the server. Please check your connection."
        );
        console.error("Network Error: No response received from server.");
      } else {
        setError("An unexpected error occurred. Please try again.");
        console.error("Request Setup Error:", error.message);
      }
    } finally {
      setIsLoading(false);
      console.log("API Request Finished.");
    }
  };

  // --- Render ---

  return (
    <section className="signin-part">
      <div className="container">
        <div className="row">
          {/* Left Side: Branding and Astrology Info */}
          <div className="col-lg-5">
            <div className="banner-data">
              <h3>
                {/* Use consistent color variables */}
                <span style={{ color: "var(--secondary-color)" }}>
                  Sign Up
                </span>{" "}
                to
                <br />
                <span style={{ color: "var(--primary-color)" }}>
                  Astrology Bharat
                </span>
              </h3>
              <p className="text-muted">
                Join us and unlock personalized astrology insights just for you.
                <br />
                Create your free account in seconds and start your journey
                today!
              </p>
            </div>

            {/* Popular Astrology Section */}
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
                      <small
                        className="text-muted"
                        style={{ fontSize: "13px" }}
                      >
                        {item.desc}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="col-lg-7 col-sm-12 ms-auto">
            <div className="form-data shadow-sm p-4 rounded-xl bg-white">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  Welcome to <br />
                  <span style={{ color: "var(--primary-color)" }}>
                    Astrology Bharat
                  </span>
                </h6>
                <h6 className="mb-0">
                  Already Account? <br />
                  <Link href="#" className="sign-up fw-bold">
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

              {/* Status Messages for Error/Success - Use Bootstrap Alert Classes */}
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* First Name */}
                  <div className="col-md-6">
                    <label
                      htmlFor="firstName"
                      className="form-label fw-semibold"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
                      placeholder="Enter First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Last Name */}
                  <div className="col-md-6">
                    <label
                      htmlFor="lastName"
                      className="form-label fw-semibold"
                    >
                      Last Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-control"
                      placeholder="Enter Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Email Address */}
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
                  {/* Confirm Password */}
                  <div className="col-12">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  // Consolidated and simplified class names
                  className="btn btn-primary w-100 mt-4 py-2 fw-semibold sign-button"
                  disabled={isLoading} // Disabled during API call
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
