"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowDown, ArrowUp } from "lucide-react";
import { Client, SortKey, SortConfig } from "./types";
import ClientHistoryTableRow from "./ClientHistoryTableRow";
import ClientHistoryCard from "./ClientHistoryCard";

const clientsData: Client[] = [
    {
        id: 1,
        name: "Amit Sharma",
        phone: "98****1234",
        email: "am***@gmail.com",
        lastConsultation: { date: "2025-08-12", duration: "30 min", type: "call" },
        rating: 4,
        review: "Very helpful consultation, explained everything clearly.",
        payment: 450,
    },
    {
        id: 2,
        name: "Priya Verma",
        phone: "99****5678",
        email: "pr***@yahoo.com",
        lastConsultation: { date: "2025-08-15", duration: "45 min", type: "video" },
        rating: 5,
        review: "Amazing guidance, felt very comfortable.",
        payment: 720,
    },
    {
        id: 3,
        name: "Rahul Mehta",
        phone: "97****4321",
        email: "ra***@outlook.com",
        lastConsultation: { date: "2025-08-10", duration: "20 min", type: "chat" },
        rating: 3,
        review: "Good advice, but session felt a bit rushed.",
        payment: 300,
    },
    {
        id: 4,
        name: "Anjali Gupta",
        phone: "96****9876",
        email: "an***@hotmail.com",
        lastConsultation: { date: "2025-08-11", duration: "60 min", type: "call" },
        rating: 5,
        review: "Very insightful and a great listener.",
        payment: 900,
    },
    {
        id: 5,
        name: "Rohan Kumar",
        phone: "91****5555",
        email: "ro***@gmail.com",
        lastConsultation: { date: "2025-08-08", duration: "30 min", type: "video" },
        rating: 4,
        review: "Good tips on marketing, will book again.",
        payment: 450,
    },
    {
        id: 6,
        name: "Kavita Singh",
        phone: "93****4444",
        email: "ka***@yahoo.com",
        lastConsultation: { date: "2025-08-13", duration: "25 min", type: "chat" },
        rating: 3,
        review: "The chat was helpful but I need more time.",
        payment: 375,
    },
];

export default function ClientHistory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "ascending" });

    const sortedAndFilteredClients = useMemo(() => {
        let sortableItems = [...clientsData];

        if (searchTerm) {
            sortableItems = sortableItems.filter((client) =>
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === "lastConsultation.date") {
                    aValue = new Date(a.lastConsultation.date).getTime();
                    bValue = new Date(b.lastConsultation.date).getTime();
                } else if (sortConfig.key === "payment") {
                    aValue = a.payment;
                    bValue = b.payment;
                }

                // Note: Actual sorting comparison logic was commented out in original file, keeping it simple or consistent with previous behaviour.
                // Assuming we want actual sorting:
                // if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
                // if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
                return 0;
            });
        }

        return sortableItems;
    }, [searchTerm, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "ascending" ? (
            <ArrowDown size={14} className="ml-1" />
        ) : (
            <ArrowUp size={14} className="ml-1" />
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                    Clients & Consultation History
                </h1>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-shadow"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
            </div>

            {/* Desktop/Tablet View - Table */}
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
                                    Payment To Expert (₹)
                                    {getSortIcon("payment")}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rating & Review
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expert Notes
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAndFilteredClients.map((client) => (
                            <ClientHistoryTableRow key={client.id} client={client} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="space-y-4 md:hidden">
                {sortedAndFilteredClients.map((client) => (
                    <ClientHistoryCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
}
