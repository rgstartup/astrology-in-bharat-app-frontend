"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import { ProfilePicUpload } from "./ProfilePicUpload";
import { AddressFields } from "./AddressFields";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { useAuth } from "@/store/useAuthStore";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Cake,
  ArrowRight,
  Crosshair,
  Mars,
  Venus,
  CircleDot,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepOnePersonalDetailsProps {
  onNext: () => void;
}

export const StepOnePersonalDetails: React.FC<StepOnePersonalDetailsProps> = ({
  onNext,
}) => {
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    setMaxDate(new Date().toISOString().split("T")[0] || "");
  }, []);

  const { user, updateUser } = useAuth();
  const { control, setValue, watch } = useFormContext<OnboardingFormData>();

  const currentAvatar = watch("avatar") || user?.avatar;

  return (
    <div className="space-y-6">
      {/* 1. Profile Picture Upload */}
      <ProfilePicUpload
        value={currentAvatar}
        onChange={(url) => {
          setValue("avatar", url, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
          });
          updateUser({
            avatar: url,
            profile_picture: url,
          });
        }}
      />

      {/* 2. Birth Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
          <Cake className="size-4 text-orange-600" />
          <h3 className="text-sm font-semibold text-foreground">
            Birth & Personal Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* First Name */}
          <div>
            <FormField
              control={control}
              name="first_name"
              rules={{
                required: "First name is required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Aarav"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />
          </div>

          {/* Last Name */}
          <div>
            <FormField
              control={control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Sharma"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <FormField
              control={control}
              name="date_of_birth"
              rules={{
                required: "Date of birth is required for astrological charts",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" max={maxDate} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />
          </div>

          {/* Time of Birth */}
          <div>
            <FormField
              control={control}
              name="time_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Time of Birth{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />
          </div>

          {/* Gender */}
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="gender"
              rules={{ required: "Please select your gender" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Gender</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: "male", label: "Male", icon: Mars },
                        { id: "female", label: "Female", icon: Venus },
                        { id: "other", label: "Other", icon: CircleDot },
                      ].map((genderOption) => {
                        const isSelected = field.value === genderOption.id;
                        const Icon = genderOption.icon;

                        return (
                          <button
                            key={genderOption.id}
                            type="button"
                            onClick={() => field.onChange(genderOption.id)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer outline-none select-none",
                              isSelected
                                ? "bg-emerald-50 text-emerald-800 border-emerald-600 ring-1 ring-emerald-600/20 shadow-2xs scale-[1.02]"
                                : "bg-white text-foreground border-border hover:border-emerald-400/50 hover:bg-emerald-50/30 shadow-2xs hover:shadow-xs",
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                isSelected ? "text-emerald-700" : "text-stone-500",
                              )}
                            />
                            <span>{genderOption.label}</span>
                            {isSelected && (
                              <Check className="size-3.5 ml-0.5 stroke-[2.5] shrink-0 text-emerald-700" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />
          </div>

          {/* Place of Birth */}
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="place_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Place of Birth{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Crosshair className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="City, State, Country (e.g. Varanasi, Uttar Pradesh)"
                        className="pl-9"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* 3. Address Section */}
      <AddressFields />

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <Link
          href={PATHS.DASHBOARD.ROOT}
          className="text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 underline-offset-4 transition-colors"
        >
          Skip
        </Link>

        <Button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-6 sm:px-7 h-11 rounded-full bg-orange hover:bg-orange/90 text-white text-sm font-semibold shadow-md shadow-orange/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Preferences</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
