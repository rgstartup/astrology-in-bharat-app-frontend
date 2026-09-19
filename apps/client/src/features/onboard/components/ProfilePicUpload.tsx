"use client";

import React, { useRef, useState } from "react";
import { uploadOnboardingPictureAction } from "@/actions/onboard";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload, User, Loader2 } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-orange/5 border border-orange/15">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="size-24 border-4 border-white shadow-md bg-orange/10">
          {displayImage ? (
            <AvatarImage src={displayImage} alt="Profile Avatar" />
          ) : null}
          <AvatarFallback className="bg-orange/10 text-orange">
            <User className="size-10" />
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-xs">
            <Loader2 className="size-6 text-white animate-spin" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
            <Camera className="size-4 mr-1" /> Change
          </div>
        )}

        <button
          type="button"
          aria-label="Upload profile picture"
          className="absolute -bottom-1 -right-1 size-8 rounded-full bg-orange text-white shadow-md flex items-center justify-center hover:bg-[#d64e1c] transition-colors cursor-pointer"
        >
          <Camera className="size-4" />
        </button>
      </div>

      <div className="text-center sm:text-left flex-1">
        <h3 className="text-sm font-bold text-foreground mb-0.5">Profile Photo</h3>
        <p className="text-xs text-muted-foreground mb-2.5">
          Upload a clear picture of yourself (JPG, PNG or WEBP, max 5MB).
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="h-8 text-xs font-bold border-orange/30 text-orange hover:bg-orange/10 hover:text-orange cursor-pointer"
        >
          <Upload className="size-3.5 mr-1.5" />
          {displayImage ? "Change Photo" : "Upload Photo"}
        </Button>

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
