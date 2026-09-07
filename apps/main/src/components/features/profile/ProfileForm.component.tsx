"use client";

import React, { useState } from "react";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import PhoneVerifyModal from "./PhoneVerifyModal";
import PersonalDetailsCard from "./PersonalDetailsCard";
import AddressDetailsCard from "./AddressDetailsCard";
import AstroDetailsCard from "./AstroDetailsCard";

interface ProfileFormProps {
  profileData: any;
  user: any;
  editingSections: {
    personal: boolean;
    address: boolean;
    astro: boolean;
    settings: boolean;
  };
  setEditingSections: React.Dispatch<
    React.SetStateAction<{
      personal: boolean;
      address: boolean;
      astro: boolean;
      settings: boolean;
    }>
  >;
  savingSections: {
    personal: boolean;
    address: boolean;
    astro: boolean;
    settings: boolean;
  };
  handleInputChange: (key: any, value: any) => void;
  handleAddressChange: (index: number, key: any, value: string) => void;
  handleSaveSection: (
    section: "personal" | "address" | "astro" | "settings",
  ) => void;
  refreshProfile?: () => Promise<void>;
  loading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  user,
  editingSections,
  setEditingSections,
  savingSections,
  handleInputChange,
  handleAddressChange,
  handleSaveSection,
  refreshProfile,
  loading = false,
}) => {
  const { lang } = useLanguageStore();
  const t =
    profileTranslations[lang as keyof typeof profileTranslations] ||
    profileTranslations.en;

  const [showPhoneVerify, setShowPhoneVerify] = useState(false);

  return (
    <>
      <PersonalDetailsCard
        lang={lang}
        t={t}
        profileData={profileData}
        user={user}
        editing={editingSections.personal}
        saving={savingSections.personal}
        setEditing={(val) =>
          setEditingSections((prev) => ({ ...prev, personal: val }))
        }
        handleInputChange={handleInputChange}
        handleSave={() => handleSaveSection("personal")}
        setShowPhoneVerify={setShowPhoneVerify}
        loading={loading}
      />

      <AddressDetailsCard
        lang={lang}
        t={t}
        profileData={profileData}
        editing={editingSections.address}
        saving={savingSections.address}
        setEditing={(val) =>
          setEditingSections((prev) => ({ ...prev, address: val }))
        }
        handleAddressChange={handleAddressChange}
        handleSave={() => handleSaveSection("address")}
        loading={loading}
      />

      <AstroDetailsCard
        lang={lang}
        t={t}
        profileData={profileData}
        editing={editingSections.astro}
        saving={savingSections.astro}
        setEditing={(val) =>
          setEditingSections((prev) => ({ ...prev, astro: val }))
        }
        handleInputChange={handleInputChange}
        handleSave={() => handleSaveSection("astro")}
        loading={loading}
      />

      <PhoneVerifyModal
        isOpen={showPhoneVerify}
        onClose={() => setShowPhoneVerify(false)}
        phone={profileData.phone || ""}
        onSuccess={() => {
          setShowPhoneVerify(false);
          if (refreshProfile) refreshProfile();
        }}
      />
    </>
  );
};

export default ProfileForm;
