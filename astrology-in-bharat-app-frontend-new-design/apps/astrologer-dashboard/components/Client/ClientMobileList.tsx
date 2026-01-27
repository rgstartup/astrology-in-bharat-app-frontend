import React from "react";
import * as LucideIcons from "lucide-react";
import { Client } from "./types";

const { Phone, Mail, MessageSquare, Video, Star } = LucideIcons as any;

interface ClientMobileListProps {
    clients: Client[];
    onViewChat: (client: Client) => void;
}

export default function ClientMobileList({ clients, onViewChat }: ClientMobileListProps) {
    return (
        <div className="space-y-4 md:hidden">
            {clients.map((client) => (
                <div
                    key={client.id}
                    className="bg-white shadow-md rounded-xl p-4 space-y-3"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
                                {client.avatar ? (
                                    <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                                ) : (
                                    client.name.charAt(0)
                                )}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {client.name}
                            </h2>
                        </div>
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
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-semibold text-yellow-700">
                            Payment: ₹{client.payment.toLocaleString()}
                        </div>
                        <button
                            onClick={() => onViewChat(client)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-xs font-bold"
                        >
                            <MessageSquare size={12} />
                            Chat History
                        </button>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Expert Notes:
                        </label>
                        <textarea
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            rows={3}
                            placeholder="Add private notes about this client..."
                        />
                    </div>

                    {/* Review */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Client Review:
                        </label>
                        <p className="text-sm text-gray-600 italic leading-snug">
                            “{client.review}”
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
