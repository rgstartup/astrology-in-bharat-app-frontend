import React, { useState } from "react";
import { XCircle } from "lucide-react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { Appointment } from "./types";
import Button from "../ui/Button";

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onConfirm: (
        appointment: Appointment | null,
        date: Date | null,
        time: string
    ) => void;
}

export default function RescheduleModal({
    isOpen,
    onClose,
    appointment,
    onConfirm,
}: RescheduleModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");

    if (!isOpen || !appointment) return null;

    const handleConfirm = () => {
        onConfirm(appointment, selectedDate, selectedTime);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Reschedule Appointment
                    </h3>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        aria-label="Close modal"
                        className="text-gray-400 hover:text-gray-600 p-0 hover:bg-transparent"
                    >
                        <XCircle className="w-6 h-6" />
                    </Button>
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
                                    {appointment.name}
                                </span>
                            </p>
                            <p className="font-medium text-gray-800">
                                Service:{" "}
                                <span className="font-normal text-gray-600">
                                    {appointment.service}
                                </span>
                            </p>
                            <p className="font-medium text-gray-800">
                                Current Date:{" "}
                                <span className="font-normal text-gray-600">
                                    {format(new Date(appointment.date), "dd-MMMM-yyyy hh:mm a")}
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
                            // onChange={(date: Date) => setSelectedDate(date)} // Note: react-calendar types might need adjustment depending on version
                            className="w-full"
                        />
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-black"
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
                    <Button
                        onClick={onClose}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedTime}
                        variant="primary"
                    >
                        Confirm Reschedule
                    </Button>
                </div>
            </div>
        </div>
    );
}
