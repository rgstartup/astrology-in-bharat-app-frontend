"use client";

import React from "react";
import { UserDetailBookingFieldsProps } from "@/lib/types";

const UserDetailBookingFields: React.FC<UserDetailBookingFieldsProps> = ({
  bookingDate,
  bookingTime,
  duration,
  errors,
  setBookingDate,
  setBookingTime,
  setDuration,
  clearError,
}) => {
  const [minDate, setMinDate] = React.useState<string>("");

  React.useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0] || "");
  }, []);

  const minsOptions = ["5", "10", "15", "30", "45", "60"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-6">
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Appointment Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.bookingDate ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
          value={bookingDate}
          min={minDate}
          onChange={(e) => {
            setBookingDate(e.target.value);
            clearError("bookingDate");
          }}
        />
        {errors.bookingDate && (
          <p className="mt-1 text-sm text-red-500 font-medium">{errors.bookingDate}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Appointment Time <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.bookingTime ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
          value={bookingTime}
          onChange={(e) => {
            setBookingTime(e.target.value);
            clearError("bookingTime");
          }}
        />
        {errors.bookingTime && (
          <p className="mt-1 text-sm text-red-500 font-medium">{errors.bookingTime}</p>
        )}
      </div>

      <div className="flex flex-col md:col-span-2">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Duration (Minutes)</label>
        <div className="flex flex-wrap gap-2">
          {minsOptions.map((mins) => (
            <button
              key={mins}
              type="button"
              className={`px-4 py-2 rounded-lg border transition-all font-medium text-sm min-w-[80px] ${
                duration === mins
                  ? "bg-[#732882] border-[#732882] text-white shadow-md"
                  : "bg-transparent border-[#732882] text-[#732882] hover:bg-[#732882]/5"
              }`}
              onClick={() => setDuration(mins)}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailBookingFields;
