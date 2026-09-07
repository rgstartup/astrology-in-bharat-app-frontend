"use client";

import React from "react";
import { Button, Loading } from "@repo/ui";
import Skeleton from "@/components/ui/Skeleton";

interface AddressDetailsCardProps {
  lang: string;
  t: any;
  profileData: any;
  editing: boolean;
  saving: boolean;
  setEditing: (val: boolean) => void;
  handleAddressChange: (index: number, key: string, value: string) => void;
  handleSave: () => void;
  loading?: boolean;
}

const AddressDetailsCard: React.FC<AddressDetailsCardProps> = ({
  lang,
  t,
  profileData,
  editing,
  saving,
  setEditing,
  handleAddressChange,
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
            <i className="fa-solid fa-location-dot"></i>
          </span>
          {t.addressDetails.title}
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
            {t.addressDetails.edit}
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
              {t.addressDetails.cancel}
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
              {t.addressDetails.save}
            </Button>
          </div>
        )}
        {loading && <Skeleton width={100} height={40} />}
      </div>
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton width="100%" height={20} />
            <Skeleton width="80%" height={20} />
            <Skeleton width="60%" height={20} />
          </div>
        ) : editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.line1}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={profileData.addresses?.[0]?.line1 || ""}
                onChange={(e) => handleAddressChange(0, "line1", e.target.value)}
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              />
            </div>
            <div className="lg:col-span-12">
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.line2}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={profileData.addresses?.[0]?.line2 || ""}
                onChange={(e) => handleAddressChange(0, "line2", e.target.value)}
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              />
            </div>
            <div className="lg:col-span-6">
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.city}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={profileData.addresses?.[0]?.city || ""}
                onChange={(e) => handleAddressChange(0, "city", e.target.value)}
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              />
            </div>
            <div className="lg:col-span-6">
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.state}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={profileData.addresses?.[0]?.state || ""}
                onChange={(e) => handleAddressChange(0, "state", e.target.value)}
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              />
            </div>
            <div className="lg:col-span-6">
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.country}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={profileData.addresses?.[0]?.country || ""}
                onChange={(e) =>
                  handleAddressChange(0, "country", e.target.value)
                }
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              />
            </div>
            <div className="lg:col-span-6">
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.zipCode}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={profileData.addresses?.[0]?.zip_code || ""}
                onChange={(e) =>
                  handleAddressChange(0, "zip_code", e.target.value)
                }
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            {profileData.addresses && profileData.addresses.length > 0 ? (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 mt-1 flex-shrink-0">
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    {profileData.addresses[0]?.line1}
                  </p>
                  {profileData.addresses[0]?.line2 && (
                    <p className="text-gray-500 text-sm mb-1 font-medium">
                      {profileData.addresses[0]?.line2}
                    </p>
                  )}
                  <p
                    className="text-gray-600 font-medium text-sm m-0 leading-relaxed"
                    style={{
                      fontFamily:
                        lang === "hi"
                           ? "'Noto Sans Devanagari', sans-serif"
                          : "inherit",
                    }}
                  >
                    {profileData.addresses[0]?.city},{" "}
                    {profileData.addresses[0]?.state},{" "}
                    {profileData.addresses[0]?.country} -{" "}
                    {profileData.addresses[0]?.zip_code}
                  </p>
                </div>
              </div>
            ) : (
              <p
                className="text-gray-500 italic m-0 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center"
                style={{
                  fontFamily:
                    lang === "hi"
                      ? "'Noto Sans Devanagari', sans-serif"
                      : "inherit",
                }}
              >
                {t.addressDetails.noAddress}
              </p>
            )}
          </div>
        )}
      </div>
      {saving && <Loading fullScreen />}
    </div>
  );
};

export default AddressDetailsCard;
