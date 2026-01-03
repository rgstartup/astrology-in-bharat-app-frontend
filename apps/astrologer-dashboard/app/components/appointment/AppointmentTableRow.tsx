import React from "react";
import { Clock, Video, RefreshCw, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";
import StatusBadge from "./StatusBadge";

interface AppointmentTableRowProps {
  appointment: Appointment;
  statusColors: Record<Appointment["status"], string>;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
}

export default function AppointmentTableRow({
  appointment,
  statusColors,
  onReschedule,
  onCancel,
}: AppointmentTableRowProps) {
  const cn = (...classes: (string | undefined | null | boolean)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
      {/* Left Section */}
      <div className="flex items-start lg:items-center gap-5 flex-1 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-2xl ring-2 ring-yellow-500">
          {appointment.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-xl font-bold text-gray-900 truncate">
            {appointment.name}
          </h3>
          <p className="text-sm font-medium text-gray-600 truncate">
            {appointment.service}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              {format(new Date(appointment.date), "dd MMM yyyy 'at' hh:mm a")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <StatusBadge
              status={appointment.status}
              statusColors={statusColors}
            />
            <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
              {appointment.type === "new" ? "🆕 New Client" : "Follow-up"}
            </span>
            {appointment.reminder && (
              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium border border-blue-200">
                🔔 Reminder Sent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
        <a
          href={"http://localhost:3003/join-live-session"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 text-sm bg-yellow-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-yellow-700 shadow-sm transition-all w-full sm:w-auto"
        >
          <Video className="w-5 h-5" /> Join Meeting
        </a>
        <button
          onClick={() => onReschedule(appointment)}
          className="px-5 py-3 text-sm bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-gray-300 shadow-sm transition-all w-full sm:w-auto"
        >
          <RefreshCw className="w-5 h-5" /> Reschedule
        </button>
        <button
          onClick={() => onCancel(appointment.id)}
          className="px-5 py-3 text-sm bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-red-700 shadow-sm transition-all w-full sm:w-auto"
        >
          <XCircle className="w-5 h-5" /> Cancel
        </button>
      </div>
    </div>
  );
}