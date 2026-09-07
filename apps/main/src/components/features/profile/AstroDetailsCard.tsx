"use client";

import React from "react";
import { Button } from "@repo/ui";
import Skeleton from "@/components/ui/Skeleton";

interface AstroDetailsCardProps {
  lang: string;
  t: any;
  profileData: any;
  editing: boolean;
  saving: boolean;
  setEditing: (val: boolean) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSave: () => void;
  loading?: boolean;
}

const AstroDetailsCard: React.FC<AstroDetailsCardProps> = ({
  lang,
  t,
  profileData,
  editing,
  saving,
  setEditing,
  handleInputChange,
  handleSave,
  loading = false,
}) => {
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
            <i className="fa-regular fa-calendar"></i>
          </span>
          {t.astroDetails.title}
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
            {t.astroDetails.edit}
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
              {t.astroDetails.cancel}
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
              {t.astroDetails.save}
            </Button>
          </div>
        )}
        {loading && <Skeleton width={100} height={40} />}
      </div>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { label: t.astroDetails.dob, value: profileData.date_of_birth, icon: "fa-regular fa-calendar" },
            { label: t.astroDetails.tob, value: profileData.time_of_birth, icon: "fa-regular fa-clock" },
            { label: t.astroDetails.pob, value: profileData.place_of_birth, icon: "fa-solid fa-location-dot" },
          ].map((field, idx) => (
            <div key={idx}>
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {field.label}
              </label>
              {loading ? (
                <Skeleton width="100%" height={24} />
              ) : editing ? (
                idx === 0 ? (
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                    value={field.value ? field.value.split("T")[0] : ""}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                  />
                ) : idx === 1 ? (
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                    value={field.value || ""}
                    onChange={(e) => handleInputChange("time_of_birth", e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                    value={field.value || ""}
                    onChange={(e) => handleInputChange("place_of_birth", e.target.value)}
                    placeholder={t.astroDetails.pobPlaceholder}
                    style={{
                      fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
                    }}
                  />
                )
              ) : (
                <p className="flex items-center font-bold text-gray-900 m-0">
                  <i className={`${field.icon} mr-2.5 text-orange/70`}></i>
                  {idx === 0 ? (
                    field.value
                      ? new Date(field.value).toLocaleDateString(
                          lang === "hi" ? "hi-IN" : "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
                      : t.astroDetails.notSet
                  ) : (
                    field.value || t.astroDetails.notSet
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstroDetailsCard;
