"use client";

import React, { FC } from "react";
import { Clock, MessageCircle, PhoneCall, Video } from "lucide-react";
import { cn } from "@/utils/cn";

// --- Data Type ---
interface Consultation {
    id: number;
    clientName: string;
    type: "Chat" | "Call" | "Video";
    startTime: string; // e.g. "10:30 AM"
    duration: string;
    status: "Upcoming" | "Ongoing";
}

// --- Example Data (Only Current/Upcoming) ---
const currentConsultations: Consultation[] = [
    {
        id: 1,
        clientName: "Priya Sharma",
        type: "Chat",
        startTime: "11:00 AM",
        duration: "15 min",
        status: "Upcoming",
    },
    {
        id: 2,
        clientName: "Rahul Verma",
        type: "Video",
        startTime: "11:45 AM",
        duration: "30 min",
        status: "Upcoming",
    },
    {
        id: 3,
        clientName: "Anjali Singh",
        type: "Call",
        startTime: "12:30 PM",
        duration: "20 min",
        status: "Ongoing",
    },
];

// --- Component ---
export const MyConsultations: FC = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Current Consultations</h3>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {currentConsultations.length} Scheduled
                </span>
            </div>

            {/* List */}
            <div className="space-y-3">
                {currentConsultations.length > 0 ? (
                    currentConsultations.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
                        >
                            {/* Left: Client & Type */}
                            <div className="flex items-center gap-4">
                                {/* Type Icon */}
                                <div
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center rounded-full",
                                        c.type === "Chat" && "bg-blue-100 text-blue-600",
                                        c.type === "Call" && "bg-green-100 text-green-600",
                                        c.type === "Video" && "bg-red-100 text-red-600"
                                    )}
                                >
                                    {c.type === "Chat" && <MessageCircle className="w-5 h-5" />}
                                    {c.type === "Call" && <PhoneCall className="w-5 h-5" />}
                                    {c.type === "Video" && <Video className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{c.clientName}</p>
                                    <p className="text-xs text-gray-500">{c.type} Consultation</p>
                                </div>
                            </div>

                            {/* Middle: Time & Duration */}
                            <div className="hidden sm:flex flex-col text-sm text-gray-600 items-start">
                                <div className="flex items-center gap-1 font-medium">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {c.startTime}
                                </div>
                                <span className="text-xs">{c.duration}</span>
                            </div>

                            {/* Right: Action */}
                            <div>
                                <button
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition",
                                        c.status === "Ongoing"
                                            ? "bg-green-600 text-white hover:bg-green-700"
                                            : "bg-transparent border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                                    )}
                                >
                                    {c.status === "Ongoing" ? "Hold" : "Start"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-6">
                        No consultations scheduled right now.
                    </p>
                )}
            </div>
        </div>
    );
};
