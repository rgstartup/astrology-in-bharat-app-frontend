"use client";
import React from "react";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AdminLoginPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white max-h-[90vh]">
        {/* Left Side: Image / Visual Section */}
        <div className="relative hidden lg:flex bg-yellow-600">
          <div className="flex flex-col items-center justify-center text-white p-8 w-full">
            <Image
              src="/images/logo.png"
              alt="Astrology in Bharat Logo"
              width={100}
              height={100}
              className="bg-gray-50 rounded-xl p-3 mb-8"
            />

            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-base">
                Manage your platform, monitor activities, and control all
                aspects of Astrology in Bharat.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center overflow-y-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="mx-auto rounded-xl"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm"
                  placeholder="admin@astrologyinbharat.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm"
                  placeholder="********"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <Link
                href="/admin/dashboard"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
              >
                Sign in to Admin Panel
              </Link>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-gray-600">
              Protected area - Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;