"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { toast } from "react-toastify";
// --- 1. Define Typescript Interfaces ---

/** The shape of the data sent to the server (request body). */
interface LoginPayload {
  email: string;
  password: string;
}

/** The shape of the expected successful server response. */
interface LoginSuccessResponse {
  token?: string;       // Some endpoints might return 'token'
  accessToken?: string; // Backend returns 'accessToken'
  message: string;
  user?: any;
}

/** The shape of the data managed in the component state. */
interface FormData {
  email: string;
  password: string;
}

// --- API Endpoint Constant ---
const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/auth/email/login`;

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientLogin } = useClientAuth(); // Add this line

  // Get the callback URL from query params, default to /profile
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  // --- 2. State Management ---
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Handlers ---

  // Input Change Handler
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

    if (!formData.email || !formData.password) {
      setError("Email and Password are required for Sign In.");
      console.error("Validation Error: Missing required field.");
      return false;
    }

    return true;
  };

  // 3. Form Submission Handler with API Integration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Construct the POST payload as required: email & password in JSON body
    const payload: LoginPayload = {
      email: formData.email,
      password: formData.password,
    };


    try {
      // Making the POST request
      const response = await axios.post<LoginSuccessResponse>(
        API_ENDPOINT,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );


      console.log("Login Success. Status:", response.status);
      console.log("Server Response Data:", response.data);

      // Update authentication context
      const token = response.data.accessToken || response.data.token;
      if (token) {
        console.log("🔑 Received token, calling clientLogin...");
        clientLogin(token, response.data.user);
      } else {
        console.warn("⚠️ No token received in login response!", response.data);
      }

      toast.success(response.data.message || "Sign In successful! Redirecting...");

      // Redirect to the callback URL or default to /profile
      console.log("🔄 Redirecting to:", callbackUrl);
      window.location.href = callbackUrl;
      // router.push('/profile');
    } catch (err) {
      const error = err as AxiosError;
      console.error("Login API Request Failed. Error object:", error);

      if (error.response) {
        const status = error.response.status;
        const serverMessage =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.error ||
          `Server responded with status ${status}.`;

        console.error(
          `Server Error Details: Status ${status}. Message: ${serverMessage}`
        );

        if (status === 401) {
          // 401 Unauthorized (Invalid credentials)
          setError(
            "Invalid credentials. Please check your email and password."
          );
        } else if (status >= 500) {
          setError("A critical server error occurred. Please try again later.");
        } else {
          setError(`Login failed: ${serverMessage}`);
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
      console.log("Login API Request Finished.");
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
                <span style={{ color: "var(--secondary-color)" }}>Sign In</span>{" "}
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
              <h3 className="text-purple mb-3 text-left">Popular Astrology</h3>
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

          {/* Right Side - Sign In Form */}
          <div className="col-lg-7 col-sm-12 ms-auto">
            <div className="form-data shadow-sm p-4 rounded-xl bg-white">
              {/* Heading */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  Welcome to <br />
                  <span style={{ color: "var(--primary-color)" }}>
                    Astrology Bharat
                  </span>
                </h6>
                <h6 className="mb-0">
                  No Account? <br />
                  <Link href="/register" className="sign-up fw-bold">
                    Sign Up
                  </Link>
                </h6>
              </div>

              <div className="sign-in-heading mb-4">
                <h2 style={{ color: "var(--primary-color)" }}>Sign In</h2>
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

              {/* Status Messages for Error/Success */}
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

              {/* Sign In Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Enter your username or email address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Username or email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Enter Your Password Here *
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

                {/* Forget password */}
                <div className="d-flex justify-content-end mb-3">
                  <Link
                    href="#"
                    className="forget-password text-decoration-none"
                  >
                    Forget Password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold sign-button" style={{ backgroundColor: "#fd6410", color: "white" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
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
