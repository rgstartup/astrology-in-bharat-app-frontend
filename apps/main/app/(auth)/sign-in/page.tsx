"use client";

import NextImage from "next/image";
import NextLink from "next/link";
const Image = NextImage as any;
const Link = NextLink as any;
import React, { useState, useCallback, FormEvent, Suspense, useEffect } from "react";
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
const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/auth/client/login`;

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const SignInContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientLogin } = useClientAuth();

  // Get the callback URL from query params, default to /profile
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  // --- 2. State Management ---
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (!formData.email || !formData.password) {
      toast.error("Email and Password are required for Sign In.");
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

    const payload: LoginPayload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post<LoginSuccessResponse>(
        API_ENDPOINT,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Success. Status:", response.status);
      console.log("Server Response Data:", response.data);

      const token = response.data.accessToken || response.data.token;
      if (token) {
        console.log("🔑 Received token, calling clientLogin...");
        clientLogin(token, response.data.user);
      } else {
        console.warn("⚠️ No token received in login response!", response.data);
      }

      toast.success(response.data.message || "Sign In successful! Redirecting...");

      console.log("🔄 Redirecting to:", callbackUrl);
      window.location.href = callbackUrl;
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
          // 401 Unauthorized (Invalid credentials or Email not verified)
          toast.error(serverMessage || "Invalid credentials. Please check your email and password.");
        } else if (status >= 500) {
          toast.error("A critical server error occurred. Please try again later.");
        } else {
          toast.error(`Login failed: ${serverMessage}`);
        }
      } else if (error.request) {
        toast.error("Network Error: Could not reach the server. Please check your connection.");
        console.error("Network Error: No response received from server.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Request Setup Error:", error.message);
      }
    } finally {
      setIsLoading(false);
      console.log("Login API Request Finished.");
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543").replace(/\/api\/v1\/?$/, "");
    const googleLoginUrl = `${baseUrl}/api/v1/auth/google/login?role=client&redirect_uri=http://localhost:3000`;
    window.location.href = googleLoginUrl;
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
                            style={{ border: "2px solid #fd6410", padding: "2px" }}
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

          {/* Right Side - Sign In Form */}
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
                  No Account? <br />
                  <Link href="/register" className="sign-up fw-bold">
                    Sign Up
                  </Link>
                </h6>
              </div>

              <div className="sign-in-heading mb-4">
                <h2 style={{ color: "var(--primary-color)" }}>Sign In</h2>
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

              <form onSubmit={handleSubmit}>
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

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Enter Your Password Here *
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

                <div className="d-flex justify-content-end mb-3">
                  <Link
                    href="/forgot-password"
                    className="forget-password text-decoration-none"
                  >
                    Forget Password?
                  </Link>
                </div>

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

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default Page;
