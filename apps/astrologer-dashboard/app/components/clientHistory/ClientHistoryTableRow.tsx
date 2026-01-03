import React from "react";
import { Phone, Mail, MessageSquare, Video, Star } from "lucide-react";
import { Client } from "./types";

interface ClientHistoryTableRowProps {
    client: Client;
    className?: string;
}

export default function ClientHistoryTableRow({ client, className }: ClientHistoryTableRowProps) {
    return (
        <tr className={`hover:bg-gray-100 transition-colors duration-200 ${className}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {client.name}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        {client.phone}
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        {client.email}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {client.lastConsultation.date}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {client.lastConsultation.duration} via{" "}
                    <span className="capitalize">
                        {client.lastConsultation.type}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-yellow-700">
                    ₹{client.payment.toLocaleString()}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-1 mb-1">
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
                <p className="text-xs text-gray-600 italic leading-snug">
                    “{client.review}”
                </p>
            </td>
            <td className="px-6 py-4">
                <textarea
                    className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="How can we assist you..."
                />
            </td>
        </tr>
    );
}
