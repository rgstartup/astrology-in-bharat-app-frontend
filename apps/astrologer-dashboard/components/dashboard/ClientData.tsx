"use client";

import React, { useState, useMemo } from "react";
import { Phone, Mail, MessageSquare, Video, Star, Search, ArrowDown, ArrowUp } from "lucide-react";

// Assuming a central utility function
const cn = (...classes: (string | undefined | null | boolean)[]) =>
  classes.filter(Boolean).join(" ");

const clientsData = [
  {
    id: 1,
    name: "Amit Sharma",
    phone: "98****1234",
    email: "am***@gmail.com",
    lastConsultation: { date: "2025-08-12", duration: "30 min", type: "call" },
    rating: 4,
    review: "Very helpful consultation, explained everything clearly.",
    payment: 450, // amount paid to expert after platform deduction, INR
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

type SortKey = "lastConsultation.date" | "payment" | null;

export default function ClientsPage() {
  const [notes, setNotes] = useState(
    // clientsData.map((c) => ({ id: c.id, text: c.notes }))
    clientsData.map((c) => ({ id: c.id }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });

  const handleNoteChange = (id: number, newText: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: newText } : n))
    );
  };

  const sortedAndFilteredClients = useMemo(() => {
    let sortableItems = [...clientsData];

    // Filtering logic
    if (searchTerm) {
      sortableItems = sortableItems.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
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

        // if (aValue < bValue) {
        //   return sortConfig.direction === "ascending" ? -1 : 1;
        // }
        // if (aValue > bValue) {
        //   return sortConfig.direction === "ascending" ? 1 : -1;
        // }
        return 0;
      });
    }

    return sortableItems;
  }, [clientsData, searchTerm, sortConfig]);

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

      {/* 💻 Desktop/Tablet View - Table */}
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
                Support
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredClients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
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
                    // value={notes.find((n) => n.id === client.id)?.text || ""}
                    onChange={(e) =>
                      handleNoteChange(client.id, e.target.value)
                    }
                    className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="How can we assist you..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile View - Cards */}
      <div className="space-y-4 md:hidden">
        {sortedAndFilteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white shadow-md rounded-xl p-4 space-y-3"
          >
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
                // value={notes.find((n) => n.id === client.id)?.text || ""}
                onChange={(e) => handleNoteChange(client.id, e.target.value)}
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
        ))}
      </div>
    </div>
  );
}