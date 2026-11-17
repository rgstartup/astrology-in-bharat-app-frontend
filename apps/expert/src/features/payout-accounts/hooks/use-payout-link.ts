"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  initiatePayoutOnboarding,
  completePayoutOnboarding,
  type InitiatePayoutOnboardingInput,
  type CompletePayoutOnboardingInput,
  type InitiatePayoutOnboardingOutput,
} from "@/features/payout-accounts/api";
import { getErrorMessage } from "@repo/lib";

export function usePayoutLink() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formSpec, setFormSpec] =
    useState<InitiatePayoutOnboardingOutput | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Record<string, string>>({
    defaultValues: {},
    mode: "onBlur",
  });

  useEffect(() => {
    if (formSpec) {
      const defaults: Record<string, string> = {};
      formSpec.fields?.forEach((field) => {
        defaults[field] = "";
      });
      form.reset(defaults);
    }
  }, [formSpec, form]);

  const handleLinkAccount = useCallback(async () => {
    const redirectUri =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/payout-accounts`
        : "";
    const input: InitiatePayoutOnboardingInput = {
      providerCode: "razorpayx",
      redirectUri,
    };

    const result = await initiatePayoutOnboarding(input);
    if (result.ok && result.data) {
      if (result.data.type === "redirect" && result.data.url) {
        window.location.href = result.data.url;
      } else if (result.data.type === "form") {
        setFormSpec(result.data);
        setDialogOpen(true);
      } else {
        throw new Error("Unexpected response from provider.");
      }
    } else {
      throw new Error(
        getErrorMessage(result.error) ||
          "Failed to start payout onboarding. Please try again.",
      );
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (data: Record<string, string>) => {
      if (!formSpec) return;
      setSubmitting(true);
      const input: CompletePayoutOnboardingInput = {
        onboardingId: formSpec.onboardingId,
        accountHolderName: data.account_holder_name || undefined,
        accountNumber: data.account_number || undefined,
        ifsc: data.ifsc || undefined,
      };
      const result = await completePayoutOnboarding(input);
      setSubmitting(false);
      if (result.ok && result.data) {
        setDialogOpen(false);
        setFormSpec(null);
        form.reset();
        return {
          ok: true as const,
          text: `Payout account linked (${result.data.providerReference}).`,
        };
      }
      return {
        ok: false as const,
        text:
          getErrorMessage(result.error) ||
          "Failed to complete payout onboarding. Please try again.",
      };
    },
    [formSpec, form],
  );

  return {
    dialogOpen,
    setDialogOpen,
    formSpec,
    submitting,
    form,
    handleLinkAccount,
    handleFormSubmit,
  };
}
