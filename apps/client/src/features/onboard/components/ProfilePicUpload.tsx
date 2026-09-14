"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { uploadOnboardingPictureAction } from "@/actions/onboard";
import { toast } from "@/hooks/use-toast";

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

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload to Cloudinary via server action
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
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-orange/5 border border-orange/15">
      {/* Avatar Circle */}
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-orange/10 relative flex items-center justify-center">
          {displayImage ? (
            <Image
              src={displayImage}
              alt="Profile Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-orange">
              <i className="fa-solid fa-user text-3xl" />
            </div>
          )}

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-xs">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            </div>
          )}

          {/* Hover Overlay */}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              <i className="fa-solid fa-camera mr-1" /> Change
            </div>
          )}
        </div>

        {/* Camera Badge */}
        <button
          type="button"
          aria-label="Upload profile picture"
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange text-white shadow-md flex items-center justify-center hover:bg-[#d64e1c] transition-colors"
        >
          <i className="fa-solid fa-camera text-xs" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center sm:text-left flex-1">
        <h5 className="text-sm font-bold text-[#301118] mb-1">Profile Photo</h5>
        <p className="text-xs text-gray-500 mb-2">
          Upload a clear picture of yourself (JPG, PNG or WEBP, max 5MB).
        </p>
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center text-xs font-bold text-orange hover:text-[#d64e1c] hover:underline"
        >
          <i className="fa-solid fa-cloud-arrow-up mr-1.5" />
          {displayImage ? "Change Photo" : "Upload Photo"}
        </button>

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
