"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getClientProfile, updateClientProfile } from "@/libs/api-profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Skeleton,
} from "@/features/dashboard";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function DashboardProfilePage() {
  const { user, updateUser, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    gender: "other",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    address_line1: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    let isMounted = true;
    const loadProfileData = async () => {
      setIsLoading(true);
      const [profileRes, profileErr] = await getClientProfile();
      if (!isMounted) return;

      const profile = profileRes?.data ?? profileRes;
      const currentUser = profile?.user || user;

      const primaryAddress = profile?.addresses?.[0] || {};

      setFormData({
        full_name: profile?.full_name || currentUser?.name || "",
        phone: profile?.phone || currentUser?.phone || "",
        email: currentUser?.email || "",
        gender: profile?.gender || "other",
        date_of_birth: (profile?.date_of_birth || currentUser?.date_of_birth || "").split("T")[0],
        time_of_birth: profile?.time_of_birth || currentUser?.time_of_birth || "",
        place_of_birth: profile?.place_of_birth || currentUser?.place_of_birth || "",
        address_line1: primaryAddress.line1 || "",
        city: primaryAddress.city || "",
        state: primaryAddress.state || "",
        zip_code: primaryAddress.zip_code || "",
      });

      setIsLoading(false);
    };

    loadProfileData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload: any = {
      full_name: formData.full_name,
      phone: formData.phone,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth || undefined,
      time_of_birth: formData.time_of_birth || undefined,
      place_of_birth: formData.place_of_birth || undefined,
    };

    if (formData.address_line1 || formData.city || formData.state || formData.zip_code) {
      payload.addresses = [
        {
          line1: formData.address_line1,
          city: formData.city,
          state: formData.state,
          country: "India",
          zip_code: formData.zip_code,
        },
      ];
    }

    const [res, err] = await updateClientProfile(payload);
    setIsSaving(false);

    if (err) {
      const msg = err.message || "Failed to update profile. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } else {
      setSuccessMessage("Profile updated successfully!");
      toast.success("Profile saved!");
      updateUser({
        name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        time_of_birth: formData.time_of_birth,
        place_of_birth: formData.place_of_birth,
      } as any);

      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-orange-100" />
        <Card className="p-6 bg-white border-orange-100 space-y-4">
          <Skeleton className="h-10 w-full bg-orange-100" />
          <Skeleton className="h-10 w-full bg-orange-100" />
          <Skeleton className="h-10 w-full bg-orange-100" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit flex items-center gap-2">
            <span>My Profile</span>
            <Badge variant="outline" className="text-[11px] font-bold border-amber-300 text-amber-800 bg-amber-50">
              Vedic Identity
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage your personal profile and astrological birth information
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Vedic Birth Details */}
        <Card className="border-amber-200/90 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 overflow-hidden shadow-sm">
          <CardHeader className="border-b border-amber-100/80 bg-amber-50/50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#301118] text-amber-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-[#301118]">
                  Astrological Birth Details
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Used to generate accurate Kundli charts, dashas, and personalized daily guidance
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Date of Birth</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Time of Birth</span>
              </label>
              <input
                type="time"
                name="time_of_birth"
                value={formData.time_of_birth}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Place of Birth</span>
              </label>
              <input
                type="text"
                name="place_of_birth"
                placeholder="e.g. New Delhi, India"
                value={formData.place_of_birth}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Personal Information */}
        <Card className="border-orange-100 bg-white shadow-sm">
          <CardHeader className="border-b border-orange-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff6b00] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-[#301118]">
                Personal Information
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Delivery Address */}
        <Card className="border-orange-100 bg-white shadow-sm">
          <CardHeader className="border-b border-orange-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff6b00] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-[#301118]">
                Shipping / Delivery Address
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address / House No.
              </label>
              <input
                type="text"
                name="address_line1"
                placeholder="123 Astro Lane, Flat 402"
                value={formData.address_line1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State
              </label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Postal / Zip Code
              </label>
              <input
                type="text"
                name="zip_code"
                placeholder="e.g. 400001"
                value={formData.zip_code}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
            className="font-bold px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            <span>{isSaving ? "Saving..." : "Save Profile"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
