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
   <div className="flex items-center gap-3 min-w-0">
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
             className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
            isAstrologer ? "border-yellow-200" : "border-blue-200"
          }`}
        />
         <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white flex items-center justify-center ${
            isAstrologer ? "bg-yellow-500" : "bg-blue-500"
          }`}
        >
          {isAstrologer ? (
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          ) : (
             <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          )}
        </div>
      </div>
      <div
        className={`min-w-0 ${
          isAstrologer ? "text-left sm:text-right" : "text-left"
        }`}
      >
         <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          {isAstrologer 
            ? `Astrologer • ${experience}y` 
            : `User • ⭐ ${(user as User).rating}`
          }
        </p>
        {isAstrologer && specialty && (
           <p className="text-xs text-gray-500 mt-0.5 truncate">{specialty}</p>
        )}
      </div>
    </div>
  );
}



