"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import api from "@/api/api";
import { API_ROUTES } from "@/utils/api.routes";
import {
  completeOnboarding,
  getAvailableSpecializations,
  getProfessions,
} from "../../api";
import { useOnboarding } from "../../hooks";
import { unwrap } from "../../utils";
import { ProfessionsStep } from "./professions-step.component";
import { SpecializationsStep } from "./specializations-step.component";
import { ProfileStep } from "./profile-step.component";
import { WizardFrame } from "./wizard-frame.component";
import type { ProfessionItem, SpecializationItem } from "@repo/lib/contracts/expert/account-api";

const PRIMARY_BTN =
  "inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-7 text-base font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-[#ebe7e1] disabled:text-[#9c9fa5]";
const SECONDARY_BTN =
  "inline-flex h-12 items-center justify-center rounded-full border border-[#d3cec6] bg-white px-7 text-base font-medium text-[#111111] transition-colors hover:bg-[#f5f1ec] disabled:cursor-not-allowed disabled:opacity-50";
const SKIP_BTN =
  "text-base font-medium text-[#626260] underline-offset-4 hover:text-[#111111] hover:underline disabled:cursor-not-allowed disabled:opacity-50";

export function OnboardingWizard() {
  const router = useRouter();
  const { status, account, loading: onboardingLoading } = useOnboarding();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);

  const [professions, setProfessions] = useState<ProfessionItem[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<number[]>([]);

  const [specializations, setSpecializations] = useState<
    SpecializationItem[]
  >([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    number[]
  >([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch professions (step 0 data)
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const result = await getProfessions();
      if (cancelled) return;
      if (result) {
        setProfessions(result);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Redirect if already completed; prefill from account (/expert/account)
  useEffect(() => {
    if (onboardingLoading || !status) return;

    if (status.onboarding_completed) {
      router.replace("/dashboard");
      return;
    }

    if (account) {
      setFullName(typeof account.name === "string" ? account.name : "");
      if (typeof account.about === "string") setAboutMe(account.about);
      const photoUrl = account.avatar_media?.url || account.avatar || null;
      if (photoUrl) setAvatarUrl(photoUrl);
    }
  }, [onboardingLoading, status, account, router]);

  const finish = async (skip: boolean) => {
    if (skip) {
      setSkipping(true);
    } else {
      setSubmitting(true);
    }

    if (!skip) {
      const personalResult = await api.patch(API_ROUTES.ACCOUNT.PERSONAL_INFO, {
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        about_me: aboutMe.trim() || undefined,
      });
      if (!personalResult.ok) {
        toast.error(
          personalResult.error?.message || "Failed to update profile",
        );
        setSubmitting(false);
        return;
      }
    }

    const completeResult = await completeOnboarding();
    if (!completeResult.ok) {
      toast.error(
        (completeResult.error as { message?: string } | undefined)?.message ||
          "Failed to complete onboarding",
      );
      setSubmitting(false);
      setSkipping(false);
      return;
    }
    window.location.href = "/dashboard";
  };

  const goProfessions = async () => {
    if (selectedProfessions.length === 0) {
      toast.error("Pick at least one profession, or skip this step.");
      return;
    }
    setSubmitting(true);
    const syncResult = await api.put(API_ROUTES.PROFESSIONS.SYNC_ME, {
      profession_ids: selectedProfessions,
    });
    if (!syncResult.ok) {
      toast.error(syncResult.error?.message || "Failed to save professions");
      setSubmitting(false);
      return;
    }
    const specResult = await getAvailableSpecializations();
    if (specResult) {
      setSpecializations(specResult);
    }
    setSubmitting(false);
    setStep(1);
  };

  const goSpecializations = async () => {
    setSubmitting(true);
    if (selectedSpecializations.length > 0) {
      const syncResult = await api.put(API_ROUTES.SPECIALIZATIONS.SYNC_ME, {
        specialization_ids: selectedSpecializations,
      });
      if (!syncResult.ok) {
        toast.error(
          syncResult.error?.message || "Failed to save specializations",
        );
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(false);
    setStep(2);
  };

  if (onboardingLoading) {
    return (
      <div className="mx-auto mt-16 w-full max-w-2xl animate-pulse rounded-xl border border-[#d3cec6] bg-white p-8">
        <div className="h-4 w-24 rounded bg-[#ebe7e1]" />
        <div className="mt-6 h-8 w-2/3 rounded bg-[#ebe7e1]" />
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-[#ebe7e1]" />
          <div className="h-20 rounded-xl bg-[#ebe7e1]" />
          <div className="h-20 rounded-xl bg-[#ebe7e1]" />
          <div className="h-20 rounded-xl bg-[#ebe7e1]" />
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="mx-auto mt-16 w-full max-w-2xl rounded-xl border border-[#d3cec6] bg-white p-8 text-center">
        <p className="text-base text-[#111111]">
          We couldn&apos;t load your onboarding status.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-medium text-[#111111] underline-offset-4 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const busy = submitting || skipping;

  if (step === 0) {
    return (
      <WizardFrame
        title="What do you do?"
        subtitle="This helps clients find the right expert."
        step={0}
        status={status}
        busy={busy}
        onSkip={() => void finish(true)}
        onBack={undefined}
      >
        <ProfessionsStep
          professions={professions}
          selected={selectedProfessions}
          onToggle={(id) =>
            setSelectedProfessions((prev) =>
              prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
            )
          }
          disabled={busy}
        />
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void finish(true)}
            className={SKIP_BTN}
          >
            {skipping ? "Skipping…" : "Skip for now"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void goProfessions()}
            className={PRIMARY_BTN}
          >
            {submitting ? "Saving…" : "Continue"}
          </button>
        </div>
      </WizardFrame>
    );
  }

  if (step === 1) {
    return (
      <WizardFrame
        title="What are your specializations?"
        subtitle="Pick what you're best at."
        step={1}
        status={status}
        busy={busy}
        onSkip={() => void finish(true)}
        onBack={() => setStep(0)}
      >
        <SpecializationsStep
          specializations={specializations}
          selected={selectedSpecializations}
          onToggle={(id) =>
            setSelectedSpecializations((prev) =>
              prev.includes(id)
                ? prev.filter((sid) => sid !== id)
                : [...prev, id],
            )
          }
          disabled={busy}
        />
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => setStep(0)}
              className={SECONDARY_BTN}
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void finish(true)}
              className={SKIP_BTN}
            >
              {skipping ? "Skipping…" : "Skip for now"}
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void goSpecializations()}
            className={PRIMARY_BTN}
          >
            {submitting ? "Saving…" : "Continue"}
          </button>
        </div>
      </WizardFrame>
    );
  }

  return (
    <WizardFrame
      title="Complete your profile"
      subtitle="A photo and a short intro build trust with clients."
      step={2}
      status={status}
      busy={busy}
      onSkip={() => void finish(true)}
      onBack={() => setStep(1)}
    >
      <ProfileStep
        fullName={fullName}
        phone={phone}
        aboutMe={aboutMe}
        onChange={(field, value) => {
          if (field === "full_name") setFullName(value);
          else if (field === "phone") setPhone(value);
          else setAboutMe(value);
        }}
        avatarUrl={avatarUrl}
        onAvatarUploaded={setAvatarUrl}
        disabled={busy}
      />
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => setStep(1)}
            className={SECONDARY_BTN}
          >
            Back
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void finish(true)}
            className={SKIP_BTN}
          >
            {skipping ? "Skipping…" : "Skip for now"}
          </button>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void finish(false)}
          className={PRIMARY_BTN}
        >
          {submitting ? "Finishing…" : "Finish"}
        </button>
      </div>
    </WizardFrame>
  );
}

export { WizardFrame };
export type { WizardFrameProps } from "./wizard-frame.component";
