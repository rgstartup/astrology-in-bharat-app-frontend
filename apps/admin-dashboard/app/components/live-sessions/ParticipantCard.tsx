// live-sessions/components/ParticipantCard.tsx
import React from "react";
import { Users, Calendar } from "lucide-react";
import { User, Astrologer } from "../live-sessions/session";

interface ParticipantCardProps {
  user: User | Astrologer;
  type: "user" | "astrologer";
  experience?: number;
  specialty?: string;
}

export function ParticipantCard({ 
  user, 
  type, 
  experience, 
  specialty 
}: ParticipantCardProps) {
  const isAstrologer = type === "astrologer";
  
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-12 h-12 rounded-full border-2 ${
            isAstrologer ? "border-yellow-200" : "border-blue-200"
          }`}
        />
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
          isAstrologer ? "bg-yellow-500" : "bg-blue-500"
        }`}>
          {isAstrologer ? (
            <Calendar className="w-3 h-3 text-white" />
          ) : (
            <Users className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      <div className={isAstrologer ? "text-right" : ""}>
        <h4 className="font-medium text-gray-900">{user.name}</h4>
        <p className="text-sm text-gray-600">
          {isAstrologer 
            ? `Astrologer • ${experience}y` 
            : `User • ⭐ ${(user as User).rating}`
          }
        </p>
        {isAstrologer && specialty && (
          <p className="text-xs text-gray-500 mt-1">{specialty}</p>
        )}
      </div>
    </div>
  );
}