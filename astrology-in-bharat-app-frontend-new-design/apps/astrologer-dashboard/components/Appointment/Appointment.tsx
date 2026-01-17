"use client";

import React, { useState } from "react";
import AppointmentStats from "./AppointmentStats";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentList from "./AppointmentList";
import AppointmentCalendar from "./AppointmentCalendar";
import RescheduleModal from "./RescheduleModal";
import { Appointment } from "./types";

export default function AppointmentsPage() {
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

  const [view, setView] = useState<"list" | "calendar">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const openRescheduleModal = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsModalOpen(true);
  };

  const handleReschedule = (
    appointment: Appointment | null,
    date: Date | null,
    time: string
  ) => {
    console.log("Rescheduling appointment:", appointment, date, time);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      <AppointmentStats />

      {/* Filters & View Toggles */}
      <AppointmentFilters view={view} setView={setView} />

      {/* Appointment List or Calendar */}
      {view === "list" ? (
        <AppointmentList
          appointments={mockAppointments}
          onReschedule={openRescheduleModal}
        />
      ) : (
        <AppointmentCalendar appointments={mockAppointments} />
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleReschedule}
      />
    </div>
  );
}
