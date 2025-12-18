"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
  Star,
  Award,
  Briefcase,
} from "lucide-react";
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { ProfileModal } from "@/app/components/admin/ProfileModal";

interface Expert {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  specialization: string;
  experience: number;
  rating: number;
  totalConsultations: number;
  totalEarnings: number;
  city?: string;
  state?: string;
  languages?: string[];
  avatar?: string;
  kycStatus: "Verified" | "Pending" | "Rejected";
  lastActive?: string;
}

const ALL_EXPERTS: Expert[] = [
  {
    id: 1,
    name: "Pandit Raj Kumar",
    email: "raj.kumar@astro.com",
    phone: "+91 98765 12345",
    status: "Active",
    joinDate: "2023-06-15",
    specialization: "Vedic Astrology",
    experience: 15,
    rating: 4.8,
    totalConsultations: 450,
    totalEarnings: 225000,
    city: "Varanasi",
    state: "Uttar Pradesh",
    languages: ["Hindi", "English", "Sanskrit"],
    avatar: "https://i.pravatar.cc/150?img=51",
    kycStatus: "Verified",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Dr. Meera Sharma",
    email: "meera.sharma@astro.com",
    phone: "+91 98765 12346",
    status: "Active",
    joinDate: "2023-08-20",
    specialization: "Numerology",
    experience: 10,
    rating: 4.9,
    totalConsultations: 380,
    totalEarnings: 190000,
    city: "Jaipur",
    state: "Rajasthan",
    languages: ["Hindi", "English"],
    avatar: "https://i.pravatar.cc/150?img=45",
    kycStatus: "Verified",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Acharya Suresh Joshi",
    email: "suresh.joshi@astro.com",
    phone: "+91 98765 12347",
    status: "Active",
    joinDate: "2023-05-10",
    specialization: "Tarot Reading",
    experience: 12,
    rating: 4.7,
    totalConsultations: 520,
    totalEarnings: 260000,
    city: "Mumbai",
    state: "Maharashtra",
    languages: ["Hindi", "English", "Marathi"],
    avatar: "https://i.pravatar.cc/150?img=13",
    kycStatus: "Verified",
    lastActive: "30 minutes ago",
  },
  {
    id: 4,
    name: "Guru Anita Reddy",
    email: "anita.reddy@astro.com",
    phone: "+91 98765 12348",
    status: "Pending",
    joinDate: "2024-01-05",
    specialization: "Palmistry",
    experience: 8,
    rating: 4.5,
    totalConsultations: 120,
    totalEarnings: 60000,
    city: "Hyderabad",
    state: "Telangana",
    languages: ["Telugu", "Hindi", "English"],
    avatar: "https://i.pravatar.cc/150?img=27",
    kycStatus: "Pending",
    lastActive: "1 day ago",
  },
  {
    id: 5,
    name: "Swami Ravi Patel",
    email: "ravi.patel@astro.com",
    phone: "+91 98765 12349",
    status: "Active",
    joinDate: "2023-07-25",
    specialization: "Vastu Shastra",
    experience: 20,
    rating: 4.9,
    totalConsultations: 600,
    totalEarnings: 300000,
    city: "Ahmedabad",
    state: "Gujarat",
    languages: ["Gujarati", "Hindi", "English"],
    avatar: "https://i.pravatar.cc/150?img=60",
    kycStatus: "Verified",
    lastActive: "4 hours ago",
  },
  {
    id: 6,
    name: "Vidya Nair",
    email: "vidya.nair@astro.com",
    phone: "+91 98765 12350",
    status: "Inactive",
    joinDate: "2023-09-12",
    specialization: "Horoscope Reading",
    experience: 7,
    rating: 4.4,
    totalConsultations: 200,
    totalEarnings: 100000,
    city: "Kochi",
    state: "Kerala",
    languages: ["Malayalam", "English"],
    avatar: "https://i.pravatar.cc/150?img=32",
    kycStatus: "Verified",
    lastActive: "2 weeks ago",
  },
  {
    id: 7,
    name: "Pandit Mohan Verma",
    email: "mohan.verma@astro.com",
    phone: "+91 98765 12351",
    status: "Active",
    joinDate: "2023-04-18",
    specialization: "KP Astrology",
    experience: 18,
    rating: 4.8,
    totalConsultations: 700,
    totalEarnings: 350000,
    city: "Delhi",
    state: "Delhi",
    languages: ["Hindi", "English", "Punjabi"],
    avatar: "https://i.pravatar.cc/150?img=68",
    kycStatus: "Verified",
    lastActive: "5 hours ago",
  },
  {
    id: 8,
    name: "Kavita Desai",
    email: "kavita.desai@astro.com",
    phone: "+91 98765 12352",
    status: "Active",
    joinDate: "2023-10-02",
    specialization: "Face Reading",
    experience: 9,
    rating: 4.6,
    totalConsultations: 310,
    totalEarnings: 155000,
    city: "Pune",
    state: "Maharashtra",
    languages: ["Marathi", "Hindi", "English"],
    avatar: "https://i.pravatar.cc/150?img=38",
    kycStatus: "Verified",
    lastActive: "3 hours ago",
  },
  {
    id: 9,
    name: "Jyotish Arun Kumar",
    email: "arun.kumar@astro.com",
    phone: "+91 98765 12353",
    status: "Pending",
    joinDate: "2024-01-15",
    specialization: "Gemstone Consultation",
    experience: 5,
    rating: 4.3,
    totalConsultations: 80,
    totalEarnings: 40000,
    city: "Chennai",
    state: "Tamil Nadu",
    languages: ["Tamil", "English"],
    avatar: "https://i.pravatar.cc/150?img=14",
    kycStatus: "Pending",
    lastActive: "6 hours ago",
  },
  {
    id: 10,
    name: "Dr. Priya Bansal",
    email: "priya.bansal@astro.com",
    phone: "+91 98765 12354",
    status: "Active",
    joinDate: "2023-03-22",
    specialization: "Lal Kitab",
    experience: 14,
    rating: 4.9,
    totalConsultations: 550,
    totalEarnings: 275000,
    city: "Chandigarh",
    state: "Punjab",
    languages: ["Punjabi", "Hindi", "English"],
    avatar: "https://i.pravatar.cc/150?img=24",
    kycStatus: "Verified",
    lastActive: "1 hour ago",
  },
];

