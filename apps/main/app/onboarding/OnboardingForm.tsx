"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileBaseLogic } from "@/components/features/profile/hooks/useProfileBaseLogic";
import PersonalDetailsCard from "@/components/features/profile/PersonalDetailsCard";
import AddressDetailsCard from "@/components/features/profile/AddressDetailsCard";
import AstroDetailsCard from "@/components/features/profile/AstroDetailsCard";
import PhoneVerifyModal from "@/components/features/profile/PhoneVerifyModal";
import { useLanguageStore } from "@/store/languageStore";
import { profileTranslations } from "@/lib/translations/profile";
import { useState } from "react";

const OnboardingForm: React.FC = () => {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const t =
    profileTranslations[lang as keyof typeof profileTranslations] ||
    profileTranslations.en;

  const [showPhoneVerify, setShowPhoneVerify] = useState(false);

  const {
    clientUser,
    clientLoading,
    isClientAuthenticated,
    profileData,
    loading,
    editingSections,
    setEditingSections,
    savingSections,
    handleInputChange,
    handleAddressChange,
    handleSaveSection,
    loadProfile,
  } = useProfileBaseLogic();

  // Open all sections in edit mode on mount
  useEffect(() => {
    setEditingSections({
      personal: true,
      address: true,
      astro: true,
      settings: false,
    });
  }, [setEditingSections]);

  if ((loading || clientLoading) && !profileData?.id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-black text-orange uppercase tracking-[0.2em] mb-3">
            Welcome aboard
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#301118] mb-3">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            Tell us a little about yourself so we can personalise your cosmic
            journey.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Personal", "Address", "Astro Details"].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange text-white text-[10px] font-black flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-xs font-bold text-gray-600 hidden sm:block">
                  {step}
                </span>
              </div>
              {i < 2 && (
                <div className="w-8 h-px bg-gray-200 mx-1 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Profile form sections */}
        <PersonalDetailsCard
          lang={lang}
          t={t}
          profileData={profileData}
          clientUser={clientUser}
          editing={editingSections.personal}
          saving={savingSections.personal}
          setEditing={(val) =>
            setEditingSections((prev) => ({ ...prev, personal: val }))
          }
          handleInputChange={handleInputChange}
          handleSave={() => handleSaveSection("personal")}
          setShowPhoneVerify={setShowPhoneVerify}
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
        />

        {/* Footer actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-8 py-3 rounded-2xl bg-orange text-white text-sm font-black shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Go to My Profile
          </button>
        </div>
      </div>

      <PhoneVerifyModal
        isOpen={showPhoneVerify}
        onClose={() => setShowPhoneVerify(false)}
        phone={profileData?.phone || ""}
        onSuccess={() => {
          setShowPhoneVerify(false);
          loadProfile();
        }}
      />
    </div>
  );
};

export default OnboardingForm;
