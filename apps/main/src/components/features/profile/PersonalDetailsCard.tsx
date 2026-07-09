"use client";

import React, { useState } from "react";
import { Button, Loading } from "@repo/ui";
import Skeleton from "@/components/ui/Skeleton";

interface PersonalDetailsCardProps {
  lang: string;
  t: any;
  profileData: any;
  user: any;
  editing: boolean;
  saving: boolean;
  setEditing: (val: boolean) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSave: () => void;
  setShowPhoneVerify: (val: boolean) => void;
  loading?: boolean;
}

const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({
  lang,
  t,
  profileData,
  user,
  editing,
  saving,
  setEditing,
  handleInputChange,
  handleSave,
  setShowPhoneVerify,
  loading = false,
}) => {
  const [copied, setCopied] = useState(false);

  const rawId = user?.uid || user?.id;
  const displayUid = rawId && rawId.length > 20 
    ? `AIB-USR-${rawId.split('-')[0].toUpperCase()}` 
    : rawId;

  const handleCopy = () => {
    if (displayUid) {
      navigator.clipboard.writeText(String(displayUid));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden">
      <div className="px-4 py-3 sm:px-6 sm:py-5 bg-white border-b border-gray-100 flex flex-row justify-between items-center gap-2 sm:gap-4">
        <h5
          className="text-sm sm:text-lg font-bold text-gray-900 mb-0 flex items-center leading-tight sm:leading-normal"
          style={{
            fontFamily:
              lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
          }}
        >
          <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 text-sm sm:text-base">
            <i className="fa-regular fa-id-card"></i>
          </span>
          {t.personalDetails.title}
        </h5>
        {!loading && !editing && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditing(true)}
            className="shadow-gold cursor-pointer hover:cursor-pointer !px-3 sm:!px-5 !py-1.5 sm:!py-2 !text-xs sm:!text-sm whitespace-nowrap"
            style={{
              fontFamily:
                lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
            }}
          >
            <i className="fa-solid fa-pen-to-square mr-2"></i>
            {t.personalDetails.edit}
          </Button>
        )}
        {editing && (
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditing(false)}
              className="cursor-pointer hover:cursor-pointer !px-3 sm:!px-6 !py-1.5 sm:!py-2 !text-xs sm:!text-sm whitespace-nowrap"
              style={{
                fontFamily:
                  lang === "hi"
                    ? "'Noto Sans Devanagari', sans-serif"
                    : "inherit",
              }}
            >
              {t.personalDetails.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSave}
              className="shadow-md cursor-pointer hover:cursor-pointer !px-3 sm:!px-6 !py-1.5 sm:!py-2 !text-xs sm:!text-sm whitespace-nowrap"
              style={{
                fontFamily:
                  lang === "hi"
                    ? "'Noto Sans Devanagari', sans-serif"
                    : "inherit",
              }}
            >
              {t.personalDetails.save}
            </Button>
          </div>
        )}
        {loading && <Skeleton width={100} height={40} />}
      </div>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <label
              className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
              style={{
                fontFamily:
                  lang === "hi"
                    ? "'Noto Sans Devanagari', sans-serif"
                    : "inherit",
              }}
            >
              {t.personalDetails.userId}
            </label>
            <div className="flex items-center gap-3">
              {loading ? (
                <Skeleton width={120} height={24} className="rounded-full" />
              ) : (
                <>
                  <span
                    className="font-bold px-4 py-1.5 rounded-full text-xs"
                    style={{
                      backgroundColor: "rgba(255,107,0,0.1)",
                      color: "#FF6B00",
                      letterSpacing: "0.05em",
                      fontFamily: "monospace",
                    }}
                  >
                    {displayUid || t.personalDetails.notAssigned}
                  </span>
                  {displayUid && (
                    <button
                      type="button"
                      title={
                        copied ? t.personalDetails.copied : t.personalDetails.copyId
                      }
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                        copied
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      } border`}
                      onClick={handleCopy}
                    >
                      <i
                        className={`fa-${copied ? "solid fa-check" : "regular fa-copy"}`}
                      ></i>
                      {copied && (
                        <span
                          style={{
                            fontFamily:
                              lang === "hi"
                                ? "'Noto Sans Devanagari', sans-serif"
                                : "inherit",
                          }}
                        >
                          {t.personalDetails.copied}
                        </span>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {[
            { label: t.personalDetails.fullName, value: profileData.full_name || user?.name, key: "full_name" },
            { label: t.personalDetails.email, value: user?.email, key: "email", noEdit: true },
            { label: t.personalDetails.phone, value: profileData.phone, key: "phone", isPhone: true },
            { label: t.personalDetails.gender, value: profileData.gender, key: "gender", isSelect: true },
            { label: t.personalDetails.maritalStatus, value: profileData.marital_status, key: "marital_status", isSelect: true },
            { label: t.personalDetails.occupation, value: profileData.occupation, key: "occupation" },
          ].map((field, idx) => (
            <div key={idx}>
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
              >
                {field.label}
              </label>
              {loading ? (
                <Skeleton width="100%" height={24} />
              ) : editing && !field.noEdit ? (
                field.isSelect ? (
                  <select
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                    value={field.value || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                  >
                    {field.key === "gender" ? (
                      <>
                        <option value="male">{t.personalDetails.genders.male}</option>
                        <option value="female">{t.personalDetails.genders.female}</option>
                        <option value="other">{t.personalDetails.genders.other}</option>
                      </>
                    ) : (
                      <>
                        <option value="">{t.personalDetails.maritalStatuses.select}</option>
                        <option value="single">{t.personalDetails.maritalStatuses.single}</option>
                        <option value="married">{t.personalDetails.maritalStatuses.married}</option>
                        <option value="divorced">{t.personalDetails.maritalStatuses.divorced}</option>
                        <option value="widowed">{t.personalDetails.maritalStatuses.widowed}</option>
                        <option value="other">{t.personalDetails.maritalStatuses.other}</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                    value={field.value || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                  />
                )
              ) : (
                <div className="flex items-center gap-3">
                  <p
                    className="font-bold text-gray-900 m-0 capitalize"
                    style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                  >
                    {field.isSelect 
                      ? (field.value ? (field.key === "gender" ? t.personalDetails.genders[field.value] : t.personalDetails.maritalStatuses[field.value]) : t.personalDetails.notSet)
                      : (field.value || t.personalDetails.notSet)}
                  </p>
                  {field.isPhone && field.value && !profileData.phone_verified_at && (
                    <button
                      type="button"
                      onClick={() => setShowPhoneVerify(true)}
                      className="px-3 py-1 bg-orange text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-orange/90 transition-all border-0"
                      style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    >
                      {t.personalDetails.verifyNow}
                    </button>
                  )}
                  {field.isPhone && field.value && profileData.phone_verified_at && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-green-600 text-[9px] font-bold"
                      style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    >
                      <i className="fa-solid fa-circle-check"></i> {t.personalDetails.verified}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label
              className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
              style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
            >
              {t.personalDetails.aboutMe}
            </label>
            {loading ? (
              <Skeleton width="100%" height={80} />
            ) : editing ? (
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all resize-none"
                rows={3}
                value={profileData.about_me || ""}
                onChange={(e) => handleInputChange("about_me", e.target.value)}
                placeholder={t.personalDetails.aboutMePlaceholder}
                style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
              />
            ) : (
              <p
                className="font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 m-0 leading-relaxed italic"
                style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
              >
                {profileData.about_me || t.personalDetails.aboutMeFallback}
              </p>
            )}
          </div>
        </div>
      </div>
      {saving && <Loading fullScreen />}
    </div>
  );
};

export default PersonalDetailsCard;
