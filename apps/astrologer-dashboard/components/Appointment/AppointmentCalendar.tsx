import React from "react";
import Calendar from "react-calendar";
import { Appointment } from "./types";

interface AppointmentCalendarProps {
    appointments: Appointment[];
}

export default function AppointmentCalendar({
    appointments,
}: AppointmentCalendarProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <Calendar
                onClickDay={(value) => console.log("Clicked date:", value)}
                className="w-full"
                tileContent={({ date }) => {
                    const dayAppointments = appointments.filter(
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
    );
}


