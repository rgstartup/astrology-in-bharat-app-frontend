import React from "react";
import {
    Clock,
    Video,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";

interface AppointmentListProps {
    appointments: Appointment[];
    onReschedule: (appt: Appointment) => void;
}

export default function AppointmentList({
    appointments,
    onReschedule,
}: AppointmentListProps) {
    // Utility function for classnames
    const cn = (...classes: (string | undefined | null | boolean)[]) =>
        classes.filter(Boolean).join(" ");

    const statusColors: Record<Appointment["status"], string> = {
        confirmed: "bg-green-100 text-green-600",
        pending: "bg-yellow-100 text-yellow-600",
        cancelled: "bg-red-100 text-red-600",
    };

    return (
        <section aria-labelledby="appointment-list-heading" className="space-y-4">
            <h2 id="appointment-list-heading" className="sr-only">
                Appointment List
            </h2>

            {/* Desktop Table Style Cards */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-gray-100 divide-y divide-gray-100">
                {appointments.map((appt) => (
                    <div
                        key={appt.id}
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                        {/* Left Section: Client Info & Details */}
                        <div className="flex items-start lg:items-center gap-5 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-2xl ring-2 ring-yellow-500">
                                {appt.name.charAt(0)}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl md:text-xl font-bold text-gray-900 truncate">
                                    {appt.name}
                                </h3>
                                <p className="text-sm font-medium text-gray-600 truncate">
                                    {appt.service}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>
                                        {format(new Date(appt.date), "dd MMM yyyy 'at' hh:mm a")}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span
                                        className={cn(
                                            "inline-block px-3 py-1 text-xs rounded-full font-medium shadow-sm capitalize border border-current",
                                            statusColors[appt.status]
                                        )}
                                    >
                                        {appt.status}
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                                        {appt.type === "new" ? "🆕 New Client" : "Follow-up"}
                                    </span>
                                    {appt.reminder && (
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
                                onClick={() => onReschedule(appt)}
                                className="px-5 py-3 text-sm bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-gray-300 shadow-sm transition-all w-full sm:w-auto"
                            >
                                <RefreshCw className="w-5 h-5" /> Reschedule
                            </button>
                            <button className="px-5 py-3 text-sm bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-red-700 shadow-sm transition-all w-full sm:w-auto">
                                <XCircle className="w-5 h-5" /> Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 sm:hidden">
                {appointments.map((appt) => (
                    <div
                        key={appt.id}
                        className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 space-y-3 hover:shadow-xl transition-all"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-900">{appt.name}</h3>
                            <p className="text-sm text-gray-600">{appt.service}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {format(new Date(appt.date), "dd MMM yyyy, hh:mm a")}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span
                                className={cn(
                                    "px-3 py-1 text-xs rounded-full font-medium shadow-sm",
                                    statusColors[appt.status]
                                )}
                            >
                                {appt.status}
                            </span>
                            <span className="text-xs text-gray-500">
                                {appt.type === "new" ? "🆕 New" : "🔄 Follow-up"}
                            </span>
                            {appt.reminder && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                                    🔔 Reminder Sent
                                </span>
                            )}
                        </div>

                        {/* Actions stacked */}
                        <div className="flex flex-col gap-2">
                            <a
                                href={appt.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3 py-2.5 bg-yellow-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-700 shadow-sm transition-all"
                            >
                                <Video className="w-4 h-4" /> Join
                            </a>
                            <button
                                onClick={() => onReschedule(appt)}
                                className="w-full px-3 py-2.5 bg-yellow-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-600 shadow-sm transition-all"
                            >
                                <RefreshCw className="w-4 h-4" /> Reschedule
                            </button>
                            <button className="w-full px-3 py-2.5 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 shadow-sm transition-all">
                                <XCircle className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
