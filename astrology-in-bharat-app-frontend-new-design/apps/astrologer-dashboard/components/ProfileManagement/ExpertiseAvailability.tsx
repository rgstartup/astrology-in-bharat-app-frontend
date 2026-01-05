import React from "react";
import { User, Clock, Edit3 } from "lucide-react";
import { Profile } from "./types";

interface ExpertiseAvailabilityProps {
    profile: Profile;
}

export default function ExpertiseAvailability({
    profile,
}: ExpertiseAvailabilityProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4">
                <User className="w-5 h-5 mr-2 text-yellow-600" /> Expertise
            </h2>
            <div className="mb-4">
                <p className="font-semibold text-gray-700 text-sm">Experience</p>
                <p className="text-gray-600 text-sm">{profile.experience}</p>
            </div>
            <div className="mb-4">
                <p className="font-semibold text-gray-700 text-sm">Languages</p>
                <div className="flex flex-wrap gap-2 mt-1">
                    {profile.languages.map((lang, i) => (
                        <span
                            key={i}
                            className="bg-gray-200 text-gray-800 text-xs sm:text-sm px-3 py-1 rounded-full"
                        >
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
            <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4 mt-6">
                <Clock className="w-5 h-5 mr-2 text-yellow-600" /> Availability
            </h2>
            <p className="text-gray-600 mb-3 text-sm">{profile.availability}</p>
            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                <Edit3 className="w-4 h-4" />
                <span>Set Availability</span>
            </button>
        </div>
    );
}
