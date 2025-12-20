import { UserCheck, Clock, Award, Star } from "lucide-react";
import type { Expert } from "@/app/components/expert/expert";

export const expertsData: Expert[] = [
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
];

export const getStatsConfig = (experts: Expert[]) => {
  const activeExperts = experts.filter((e) => e.status === "Active").length;
  const pendingExperts = experts.filter((e) => e.status === "Pending").length;
  const verifiedExperts = experts.filter((e) => e.kycStatus === "Verified").length;

  return [
    {
      title: "Total Experts",
      value: experts.length,
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
};

export const getColumns = () => [
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
        <span className="text-sm font-semibold text-gray-900">{expert.rating}</span>
      </div>
    ),
  },
  {
    key: "consultations",
    label: "Consultations",
    render: (expert: Expert) => (
      <p className="text-sm text-gray-900 font-medium">{expert.totalConsultations}</p>
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