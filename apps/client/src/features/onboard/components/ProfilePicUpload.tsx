"use client";

import React, { useRef, useState } from "react";
import { uploadOnboardingPictureAction } from "@/actions/onboard";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload, User, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePicUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export const ProfilePicUpload: React.FC<ProfilePicUploadProps> = ({
  value,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");

  React.useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const displayImage = preview || value;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadOnboardingPictureAction(formData);

      if (result.error) {
        toast.error(result.error);
      } else if (result.avatar) {
        setPreview(result.avatar);
        onChange(result.avatar);
      }
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white transition-all duration-200 shadow-2xs"
    >
      <div
        className="relative group cursor-pointer shrink-0"
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="size-16 sm:size-18 border-2 border-white shadow-sm ring-1 ring-slate-200 bg-slate-100">
          {displayImage ? (
            <AvatarImage
              src={displayImage}
              alt="Profile Avatar"
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-slate-100 text-slate-500">
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-xs">
            <Loader2 className="size-5 text-white animate-spin" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold">
            <Camera className="size-3.5 mr-1" /> Change
          </div>
        )}
      </div>

      <div className="text-center sm:text-left flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="text-sm font-bold text-slate-800">Profile Photo</span>
          {displayImage && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">
              <Check className="size-3 stroke-[2.5]" />
              Uploaded
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Upload a clear photo of yourself (JPG, PNG or WEBP, max 5MB).
        </p>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-2xs flex items-center gap-1.5",
              displayImage
                ? "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                : "bg-[#ff6b00] text-white hover:bg-[#e05e00] border-transparent"
            )}
          >
            <Upload className="size-3.5" />
            <span>{displayImage ? "Change Photo" : "Upload Photo"}</span>
          </Button>
          {displayImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview("");
                onChange("");
              }}
              className="text-xs text-slate-500 hover:text-red-600 transition-colors px-2.5 py-1 font-medium cursor-pointer rounded-full"
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
