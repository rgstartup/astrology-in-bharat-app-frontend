"use client";
import React from "react";
import { XCircle, CheckCircle, Clock } from "lucide-react";

interface AppointmentCardProps {
  name: string;
  date: string;
  time: string;
  status: "canceled" | "upcoming" | "completed";
}

const statusStyles = {
  canceled: {
    icon: <XCircle className="w-6 h-6 text-red-500" />,
    bg: "bg-red-50",
    text: "text-red-600",
    label: "Canceled",
  },
  upcoming: {
    icon: <Clock className="w-6 h-6 text-yellow-500" />,
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    label: "Upcoming",
  },
  completed: {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    bg: "bg-green-50",
    text: "text-green-600",
    label: "Completed",
  },
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  name,
  date,
  time,
  status,
}) => {
  const style = statusStyles[status];

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-md ${style.bg}`}
    >
      {/* Left Section */}
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">
          {date} • {time}
        </p>
      </div>

      {/* Right Section - Status */}
      <div className="flex items-center space-x-2">
        {style.icon}
        <span className={`font-medium ${style.text}`}>{style.label}</span>
      </div>
    </div>
  );
};

export default AppointmentCard;


