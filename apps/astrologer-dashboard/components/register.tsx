"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { User, Lock, Mail } from "lucide-react";

// --- Types ---
interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  roles: string[];
}
interface RegistrationSuccessResponse {
  user: {
    id: number;
    email: string;
    name?: string;
    roles: Array<{ id: number; name: string }>;
  };
}
interface FormData {
  fullName: string;
  email: string;
  password: string;
}

// --- API ---
const API_ENDPOINT = "http://localhost:4000/api/v1/auth/email/register";

const RegisterPage: React.FC = () => {
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
      roles: ["expert"],
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
      console.log("Expert Registration Success:", response.data);

      const user = response.data.user;

      // Store user info for UI purposes
      localStorage.setItem("user", JSON.stringify(user));

      setSuccessMessage(
        "Registration successful! Redirecting to dashboard..."
      );

      setFormData({ fullName: "", email: "", password: "" });

      // Navigate to expert dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Expert Registration Failed:", axiosError);

      if (axiosError.response) {
        const status = axiosError.response.status;
        const msg =
          (axiosError.response.data as any)?.message ||
          (axiosError.response.data as any)?.error ||
          `Server responded with status ${status}.`;

        if (status === 400 || status === 409) {
          setError(msg);
        } else if (status >= 500) {
          setError("A critical server error occurred. Please try again later.");
        } else {
          setError(msg);
        }
      } else if (axiosError.request) {
        setError("Network Error: Could not reach the server.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-50 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side: Branding and Visual Section */}
        <div className="relative hidden lg:block h-[700px] bg-gradient-to-br from-astro-primary to-purple-900">
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white p-8 z-10">
            <Image
              src="/images/logo1.webp"
              alt="Logo"
              width={120}
              height={120}
              className="absolute top-6 left-6 bg-white rounded-xl p-2 shadow-lg"
            />
            <div className="text-left mt-20">
              <h1 className="text-4xl font-bold mb-4">
                Join as <span className="text-gold">Expert!</span>
              </h1>
              <p className="text-xl text-left text-gray-100">
                Create your expert account and start connecting with clients.
                Manage your appointments, services, and grow your practice.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-astro-primary">Expert Sign Up</h2>
            <p className="mt-2 text-gray-600">
              Create your account to get started.
            </p>
          </div>

          {/* Status Messages for Error/Success */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <b>Error:</b> {error}
              </p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <b>Success:</b> {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-astro-primary focus:border-astro-primary sm:text-sm transition-all"
                  placeholder="Enter Your Full Name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-astro-primary focus:border-astro-primary sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-astro-primary focus:border-astro-primary sm:text-sm transition-all"
                  placeholder="Enter Password (min. 6 characters)"
                />
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-astro-primary hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-astro-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="font-medium text-astro-primary hover:text-purple-700"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

