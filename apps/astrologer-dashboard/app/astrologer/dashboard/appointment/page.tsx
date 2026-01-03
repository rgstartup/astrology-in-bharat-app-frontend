"use client";

import AppointmentList from '@/app/components/appointment/Appointment';
import React, { useState } from 'react';
import { Appointment } from '@/app/components/appointment/types';

// Dummy data matching the Appointment interface
const initialAppointments: Appointment[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    service: "Doubt Clearing",
    date: "2024-02-21T10:30:00",
    status: "confirmed",
    type: "new",
    reminder: true,
    meetingLink: "http://localhost:3003/join-live-session"
  },
  {
    id: 2,
    name: "Priya Singh",
    service: "Kundli Analysis",
    date: "2024-02-21T14:00:00",
    status: "pending",
    type: "follow-up",
    reminder: false,
    meetingLink: "http://localhost:3003/join-live-session"
  },
  {
    id: 3,
    name: "Amit Patel",
    service: "Career Consultation",
    date: "2024-02-22T09:00:00",
    status: "cancelled",
    type: "new",
    reminder: false,
    meetingLink: "http://localhost:3003/join-live-session"
  }
];

const Page = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleReschedule = (appointment: Appointment) => {
    console.log("Rescheduling", appointment);
  };

  const handleCancel = (id: number) => {
    console.log("Cancelling", id);
    setAppointments(prev => prev.filter(appt => appt.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Appointments</h1>
      <AppointmentList
        appointments={appointments}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default Page;