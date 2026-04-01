'use client'
import React, { useState, useEffect } from "react";
import { Search, CalendarDays, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";

interface RecentAppointment {
  id: number | string;
  name: string;
  email: string;
  date: string;
  status: string;
  terminatedBy?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  active:    "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  expired:   "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
  confirmed: "bg-green-100 text-green-700",
};

function getStatusLabel(appt: RecentAppointment): string {
  if (appt.terminatedBy === "admin") return "Terminated";
  switch (appt.status) {
    case "pending":   return "Waiting";
    case "active":    return "Live";
    case "completed": return "Completed";
    case "expired":   return "Expired";
    case "cancelled": return "Cancelled";
    case "confirmed": return "Confirmed";
    default:          return appt.status;
  }
}

export const UpcomingAppointments: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const fetchTodayAppointments = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [chatPendingRes, chatCompletedRes, callPendingRes, callCompletedRes] =
          await Promise.allSettled([
            api.get("/chat/sessions/appointments/pending"),
            api.get("/chat/sessions/appointments/completed"),
            api.get("/call/sessions/appointments/pending"),
            api.get("/call/sessions/appointments/completed"),
          ]);

        const getSessions = (res: PromiseSettledResult<any>) => {
          if (res.status !== "fulfilled") return [];
          const [data, error] = res.value; // res.value is now the [data, error] tuple
          if (error) return [];
          return Array.isArray(data) ? data : [];
        };

        const allSessions = [
          ...getSessions(chatPendingRes),
          ...getSessions(chatCompletedRes),
          ...getSessions(callPendingRes),
          ...getSessions(callCompletedRes),
        ];

        // Deduplicate by id
        const seen = new Set<string>();
        const unique = allSessions.filter((s) => {
          const key = String(s.id);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Filter to today only
        const todayAppts: RecentAppointment[] = unique
          .filter((s) => {
            const sessionDate = (s.created_at || s.createdAt || "").split("T")[0];
            return sessionDate === today;
          })
          .sort((a: any, b: any) => {
            return (
              new Date(b.created_at || b.createdAt || 0).getTime() -
              new Date(a.created_at || a.createdAt || 0).getTime()
            );
          })
          .map((s: any) => ({
            id: s.id,
            name: s.user?.name || "Client",
            email: s.user?.email || "—",
            date: s.created_at || s.createdAt || new Date().toISOString(),
            status: s.status || "pending",
            terminatedBy: s.terminated_by || s.terminatedBy,
          }));

        setAppointments(todayAppts);
      } catch (err) {
        console.error("[RecentAppointments] Fetch failed:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, [isAuthenticated, user]);

  const filtered = appointments.filter(
    (appt) =>
      appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
          <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
            Today
          </span>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-full sm:w-56 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading appointments…</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Consultation Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{appt.name}</td>
                    <td className="py-3 px-4 text-gray-500 truncate max-w-[160px]">{appt.email}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                      {format(new Date(appt.date), "dd MMM yyyy, hh:mm a")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                          appt.terminatedBy === "admin"
                            ? "bg-red-100 text-red-700"
                            : STATUS_STYLES[appt.status] || "bg-gray-100 text-gray-600"
                        )}
                      >
                        {getStatusLabel(appt)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                    {searchTerm ? "No appointments match your search." : "No appointments today."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
