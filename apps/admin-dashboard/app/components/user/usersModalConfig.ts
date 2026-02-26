import { Mail, Phone, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import type { User } from "@/app/components/user/user";

export const getUserProfileModalProps = (user: User) => ({
  avatar: user.avatar,
  name: user.name,
  badges: [
    {
      label: user.is_blocked ? "Blocked" : "Active",
      color: user.is_blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
    },
  ],
  details: [
    { icon: Mail, label: "Email", value: user.email || "N/A" },
    { icon: Phone, label: "Phone", value: user.phone || user.profile_client?.phone_number || "N/A" },
    {
      icon: Calendar,
      label: "Join Date",
      value: user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A",
    },
    {
      icon: DollarSign,
      label: "Consultation Spending",
      value: `₹${user.total_spent?.toLocaleString() || 0}`,
    },
    {
      icon: DollarSign,
      label: "Wallet Balance",
      value: `₹${user.wallet_balance?.toLocaleString() || 0}`,
    },
  ],
  extraInfo: {
    label: "Total Consultations",
    value: String(user.total_consultations || 0),
  },
});



