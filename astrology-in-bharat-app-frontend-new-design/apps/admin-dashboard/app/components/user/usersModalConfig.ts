import { Mail, Phone, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import type { User } from "@/app/components/user/user";

export const getUserProfileModalProps = (user: User) => ({
  avatar: user.avatar,
  name: user.name,
  badges: [
    {
      label: user.status,
      color: user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
    },
  ],
  details: [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phone },
    {
      icon: MapPin,
      label: "Location",
      value: user.city && user.state ? `${user.city}, ${user.state}` : "Not provided",
    },
    { icon: Calendar, label: "Join Date", value: user.joinDate },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `₹${user.totalSpent?.toLocaleString() || 0}`,
    },
    {
      icon: Clock,
      label: "Last Active",
      value: user.lastActive || "N/A",
    },
  ],
  extraInfo: {
    label: "Total Consultations",
    value: String(user.totalConsultations || 0),
  },
});