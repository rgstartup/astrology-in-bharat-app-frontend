import { Mail, Phone, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import type { User } from "@/app/components/user/user";

export const getUserProfileModalProps = (user: User) => ({
  avatar: user.avatar,
  name: user.name,
  badges: [
    {
      label: user.status || (user.isBlocked ? "Blocked" : "Active"),
      color: user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
    },
  ],
  details: [
    { icon: Mail, label: "Email", value: user.email || "N/A" },
    { icon: Phone, label: "Phone", value: user.phone || "N/A" },
    {
      icon: MapPin,
      label: "Location",
      value: user.city && user.state ? `${user.city}, ${user.state}` : "Not provided",
    },
    { icon: Calendar, label: "Join Date", value: user.joinDate || "N/A" },
    {
      icon: DollarSign,
      label: "Consultation Spending",
      value: `₹${user.totalSpent?.toLocaleString() || 0}`,
    },
    {
      icon: DollarSign,
      label: "Wallet Balance",
      value: `₹${(user as any).walletBalance?.toLocaleString() || 0}`,
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