"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfilePicUpload } from "@/features/onboard/components/ProfilePicUpload";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Save,
  Sparkles,
  Mars,
  Venus,
  CircleDot,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schema/profile.schema";

export type { ProfileFormValues };

interface ProfileUpdateFormProps {
  defaultValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isSaving?: boolean;
  avatarUrl?: string;
  onAvatarChange?: (url: string) => void;
}

const GENDER_OPTIONS = [
  { id: "male" as const, label: "Male", icon: Mars },
  { id: "female" as const, label: "Female", icon: Venus },
  { id: "other" as const, label: "Other", icon: CircleDot },
];

// Amber icon chip
const iconChip =
  "w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs";

// Shared input classes
const inputCls =
  "rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-400 focus-visible:outline-none";

// Label classes
const labelCls = "text-xs font-bold text-slate-700 uppercase tracking-wider";

export function ProfileUpdateForm({
  defaultValues,
  onSubmit,
  isSaving: isSavingProp,
  avatarUrl,
  onAvatarChange,
}: ProfileUpdateFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const isSaving = isSavingProp ?? form.formState.isSubmitting;

  // Keep form values in sync when defaultValues change (loaded from API)
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues.first_name, defaultValues.last_name, defaultValues.email]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        {/* ── Personal Information ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8 py-6">
          {/* Left: Section label */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className={iconChip}>
                <User className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit tracking-normal">
                Personal Information
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-0.5">
              Your name, contact details and profile picture
            </p>
          </div>

          {/* Right: Fields */}
          <div className="space-y-6">
            {/* Avatar (updates separately on upload) */}
            <ProfilePicUpload
              value={avatarUrl}
              onChange={(newUrl) => onAvatarChange?.(newUrl)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Aarav"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sharma"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          readOnly
                          disabled
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-800 cursor-not-allowed pr-10 focus-visible:ring-0 focus-visible:border-slate-200"
                          {...field}
                          value={field.value ?? ""}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="tel"
                          className={cn(inputCls, "pr-10")}
                          {...field}
                          value={field.value ?? ""}
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className={labelCls}>Gender</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        {GENDER_OPTIONS.map(({ id, label, icon: Icon }) => {
                          const selected = field.value === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => field.onChange(id)}
                              className={cn(
                                "h-10 px-3 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer outline-none select-none",
                                selected
                                  ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "size-3.5 shrink-0",
                                  selected ? "text-white" : "text-slate-400",
                                )}
                              />
                              <span>{label}</span>
                              {selected && (
                                <Check className="size-3 ml-0.5 stroke-[2.5] shrink-0 text-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* ── Astrological Birth Details ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8 py-6">
          {/* Left */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className={iconChip}>
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit tracking-normal">
                Birth Details
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-0.5">
              Used for Kundli charts, dashas, and daily guidance
            </p>
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(labelCls, "flex items-center gap-1.5")}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#ff6b00]" />
                    Date of Birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time of Birth */}
            <FormField
              control={form.control}
              name="time_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(labelCls, "flex items-center gap-1.5")}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
                    Time of Birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Place of Birth */}
            <FormField
              control={form.control}
              name="place_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(labelCls, "flex items-center gap-1.5")}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
                    Place of Birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. New Delhi, India"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 px-8 rounded-full font-bold text-sm sm:text-base bg-[#ff6b00] hover:bg-[#e05e00] text-white shadow-xs cursor-pointer gap-2 transition-colors"
          >
            <Save className="w-4.5 h-4.5" />
            <span>{isSaving ? "Saving…" : "Save Profile"}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
