"use client";

import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import { ProfilePicUpload } from "./ProfilePicUpload";
import { AddressFields } from "./AddressFields";
import { Link } from "@/i18n/navigation";

interface StepOnePersonalDetailsProps {
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  onNext: () => void;
}

export const StepOnePersonalDetails: React.FC<StepOnePersonalDetailsProps> = ({
  register,
  errors,
  setValue,
  watch,
  onNext,
}) => {
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    setMaxDate(new Date().toISOString().split("T")[0] || "");
  }, []);

  const currentAvatar = watch("avatar");
  const currentGender = watch("gender");

  return (
    <div className="space-y-6">
      {/* 1. Profile Picture Upload */}
      <ProfilePicUpload
        value={currentAvatar}
        onChange={(url) => setValue("avatar", url, { shouldDirty: true })}
      />

      {/* 2. Birth Details Section */}
      <div>
        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-gray-100">
          <i className="fa-solid fa-cake-candles text-orange text-sm" />
          <h5 className="text-sm font-bold text-[#301118]">
            Birth & Personal Details
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("full_name")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date of Birth <span className="text-orange">*</span>
            </label>
            <input
              type="date"
              max={maxDate}
              {...register("date_of_birth", {
                required: "Date of birth is required for astrological charts",
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${
                errors.date_of_birth
                  ? "border-red-400 bg-red-50/30"
                  : "border-gray-200 focus:border-orange"
              }`}
            />
            {errors.date_of_birth && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Time of Birth{" "}
              <span className="text-xs text-gray-400">
                (Optional if unknown)
              </span>
            </label>
            <input
              type="time"
              {...register("time_of_birth")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all"
            />
          </div>

          {/* Gender */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Gender <span className="text-orange">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: "male", label: "Male", icon: "fa-solid fa-mars" },
                  { id: "female", label: "Female", icon: "fa-solid fa-venus" },
                  {
                    id: "other",
                    label: "Other",
                    icon: "fa-solid fa-genderless",
                  },
                ] as const
              ).map((genderOption) => {
                const isSelected = currentGender === genderOption.id;
                return (
                  <button
                    key={genderOption.id}
                    type="button"
                    onClick={() =>
                      setValue("gender", genderOption.id, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? "bg-orange text-white border-orange shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-orange/40 hover:bg-orange/5"
                    }`}
                  >
                    <i className={genderOption.icon} />
                    <span>{genderOption.label}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="hidden"
              {...register("gender", { required: "Please select your gender" })}
            />
            {errors.gender && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Place of Birth */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Place of Birth{" "}
              <span className="text-xs text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <i className="fa-solid fa-location-crosshairs absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="City, State, Country (e.g. Varanasi, Uttar Pradesh)"
                {...register("place_of_birth")}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Address Section */}
      <AddressFields register={register} errors={errors} />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/client/profile"
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip for now →
        </Link>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange hover:bg-[#d64e1c] text-white text-sm font-bold shadow-md shadow-orange/20 flex items-center justify-center gap-2 transition-all hover:translate-x-0.5"
        >
          <span>Continue to Preferences</span>
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
      </div>
    </div>
  );
};
