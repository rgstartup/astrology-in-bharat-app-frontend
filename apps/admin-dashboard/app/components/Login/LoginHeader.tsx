import React from "react";
import { Lock } from "lucide-react";

export function LoginHeader() {
  return (
    <header className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 text-center">
      <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
        <Lock className="w-10 h-10 text-yellow-600" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-white">Admin Login</h1>
      <p className="text-yellow-100 text-sm mt-2">Astrology in Bharat Admin Panel</p>
    </header>
  );
}