export default function ExpertsPage() {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showModal, setShowModal] = useState(false);

  const activeExperts = ALL_EXPERTS.filter((e) => e.status === "Active").length;
  const pendingExperts = ALL_EXPERTS.filter((e) => e.status === "Pending").length;
  const verifiedExperts = ALL_EXPERTS.filter((e) => e.kycStatus === "Verified").length;

  // Stats configuration for StatsCards component
  const expertStats = [
    {
      title: "Total Experts",
      value: ALL_EXPERTS.length,
      icon: UserCheck,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Active Experts",
      value: activeExperts,
      icon: UserCheck,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
    },
    {
      title: "Pending Approval",
      value: pendingExperts,
      icon: Clock,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-100",
      valueColor: "text-yellow-600",
    },
    {
      title: "KYC Verified",
      value: verifiedExperts,
      icon: Award,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      valueColor: "text-purple-600",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Expert",
      render: (expert: Expert) => (
        <div className="flex items-center space-x-3">
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{expert.name}</p>
            <p className="text-xs text-gray-500">{expert.specialization}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (expert: Expert) => (
        <div>
          <p className="text-sm text-gray-600">{expert.email}</p>
          <p className="text-xs text-gray-500">{expert.phone}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (expert: Expert) => (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-gray-900">
            {expert.rating}
          </span>
        </div>
      ),
    },
    {
      key: "consultations",
      label: "Consultations",
      render: (expert: Expert) => (
        <p className="text-sm text-gray-900 font-medium">
          {expert.totalConsultations}
        </p>
      ),
    },
    {
      key: "kycStatus",
      label: "KYC Status",
      render: (expert: Expert) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            expert.kycStatus === "Verified"
              ? "bg-green-100 text-green-700"
              : expert.kycStatus === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {expert.kycStatus}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (expert: Expert) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            expert.status === "Active"
              ? "bg-green-100 text-green-700"
              : expert.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {expert.status}
        </span>
      ),
    },
  ];

  const handleViewProfile = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExpert(null);
  };

  return (
    <>
      <DataTable
        data={ALL_EXPERTS}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        title="Expert Management"
        onViewDetails={handleViewProfile}
        statsCards={<StatsCards stats={expertStats} columns={4} />}
      />

      {selectedExpert && (
        <ProfileModal
          isOpen={showModal}
          onClose={closeModal}
          avatar={selectedExpert.avatar}
          name={selectedExpert.name}
          subtitle={selectedExpert.specialization}
          badges={[
            {
              label: selectedExpert.status,
              color:
                selectedExpert.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : selectedExpert.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700",
            },
            {
              label: `KYC: ${selectedExpert.kycStatus}`,
              color:
                selectedExpert.kycStatus === "Verified"
                  ? "bg-green-100 text-green-700"
                  : selectedExpert.kycStatus === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700",
            },
          ]}
          stats={[
            {
              icon: Star,
              value: selectedExpert.rating,
              label: "Rating",
              bgColor: "bg-yellow-50",
              iconColor: "text-yellow-600",
            },
            {
              icon: Briefcase,
              value: selectedExpert.totalConsultations,
              label: "Consultations",
              bgColor: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              icon: Award,
              value: `${selectedExpert.experience} yrs`,
              label: "Experience",
              bgColor: "bg-green-50",
              iconColor: "text-green-600",
            },
          ]}
          details={[
            { icon: Mail, label: "Email", value: selectedExpert.email },
            { icon: Phone, label: "Phone", value: selectedExpert.phone },
            {
              icon: MapPin,
              label: "Location",
              value:
                selectedExpert.city && selectedExpert.state
                  ? `${selectedExpert.city}, ${selectedExpert.state}`
                  : "Not provided",
            },
            { icon: Calendar, label: "Join Date", value: selectedExpert.joinDate },
            {
              icon: DollarSign,
              label: "Total Earnings",
              value: `₹${selectedExpert.totalEarnings?.toLocaleString()}`,
            },
            {
              icon: Clock,
              label: "Last Active",
              value: selectedExpert.lastActive || "N/A",
            },
          ]}
          extraInfo={{
            label: "Languages",
            value: selectedExpert.languages?.join(", ") || "Not specified",
          }}
          actions={[
            {
              label: "Approve Expert",
              onClick: () => console.log("Approve", selectedExpert.id),
              variant: "primary",
            },
            {
              label: "Suspend Expert",
              onClick: () => console.log("Suspend", selectedExpert.id),
              variant: "danger",
            },
          ]}
        />
      )}
    </>
  );
}