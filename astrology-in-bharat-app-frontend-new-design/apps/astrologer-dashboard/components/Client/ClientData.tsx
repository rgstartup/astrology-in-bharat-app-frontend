"use client";

import React, { useState, useMemo } from "react";
import ClientHeader from "./ClientHeader";
import ClientTable from "./ClientTable";
import ClientMobileList from "./ClientMobileList";
import { Client, SortConfig, SortKey } from "./types";

const clientsData: Client[] = [
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

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  const sortedAndFilteredClients = useMemo(() => {
    let sortableItems = [...clientsData];

    // Filtering logic
    if (searchTerm) {
      sortableItems = sortableItems.filter(
        (client) =>
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

        // Note: The original code commented out the actual sorting logic.
        // Uncommenting and fixing it based on standard sorting:
        if (aValue && bValue) {
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <ClientHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* 💻 Desktop/Tablet View - Table */}
      <ClientTable
        clients={sortedAndFilteredClients}
        sortConfig={sortConfig}
        requestSort={requestSort}
      />

      {/* 📱 Mobile View - Cards */}
      <ClientMobileList clients={sortedAndFilteredClients} />
    </div>
  );
}