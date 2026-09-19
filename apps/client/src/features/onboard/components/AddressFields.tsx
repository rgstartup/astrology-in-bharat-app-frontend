"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, ChevronDown } from "lucide-react";

export const AddressFields: React.FC = () => {
  const { control } = useFormContext<OnboardingFormData>();

  return (
    <details className="group pt-2 border-t border-gray-100">
      <summary className="flex items-center justify-between py-2.5 cursor-pointer select-none text-sm font-bold text-foreground hover:text-orange transition-colors list-none">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-orange" />
          <span>Address Details</span>
          <span className="text-xs font-normal text-muted-foreground">
            (Optional for physical reports & delivery)
          </span>
        </div>
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 items-start">
        {/* Street Address */}
        <div className="md:col-span-2">
          <FormField
            control={control}
            name="address.line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address / House No.</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 124, Lotus Apartments, MG Road"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
              </FormItem>
            )}
          />
        </div>

        {/* City */}
        <div>
          <FormField
            control={control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City / Town</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New Delhi" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
              </FormItem>
            )}
          />
        </div>

        {/* State */}
        <div>
          <FormField
            control={control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Delhi" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
              </FormItem>
            )}
          />
        </div>

        {/* PIN Code */}
        <div>
          <FormField
            control={control}
            name="address.pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN / Postal Code</FormLabel>
                <FormControl>
                  <Input
                    maxLength={6}
                    placeholder="e.g. 110001"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </details>
  );
};
