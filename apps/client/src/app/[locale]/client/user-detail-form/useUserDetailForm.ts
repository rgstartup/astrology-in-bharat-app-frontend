"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserDetails } from "@/lib/types";

export const useUserDetailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const expertName = searchParams.get("name") || "Expert";
  const rate = searchParams.get("price") || "20";

  const [formData, setFormData] = useState<UserDetails>({
    name: "",
    gender: "",
    dateOfBirth: "",
    timeOfBirth: "",
    birthLocation: "",
  });

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [duration, setDuration] = useState("15");

  const totalAmount = Number(rate) * Number(duration);

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserDetails | "bookingDate" | "bookingTime", string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserDetails]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserDetails | "bookingDate" | "bookingTime", string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.gender) newErrors.gender = "Please select your gender";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.timeOfBirth) newErrors.timeOfBirth = "Time of birth is required";
    if (!formData.birthLocation.trim()) newErrors.birthLocation = "Birth location is required";
    if (!bookingDate) newErrors.bookingDate = "Booking date is required";
    if (!bookingTime) newErrors.bookingTime = "Booking time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem("userDetails", JSON.stringify(formData));
      const params = new URLSearchParams({
        name: expertName,
        price: rate,
        date: bookingDate,
        time: bookingTime,
        duration,
        total: String(totalAmount),
        userName: formData.name,
      });
      router.push(`/client/checkout?${params.toString()}`);
    }
  };

  return {
    expertName, rate, formData, setFormData,
    bookingDate, setBookingDate, bookingTime, setBookingTime,
    duration, setDuration, totalAmount, errors, setErrors,
    handleChange, handleSubmit
  };
};
