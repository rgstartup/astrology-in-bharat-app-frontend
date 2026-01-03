import React from "react";
import { Clock, Video, RefreshCw, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";
import StatusBadge from "./StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
  statusColors: Record<Appointment["status"], string>;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
}

export default function AppointmentCard({
  appointment,
  statusColors,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 space-y-3 hover:shadow-xl transition-all">
      <div>
        <h3 className="font-semibold text-gray-900">{appointment.name}</h3>
        <p className="text-sm text-gray-600">{appointment.service}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <Clock className="w-4 h-4" />
          <span>
            {format(new Date(appointment.date), "dd MMM yyyy, hh:mm a")}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={appointment.status} statusColors={statusColors} />
        <span className="text-xs text-gray-500">
          {appointment.type === "new" ? "🆕 New" : "🔄 Follow-up"}
        </span>
        {appointment.reminder && (
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
            🔔 Reminder Sent
          </span>
        )}
      </div>

      {/* Actions stacked */}
      <div className="flex flex-col gap-2">
        <a
          href={"http://localhost:3003/join-live-session"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-3 py-2.5 bg-yellow-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-700 shadow-sm transition-all"
        >
          <Video className="w-4 h-4" /> Join
        </a>
        <button
          onClick={() => onReschedule(appointment)}
          className="w-full px-3 py-2.5 bg-yellow-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-600 shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reschedule
        </button>
        <button
          onClick={() => onCancel(appointment.id)}
          className="w-full px-3 py-2.5 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 shadow-sm transition-all"
        >
          <XCircle className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}