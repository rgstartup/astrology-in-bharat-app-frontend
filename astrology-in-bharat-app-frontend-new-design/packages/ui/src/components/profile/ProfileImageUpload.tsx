"use client";

import React from "react";
import Image from "next/image";

interface ProfileImageUploadProps {
  imagePreview: string;
  onImageChange: (file: File) => void;
  userName?: string;
  userEmail?: string;
  disabled?: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  imagePreview,
  onImageChange,
  userName,
  userEmail,
  disabled = false
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="text-center">
      <div className="position-relative d-inline-block">
        <img
          src={imagePreview}
          alt="Profile"
          width={150}
          height={150}
          className="rounded-circle border border-3"
          style={{ 
            borderColor: "var(--primary-color)",
            objectFit: "cover"
          }}
        />
        {!disabled && (
          <label 
            htmlFor="profileImage" 
            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer"
            style={{ 
              backgroundColor: "var(--primary-color)",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
          >
            <i className="fa-solid fa-camera fa-sm"></i>
          </label>
        )}
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleImageChange}
          className="d-none"
          disabled={disabled}
        />
      </div>
      <div className="mt-3">
        <h5 className="mb-1">{userName || "User"}</h5>
        <p className="text-muted mb-0 small">{userEmail}</p>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
