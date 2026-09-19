"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import { ProfilePicUpload } from "./ProfilePicUpload";
import { AddressFields } from "./AddressFields";
import { Link } from "@/i18n/navigation";
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
          <Cake className="size-4 text-orange" />
          <h3 className="text-sm font-bold text-foreground">
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
                    <Input placeholder="e.g. Aarav" {...field} />
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
                    <Input placeholder="e.g. Sharma" {...field} />
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
                    <div className="grid grid-cols-3 gap-3">
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
                            onClick={() =>
                              field.onChange(genderOption.id)
                            }
                            className={cn(
                              "py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none",
                              isSelected
                                ? "bg-orange text-white border-orange shadow-xs"
                                : "bg-white text-foreground border-border hover:border-orange/40 hover:bg-orange/5"
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{genderOption.label}</span>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/client/profile"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now →
        </Link>

        <Button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-2.5 h-11 rounded-xl bg-orange hover:bg-orange/90 text-white text-sm font-bold shadow-md shadow-orange/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Preferences</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
