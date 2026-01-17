// refund-management/components/RefundCard/UserInfoCard.tsx
"use client";

import React from "react";
import { User, Mail, Calendar, Star } from "lucide-react";
import { User as UserType, Astrologer } from "./types";

interface UserInfoCardProps {
  user: UserType;
  astrologer: Astrologer;
  type: "user" | "astrologer";
}

export function UserInfoCard({ user, astrologer, type }: UserInfoCardProps) {
  const isUser = type === "user";
  const person = isUser ? user : astrologer;
  
  return (
    <div className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
      isUser 
        ? "bg-blue-50 border-blue-100 hover:bg-blue-100" 
        : "bg-amber-50 border-amber-100 hover:bg-amber-100"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${
            isUser ? "bg-blue-100" : "bg-amber-100"
          }`}>
            <User className={`w-4 h-4 ${
              isUser ? "text-blue-600" : "text-amber-600"
            }`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {isUser ? "User" : "Astrologer"}
          </span>
        </div>
        
        <div className={`text-xs px-2 py-1 rounded-full ${
          isUser 
            ? "bg-blue-100 text-blue-700" 
            : "bg-amber-100 text-amber-700"
        }`}>
          {isUser ? "Customer" : "Provider"}
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={person.avatar}
            alt={person.name}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
            isUser ? "bg-blue-500" : "bg-amber-500"
          }`}>
            {isUser ? (
              <User className="w-3 h-3 text-white" />
            ) : (
              <Star className="w-3 h-3 text-white" />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {person.name}
          </h4>
          
          {isUser ? (
            <>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 truncate">
                  {user.email}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">ID:</span>
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {user.id}
                </code>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {astrologer.specialty}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Expertise:</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                  {astrologer.specialty}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {!isUser && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Service Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= 4 
                      ? "fill-amber-400 text-amber-400" 
                      : "fill-gray-300 text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs font-medium ml-1">4.2</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}