import React from "react";
import { Phone, Mail, MessageSquare, Video, Star } from "lucide-react";
import { Client } from "./types";

interface ClientHistoryCardProps {
    client: Client;
}

export default function ClientHistoryCard({ client }: ClientHistoryCardProps) {
    return (
        <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    {client.name}
                </h2>
                <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className={
                                i < client.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Contact & Consultation */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    {client.phone}
                </div>
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    {client.email}
                </div>
                <div className="flex items-center gap-2 col-span-2">
                    <p className="text-gray-600 font-medium">Last Consultation:</p>
                    <span className="flex items-center gap-1">
                        {client.lastConsultation.date}
                        <span className="text-xs text-gray-500 ml-1">
                            ({client.lastConsultation.duration})
                        </span>
                    </span>
                    {client.lastConsultation.type === "call" && (
                        <Phone size={14} className="ml-1" />
                    )}
                    {client.lastConsultation.type === "chat" && (
                        <MessageSquare size={14} className="ml-1" />
                    )}
                    {client.lastConsultation.type === "video" && (
                        <Video size={14} className="ml-1" />
                    )}
                </div>
            </div>

            {/* Payment */}
            <div className="text-sm font-semibold text-yellow-700">
                Payment to Expert: ₹{client.payment.toLocaleString()}
            </div>

            {/* Notes */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Expert Notes:</label>
                <textarea
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    rows={3}
                    placeholder="Add private notes about this client..."
                />
            </div>

            {/* Review */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Client Review:</label>
                <p className="text-sm text-gray-600 italic leading-snug">
                    “{client.review}”
                </p>
            </div>
        </div>
    );
}
