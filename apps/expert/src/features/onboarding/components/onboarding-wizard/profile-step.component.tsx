"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@repo/design/shadcn";
import { Progress } from "@repo/design/shadcn/progress";
import {
    getAvatarUploadSignature,
    uploadDirectToCloud,
    verifyAvatarUpload,
    type SignedUploadParams,
    type VerifiedUpload,
} from "@/actions/avatar.api";
import { unwrap } from "../../utils";

interface ProfileStepProps {
  fullName: string;
  gender: string;
  phone: string;
  aboutMe: string;
  onChange: (field: "full_name" | "gender" | "phone" | "about_me", value: string) => void;
  avatarUrl: string | null;
  onAvatarUploaded: (url: string | null) => void;
  disabled?: boolean;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export function ProfileStep({
  fullName,
  gender,
  phone,
  aboutMe,
  onChange,
  avatarUrl,
  onAvatarUploaded,
  disabled,
}: ProfileStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError("");
    setUploadProgress(0);
    setUploading(true);

    // Step 1: Get signed upload params from backend (includes validation constraints)
    const sigRes = await getAvatarUploadSignature("avatars");
    if (!sigRes.ok) {
      setUploadError(sigRes.error?.message || "Failed to start upload");
      setUploading(false);
      setUploadProgress(null);
      onAvatarUploaded(null);
      return;
    }
    const params = unwrap<SignedUploadParams>(sigRes.data);

    // Validate file against constraints returned with the signed params
    if (params.allowedMimeTypes && !params.allowedMimeTypes.includes(file.type)) {
      setUploadError(`Use one of: ${params.allowedMimeTypes.join(", ")}.`);
      setUploading(false);
      setUploadProgress(null);
      onAvatarUploaded(null);
      return;
    }
    if (params.maxSizeBytes && file.size > params.maxSizeBytes) {
      setUploadError(`Image must be smaller than ${(params.maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`);
      setUploading(false);
      setUploadProgress(null);
      onAvatarUploaded(null);
      return;
    }

    // Step 2: Upload file directly to storage
    const uploadRes = await uploadDirectToCloud(file, params, (percent) => {
      setUploadProgress(percent);
    });
    if (!uploadRes.ok || !uploadRes.data) {
      setUploadError(uploadRes.error?.message || "Upload failed");
      setUploading(false);
      setUploadProgress(null);
      onAvatarUploaded(null);
      return;
    }

    // Step 3: Verify asset from storage (source of truth) + persist to backend
    const verifyRes = await verifyAvatarUpload(uploadRes.data.public_id);
    if (!verifyRes.ok) {
      setUploadError(verifyRes.error?.message || "Avatar verification failed");
      setUploading(false);
      setUploadProgress(null);
      onAvatarUploaded(null);
      return;
    }
    const verified = unwrap<VerifiedUpload>(verifyRes.data);

    // Persist verified URL as the avatar
    onAvatarUploaded(verified.secureUrl);
    setUploading(false);
    setUploadProgress(null);
  };

  return (
    <div>
      <p className="text-sm text-[#626260]">
        Add a photo and a few details. Clients see this on your profile.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <div
          className={cn(
            "relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d3cec6] bg-white",
            avatarUrl && "border-amber-500 ring-1 ring-amber-500",
          )}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Profile photo"
              className="size-full object-cover"
            />
          ) : (
            <Camera className="size-6 text-[#9c9fa5]" aria-hidden />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-[#d3cec6] bg-white px-5 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#f5f1ec] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {avatarUrl ? "Change photo" : "Upload photo"}
          </button>
          <p className="mt-1 text-[13px] text-[#7b7b78]">
            JPG, PNG, WEBP or AVIF · up to 5MB
          </p>
          {uploadProgress !== null && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-[#7b7b78]">Uploading</span>
                <span className="text-[12px] font-medium text-[#111111]">
                  {uploadProgress}%
                </span>
              </div>
              <Progress
                value={uploadProgress}
                className="h-1.5 bg-[#111111]"
                indicatorClassName="bg-amber-500"
              />
            </div>
          )}
          {uploadError && (
            <p className="mt-1 text-[13px] text-[#c13515]" role="alert">
              {uploadError}
            </p>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="onboarding-full-name"
            className="mb-1.5 block text-sm font-medium text-[#626260]"
          >
            Full name
          </label>
          <Input
            id="onboarding-full-name"
            value={fullName}
            disabled={disabled}
            onChange={(e) => onChange("full_name", e.target.value)}
            placeholder="Your name"
            className="h-12 rounded-lg border-[#d3cec6] bg-white text-base focus-visible:border-amber-500 focus-visible:ring-amber-500/50"
          />
        </div>
        <div>
          <label
            htmlFor="onboarding-gender"
            className="mb-1.5 block text-sm font-medium text-[#626260]"
          >
            Gender
          </label>
          <select
            id="onboarding-gender"
            value={gender}
            disabled={disabled}
            onChange={(e) => onChange("gender", e.target.value)}
            className="h-12 rounded-lg border-[#d3cec6] bg-white text-base focus-visible:border-amber-500 focus-visible:ring-amber-500/50"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="onboarding-phone"
            className="mb-1.5 block text-sm font-medium text-[#626260]"
          >
            Phone
          </label>
          <Input
            id="onboarding-phone"
            value={phone}
            disabled={disabled}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone number"
            className="h-12 rounded-lg border-[#d3cec6] bg-white text-base focus-visible:border-amber-500 focus-visible:ring-amber-500/50"
          />
        </div>
        <div>
          <label
            htmlFor="onboarding-about"
            className="mb-1.5 block text-sm font-medium text-[#626260]"
          >
            About you
          </label>
          <textarea
            id="onboarding-about"
            value={aboutMe}
            disabled={disabled}
            onChange={(e) => onChange("about_me", e.target.value)}
            rows={4}
            placeholder="Tell clients about your experience and practice"
            className="w-full rounded-lg border border-[#d3cec6] bg-white px-3 py-2.5 text-base outline-none transition-colors placeholder:text-[#9c9fa5] focus-visible:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
