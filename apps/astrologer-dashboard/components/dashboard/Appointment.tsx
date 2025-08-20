"use client";

import { useState } from "react";
import {
  Clock,
  Video,
  RefreshCw,
  XCircle,
  List,
  LayoutGrid,
  CalendarDays,
  CheckCircle,
  XOctagon,
  ArrowUpRight,
} from "lucide-react";
import Calendar from "react-calendar";
import { format } from "date-fns";

// Utility function for classnames
const cn = (...classes: (string | undefined | null | boolean)[]) =>
  classes.filter(Boolean).join(" ");

interface Appointment {
  id: number;
  name: string;
  service: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  type: "new" | "follow-up";
  reminder: boolean;
  meetingLink: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    name: "Dr. Sharma",
    service: "Astrology Consultation",
    date: "2025-08-19 10:00",
    status: "confirmed",
    type: "new",
    reminder: true,
    meetingLink: "#",
  },
  {
    id: 2,
    name: "Dr. Patel",
    service: "Follow-up Consultation",
    date: "2025-08-20 14:30",
    status: "pending",
    type: "follow-up",
    reminder: false,
    meetingLink: "#",
  },
  {
    id: 3,
    name: "Dr. Khan",
    service: "Career Guidance",
    date: "2025-08-26 16:00",
    status: "cancelled",
    type: "new",
    reminder: true,
    meetingLink: "#",
  },
];

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const statusColors: Record<Appointment["status"], string> = {
    confirmed: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    cancelled: "bg-red-100 text-red-600",
  };

  const openRescheduleModal = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setSelectedDate(null);
    setSelectedTime("");
    setIsModalOpen(true);
  };

  const handleReschedule = () => {
    console.log(
      "Rescheduling appointment:",
      selectedAppointment,
      selectedDate,
      selectedTime
    );
    setIsModalOpen(false);
  };

  const formatDateWithTime = (date: Date, time: string) => {
    if (!date) return "";
    const dateString = format(date, "dd-MMMM-yyyy");
    if (!time) return dateString;
    return `${dateString} ${time}`;
  };

  return (
    <div className=" space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      <section aria-labelledby="appointment-stats-heading">
        <h2 id="appointment-stats-heading" className="sr-only">
          Appointment Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Appointments"
            value="32"
            change="+12%"
            changeType="up"
            icon={CalendarDays}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Completed"
            value="20"
            change="+5%"
            changeType="up"
            icon={CheckCircle}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Cancelled"
            value="5"
            change="-2%"
            changeType="down"
            icon={XOctagon}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
          <StatsCard
            title="Upcoming"
            value="7"
            change="+3%"
            changeType="up"
            icon={ArrowUpRight}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
      </section>

      {/* Filters & View Toggles */}
      <section aria-labelledby="appointment-filters-heading">
        <h2 id="appointment-filters-heading" className="sr-only">
          Appointment Filters
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-lg border border-gray-200">

          {/* Search Input */}
          <div className="flex-1 min-w-[220px] relative">
            <input
              type="text"
              placeholder="Search by name or service..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
              </svg>
            </span>
          </div>

          {/* Date Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            />
            <input
              type="date"
              className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            />

            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            >
              <option value="earliest">Sort by Time (Earliest)</option>
              <option value="latest">Sort by Time (Latest)</option>
            </select>
          </div>

          {/* View toggles */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center",
                view === "list"
                  ? "bg-yellow-600 text-white shadow-md ring-1 ring-yellow-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
              aria-label="Switch to list view"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("calendar")}
              className={cn(
                "p-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center",
                view === "calendar"
                  ? "bg-yellow-600 text-white shadow-md ring-1 ring-yellow-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
              aria-label="Switch to calendar view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>


      {/* Appointment List or Calendar */}
      {view === "list" ? (
        <section aria-labelledby="appointment-list-heading" className="space-y-4">
          <h2 id="appointment-list-heading" className="sr-only">
            Appointment List
          </h2>

          {/* Desktop Table Style Cards */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-gray-100 divide-y divide-gray-100">
            {mockAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Left Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{appt.name}</h3>
                  <p className="text-sm text-gray-600">{appt.service}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(appt.date), "dd MMM yyyy, hh:mm a")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className={cn(
                        "inline-block px-3 py-1 text-xs rounded-full font-medium shadow-sm",
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
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-shrink-0">
                  <a
                    href={appt.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 text-sm bg-teal-600 text-white rounded-xl flex items-center gap-2 hover:bg-teal-700 shadow-sm transition-all"
                  >
                    <Video className="w-4 h-4" /> Join
                  </a>
                  <button
                    onClick={() => openRescheduleModal(appt)}
                    className="px-4 py-2.5 text-sm bg-yellow-600 text-white rounded-xl flex items-center gap-2 hover:bg-yellow-700 shadow-sm transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> Reschedule
                  </button>
                  <button className="px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl flex items-center gap-2 hover:bg-red-700 shadow-sm transition-all">
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 sm:hidden">
            {mockAppointments.map((appt) => (
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
                    onClick={() => openRescheduleModal(appt)}
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
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <Calendar
            onClickDay={(value) => console.log("Clicked date:", value)}
            className="w-full"
            tileContent={({ date }) => {
              const dayAppointments = mockAppointments.filter(
                (appt) => new Date(appt.date).toDateString() === date.toDateString()
              );
              return (
                <div>
                  {dayAppointments.length > 0 && (
                    <span className="block text-xs mt-1 text-blue-600 font-medium">
                      {dayAppointments.length} appt
                    </span>
                  )}
                </div>
              );
            }}
          />
        </div>
      )}


      {/* Reschedule Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Reschedule Appointment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  Client Details
                </h4>
                <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                  <p className="font-medium text-gray-800">
                    Name:{" "}
                    <span className="font-normal text-gray-600">
                      {selectedAppointment.name}
                    </span>
                  </p>
                  <p className="font-medium text-gray-800">
                    Service:{" "}
                    <span className="font-normal text-gray-600">
                      {selectedAppointment.service}
                    </span>
                  </p>
                  <p className="font-medium text-gray-800">
                    Current Date:{" "}
                    <span className="font-normal text-gray-600">
                      {format(
                        new Date(selectedAppointment.date),
                        "dd-MMMM-yyyy hh:mm a"
                      )}
                    </span>
                  </p>
                </div>
              </div>

              {/* Calendar for Rescheduling */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  Select New Date & Time
                </h4>
                <Calendar
                  value={selectedDate || new Date()}
                  // onChange={(date: Date) => setSelectedDate(date)}
                  className="w-full"
                />
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Select Time Slot</option>
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:15 AM</option>
                  <option>12:30 PM</option>
                  <option>02:00 PM</option>
                  <option>03:15 PM</option>
                  <option>04:30 PM</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={!selectedDate || !selectedTime}
                className={cn(
                  "px-6 py-2 rounded-lg text-white transition-colors duration-200",
                  !selectedDate || !selectedTime
                    ? "bg-yellow-600 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700"
                )}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// StatsCard component unchanged
function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {changeType === "up" ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-red-500 rotate-180" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                changeType === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {change}
            </span>
            <span className="text-sm text-gray-500">last week</span>
          </div>
        </div>
        <div className={cn("p-3 rounded-lg", iconBg)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
