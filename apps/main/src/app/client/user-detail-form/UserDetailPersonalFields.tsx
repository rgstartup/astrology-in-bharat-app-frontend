"use client";

import React from "react";
import { UserDetails, UserDetailPersonalFieldsProps } from "@/lib/types";

const UserDetailPersonalFields: React.FC<UserDetailPersonalFieldsProps> = ({
  formData,
  errors,
  handleChange,
}) => {
  const [maxDate, setMaxDate] = React.useState("");

  React.useEffect(() => {
    setMaxDate(new Date().toISOString().split("T")[0] || "");
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.name ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
          placeholder="Enter Your Full Name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.gender ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="mt-1 text-sm text-red-500 font-medium">{errors.gender}</p>}
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          max={maxDate}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.dateOfBirth ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
        />
        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500 font-medium">{errors.dateOfBirth}</p>}
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Time of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          name="timeOfBirth"
          value={formData.timeOfBirth}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.timeOfBirth ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
        />
        {errors.timeOfBirth && <p className="mt-1 text-sm text-red-500 font-medium">{errors.timeOfBirth}</p>}
      </div>

      <div className="flex flex-col md:col-span-2">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Birth Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="birthLocation"
          value={formData.birthLocation}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-primary/10 ${
            errors.birthLocation ? "border-red-500 bg-red-50/30" : "border-[#daa23e73] focus:border-primary"
          }`}
          placeholder="City, State, Country"
        />
        {errors.birthLocation && (
          <p className="mt-1 text-sm text-red-500 font-medium">{errors.birthLocation}</p>
        )}
      </div>
    </div>
  );
};

export default UserDetailPersonalFields;
