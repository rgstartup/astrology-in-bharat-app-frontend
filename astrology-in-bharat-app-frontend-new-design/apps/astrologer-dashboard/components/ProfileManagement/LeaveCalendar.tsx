import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { LeaveDate } from "./types";

interface LeaveCalendarProps {
    leaveDates: LeaveDate[];
    onAdd: (date: string, reason: string) => void;
    onDelete: (id: number) => void;
}

export default function LeaveCalendar({
    leaveDates,
    onAdd,
    onDelete,
}: LeaveCalendarProps) {
    const [newLeaveDate, setNewLeaveDate] = useState("");
    const [newLeaveReason, setNewLeaveReason] = useState("");

    const handleAdd = () => {
        if (newLeaveDate && newLeaveReason.trim()) {
            onAdd(newLeaveDate, newLeaveReason);
            setNewLeaveDate("");
            setNewLeaveReason("");
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-base sm:text-lg font-semibold">
                    <CalendarIcon className="w-5 h-5 mr-2 text-yellow-600" /> Leave
                    Calendar
                </h2>
                <span className="text-xs sm:text-sm text-gray-500">
                    {leaveDates.length} scheduled
                </span>
            </div>

            {/* Add Leave Date */}
            <div className="space-y-2 mb-4">
                <input
                    type="date"
                    value={newLeaveDate}
                    onChange={(e) => setNewLeaveDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newLeaveReason}
                        onChange={(e) => setNewLeaveReason(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Reason for leave..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                        onClick={handleAdd}
                        className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Leave Dates List */}
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar-yellow">
                {leaveDates.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">
                        No leaves scheduled
                    </p>
                ) : (
                    leaveDates
                        .sort(
                            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                        )
                        .map((leave) => {
                            const leaveDate = new Date(leave.date);
                            const isPast = leaveDate < new Date();
                            return (
                                <div
                                    key={leave.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${isPast
                                            ? "bg-gray-50 border-gray-200 opacity-60"
                                            : "bg-red-50 border-red-200"
                                        }`}
                                >
                                    <div className="flex-1">
                                        <p
                                            className={`font-semibold text-sm ${isPast ? "text-gray-600" : "text-gray-800"
                                                }`}
                                        >
                                            {leaveDate.toLocaleDateString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p
                                            className={`text-xs ${isPast ? "text-gray-500" : "text-gray-600"
                                                }`}
                                        >
                                            {leave.reason}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onDelete(leave.id)}
                                        className="flex-shrink-0 text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
}
