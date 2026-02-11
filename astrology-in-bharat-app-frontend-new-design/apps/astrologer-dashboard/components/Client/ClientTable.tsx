import React from "react";
import * as LucideIcons from "lucide-react";
import { Client, SortConfig, SortKey } from "./types";

const { Phone, Mail, Star, ArrowDown, ArrowUp, MessageSquare } = LucideIcons as any;

interface ClientTableProps {
    clients: Client[];
    sortConfig: SortConfig;
    requestSort: (key: SortKey) => void;
    onViewChat: (client: Client) => void;
}

export default function ClientTable({
    clients,
    sortConfig,
    requestSort,
    onViewChat
}: ClientTableProps) {
    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "ascending" ? (
            <ArrowDown size={14} className="ml-1" />
        ) : (
            <ArrowUp size={14} className="ml-1" />
        );
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => requestSort("lastConsultation.date")}
                        >
                            <div className="flex items-center">
                                Last Consultation
                                {getSortIcon("lastConsultation.date")}
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => requestSort("payment")}
                        >
                            <div className="flex items-center">
                                Payment (₹)
                                {getSortIcon("payment")}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating & Review
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                        <tr
                            key={client.id}
                            className="hover:bg-gray-100 transition-colors duration-200"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
                                        {client.avatar ? (
                                            <img
                                                src={client.avatar || "/images/dummy-astrologer.jpg"}
                                                alt={client.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = "/images/dummy-astrologer.jpg"; }}
                                            />
                                        ) : (
                                            client.name.charAt(0)
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {client.name}
                                    </div>
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
                                <p className="text-xs text-gray-600 italic leading-snug truncate max-w-[150px]" title={client.review}>
                                    “{client.review}”
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onViewChat(client)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-xs font-semibold"
                                >
                                    <MessageSquare size={14} />
                                    View Chat
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
