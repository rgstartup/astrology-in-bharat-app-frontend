import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Star,
  Award,
  Briefcase,
} from "lucide-react";
import type { Expert } from "@/app/components/expert/expert";

export const getProfileModalProps = (expert: Expert) => ({
  avatar: expert.avatar,
  name: expert.name,
  subtitle: expert.specialization,
  badges: [
    {
      label: expert.status,
      color:
        expert.status === "Active"
          ? "bg-green-100 text-green-700"
          : expert.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700",
    },
    {
      label: `KYC: ${expert.kycStatus}`,
      color:
        expert.kycStatus === "Verified"
          ? "bg-green-100 text-green-700"
          : expert.kycStatus === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700",
    },
  ],
  stats: [
    {
      icon: Star,
      value: expert.rating,
      label: "Rating",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      icon: Briefcase,
      value: expert.totalConsultations,
      label: "Consultations",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Award,
      value: `${expert.experience} years`,
      label: "Experience",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: DollarSign,
      value: `₹${(expert.totalEarnings / 1000).toFixed(0)}k`,
      label: "Total Earnings",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ],
  details: [
    { icon: Mail, label: "Email", value: expert.email },
    { icon: Phone, label: "Phone", value: expert.phone },
    {
      icon: MapPin,
      label: "Location",
      value: `${expert.city}, ${expert.state}`,
    },
    {
      icon: Calendar,
      label: "Joined",
      value: new Date(expert.joinDate).toLocaleDateString("en-IN"),
    },
    {
      icon: Clock,
      label: "Last Active",
      value: expert.lastActive || "N/A",
    },
  ],
  sections: [
    {
      title: "Languages",
      content: expert.languages?.join(", ") || "Not specified",
    },
    {
      title: "Specialization",
      content: expert.specialization,
    },
  ],
});