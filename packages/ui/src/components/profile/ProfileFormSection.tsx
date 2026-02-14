"use client";

import React from "react";

interface ProfileFormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  title,
  icon,
  children,
  className = ""
}) => {
  return (
    <div className={`col-12 mb-4 ${className}`}>
      <h5 className="mb-3" style={{ color: "var(--primary-color)" }}>
        <i className={`${icon} me-2`}></i>
        {title}
      </h5>
      <div className="row g-3">
        {children}
      </div>
    </div>
  );
};

export default ProfileFormSection;
