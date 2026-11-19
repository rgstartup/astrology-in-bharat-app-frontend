"use client";
import React, { useEffect, useState } from "react";
import { useRecentAppointmentsStore } from "@/features/dashboard/store/recent-appointments.store";
import { Search, CalendarDays } from "@repo/design/lucide";
import { cn } from "@/lib/cn";
import { format } from "date-fns";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeletons";
import UpcomingAppointmentsEmpty from "@/app/[locale]/dashboard/@recent-appointments/UpcomingAppointmentsEmpty";

interface RecentAppointment {
  id: string;
  name: string;
  service: string;
  date: string;
  status: string;
  terminatedBy?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  expired: "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
  confirmed: "bg-green-100 text-green-700",
};

function getStatusLabel(appt: RecentAppointment): string {
  if (appt.terminatedBy === "admin") return "Terminated";
  switch (appt.status) {
    case "pending": return "Waiting";
    case "active": return "Live";
    case "completed": return "Completed";
    case "expired": return "Expired";
    case "cancelled": return "Cancelled";
    case "confirmed": return "Confirmed";
    default: return appt.status;
  }
}

interface UpcomingAppointmentsClientProps {
  initialData: any[];
}

export function UpcomingAppointmentsClient({
  initialData,
}: UpcomingAppointmentsClientProps) {
  const { data, search, loading, error, fetch } = useRecentAppointmentsStore();
  const [searchTerm, setSearchTerm] = useState(search);

  // Hydrate store from server-provided initial data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      useRecentAppointmentsStore.setState({ data: initialData });
    } else {
      fetch("");
    }
  }, [initialData, fetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetch(val);
  };

  const filtered = (data || []).filter(
    (appt) =>
      appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.service.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-orange-500 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
          <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
            Recent
          </span>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-full sm:w-56 text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading && !data.length ? (
          <TableSkeleton />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Consultation Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{appt.name}</td>
                    <td className="py-3 px-4 text-gray-900 capitalize">{appt.service}</td>
                    <td className="py-3 px-4 text-gray-800 whitespace-nowrap">
                      {format(new Date(appt.date), "dd MMM yyyy, hh:mm a")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                          appt.terminatedBy === "admin"
                            ? "bg-red-100 text-red-700"
                            : STATUS_STYLES[appt.status] || "bg-gray-100 text-gray-600",
                        )}
                      >
                        {getStatusLabel(appt)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <UpcomingAppointmentsEmpty />
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
