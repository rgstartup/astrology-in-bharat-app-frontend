"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { SomeoneElseData } from "@/actions/chat";

export interface ConsultingForSelectProps {
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  className?: string;
}

/**
 * Dropdown switch allowing user to choose between consulting for self or another member.
 *
 * @param props - Component props.
 * @returns Selector element.
 */
export const ConsultingForSelect = ({
  askSomeoneElse,
  setAskSomeoneElse,
  className,
}: ConsultingForSelectProps) => {
  const tx = useTranslations("Chat.expertPreview");

  return (
    <label
      className={cn(
        "relative flex items-center shrink-0 min-w-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 focus-within:border-[#FF5500] transition-colors",
        className,
      )}
    >
      <span className="sr-only">{tx("consultingFor")}</span>
      <select
        value={askSomeoneElse ? "myself" : "someoneElse"}
        onChange={(e) => setAskSomeoneElse(e.target.value === "myself")}
        className="w-full max-w-full appearance-none truncate bg-transparent py-3 pl-4 pr-8 text-xs font-bold text-slate-900 outline-none cursor-pointer"
      >
        <option value="myself">{tx("myself")}</option>
        <option value="someoneElse">{tx("someoneElse")}</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 w-4 h-4 text-slate-500" />
    </label>
  );
};

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-input bg-background pl-3.5 pr-9 text-sm text-slate-900 outline-none transition-all focus:border-orange cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export interface MemberDetailsFormProps {
  initial: SomeoneElseData;
  onSubmit: (val: SomeoneElseData) => void;
}

/**
 * Form for collecting birth details when consulting for another family member or person.
 *
 * @param props - Component props.
 * @returns Member details form.
 */
export const MemberDetailsForm = ({ initial, onSubmit }: MemberDetailsFormProps) => {
  const tx = useTranslations("Chat.expertPreview");

  const schema = z.object({
    name: z.string().min(2, tx("nameMin")),
    gender: z.string().min(1, tx("fieldRequired")),
    dob: z.string().min(1, tx("fieldRequired")),
    tob: z.string(),
    pob: z.string(),
  });

  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial.name ?? "",
      gender: initial.gender ?? "",
      dob: initial.dob ?? "",
      tob: initial.tob ?? "",
      pob: initial.pob ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => onSubmit(v))}
        className="space-y-3"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{tx("fullName")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tx("enterName")}
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel required>{tx("gender")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <select
                      className={cn(
                        selectClass,
                        !field.value && "text-muted-foreground",
                      )}
                      {...field}
                    >
                      <option value="">{tx("select")}</option>
                      <option value="male">{tx("male")}</option>
                      <option value="female">{tx("female")}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel required>{tx("birthDate")}</FormLabel>
                <FormControl>
                  <Input type="date" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="tob"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>{tx("birthTime")}</FormLabel>
                <FormControl>
                  <Input type="time" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pob"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>{tx("birthPlace")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tx("cityCountry")}
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all cursor-pointer truncate"
        >
          {tx("continue")}
        </button>
      </form>
    </Form>
  );
};
