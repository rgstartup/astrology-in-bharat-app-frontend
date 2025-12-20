"use client";
import React, { memo } from "react";
import { Lock, Mail } from "lucide-react";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = memo(function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-8 space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            autoComplete="email"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            placeholder="admin@astrologyinbharat.com"
            aria-label="Email address"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            autoComplete="current-password"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            aria-label="Password"
          />
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        Sign In to Admin Panel
      </button>
    </form>
  );
});