"use client";

import React from "react";
import { Clock, Video, RefreshCw, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";
import AppointmentCard from "./AppointmentCard";
import AppointmentTableRow from "./AppointmentTableRow";

interface AppointmentListProps {
  appointments: Appointment[];
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
}

export default function AppointmentList({ 
  appointments, 
  onReschedule, 
  onCancel 
}: AppointmentListProps) {
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

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-gray-100 divide-y divide-gray-100">
        {appointments.map((appt) => (
          <AppointmentTableRow
            key={appt.id}
            appointment={appt}
            statusColors={statusColors}
            onReschedule={onReschedule}
            onCancel={onCancel}
          />
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 sm:hidden">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            statusColors={statusColors}
            onReschedule={onReschedule}
            onCancel={onCancel}
          />
        ))}
      </div>
    </section>
  );
}