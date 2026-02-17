import React from "react";
import AdminLoginForm from "./components/AdminLoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Astrology in Bharat",
  description: "Secure login for Astrology in Bharat admin panel",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side: Image / Visual Section (Static Server Component Part) */}
        <div className="relative hidden lg:block h-[500px]">
          <div className="absolute inset-0 bg-primary bg-opacity-70 flex flex-col items-center justify-center text-white p-8 z-10">
            <img
              src="/images/Astrologer.png"
              alt="Logo"
              className="w-56 h-56 object-contain mb-6 drop-shadow-2xl"
            />

            <div className="text-left">
              <h1 className="text-4xl font-semibold font-sans mb-4">
                Welcome Back, Admin!
              </h1>
              <p className="text-xl text-left">
                Access your admin dashboard, manage users, experts, and oversee platform operations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form (Client Component) */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
