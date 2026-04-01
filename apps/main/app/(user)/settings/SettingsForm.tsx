"use client";

import React, { useState } from "react";
import Image from "next/image";
import { api as http } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AddressData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tag: string;
}

export interface ProfileData {
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  preferences: string;
  language_preference: string;
  addresses: AddressData[];
}

interface SettingsFormProps {
  initialData: ProfileData;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState<ProfileData>(initialData);

  function convertIsoToDisplayDate(isoDateString: string) {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "";
    // Return yyyy-mm-dd format for <input type="date">
    return isoDateString.split("T")[0] ?? "";
  }

  // ------------------------------------
  // HANDLE GENERAL INPUT CHANGE
  // ------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------------------------
  // HANDLE ADDRESS CHANGE
  // ------------------------------------
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updated = [...formData.addresses];
    if (updated[index]) {
      (updated[index] as any)[e.target.name] = e.target.value;
    }
    setFormData({ ...formData, addresses: updated });
  };

  // ------------------------------------
  // IMAGE PREVIEW
  // ------------------------------------
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ------------------------------------
  // PATCH REQUEST – UPDATE PROFILE
  // ------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    const [res, error] = await http.patch("/client/profile", formData);

    if (error) {
      setStatus("Update Failed!");
      return;
    }

    const fileInput = document.getElementById("profile-upload") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      const formDataWithFile = new FormData();
      formDataWithFile.append("file", fileInput.files[0]);
      const [, picError] = await http.patch("/client/picture", formDataWithFile);
      if (picError) {
        // We still continue if only the picture fails, or could show warning
        console.error("Profile picture update failed", picError);
      }
    }

    setStatus("Saved Successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <div className="font-outfit bg-[#f7f7f9] p-10 flex justify-center min-h-screen">
        <div className="w-full max-w-[850px]">
          {/* -------- PAGE TITLE -------- */}
          <div className="mb-6">
            <h2 className="font-bold text-[#242424] mb-1 text-2xl">Profile Settings</h2>
            <p className="text-[#777] mb-6">Manage your personal account details.</p>
          </div>

          {/* -------- PROFILE CARD -------- */}
          <div className="bg-white p-9 rounded-[22px] shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-6 mb-9 max-sm:flex-col max-sm:text-center">
              <div className="relative w-[110px] h-[110px]">
                {preview ? (
                  <Image
                    src={preview}
                    alt="User"
                    width={110}
                    height={110}
                    className="w-full h-full rounded-full object-cover border-[3px] border-[#d09b3a]"
                  />
                ) : (
                  <div className="w-[110px] h-[110px] rounded-full bg-[#f0f0f0] flex justify-center items-center text-[38px] text-[#888] border-[2px] border-[#d09b3a]">
                    <i className="fa-solid fa-user"></i>
                  </div>
                )}

                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 w-[34px] h-[34px] bg-white rounded-full flex justify-center items-center border border-[#ddd] cursor-pointer">
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  onChange={handleImage}
                />
              </div>

              <div className="profile-text">
                <h3 className="text-[22px] m-0 font-bold">{formData.full_name || "—"}</h3>
                <span className="text-[#777] text-sm">Update your personal information</span>
              </div>
            </div>

            {/* -------- FORM -------- */}
            <form onSubmit={handleSubmit} className="mt-2.5">
              {/* FULL NAME */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full" />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full" />
              </div>

              {/* PHONE */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full" />
              </div>

              {/* DOB */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Date of Birth</label>
                <input type="date" name="date_of_birth" value={convertIsoToDisplayDate(formData.date_of_birth)} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full" />
              </div>

              {/* GENDER */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Gender</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full" />
              </div>

              {/* LANGUAGE */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Language Preference</label>
                <input type="text" name="language_preference" value={formData.language_preference} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full" />
              </div>

              {/* PREFERENCES */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Astrology Preferences</label>
                <textarea name="preferences" rows={3} value={formData.preferences} onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full">
                </textarea>
              </div>

              {/* ADDRESS BLOCK */}
              <h4 style={{ marginTop: "20px" }}>Address</h4>
              {formData.addresses.map((addr, index) => (
                <div key={index} className="address-section">
                  {(["street", "city", "state", "postal_code", "country", "tag"] as const).map((field) => (
                    <div key={field} className="flex flex-col mb-[18px]">
                      <label className="text-[13px] font-semibold text-[#666] mb-1.5 capitalize">
                        {field.replace("_", " ")}
                      </label>
                      <input
                        name={field}
                        value={addr[field]}
                        onChange={(e) => handleAddressChange(e, index)}
                        className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                      />
                    </div>
                  ))}
                </div>
              ))}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="bg-[#e9e9e9] py-2.5 px-6 rounded-full border-none font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-br from-[#732882] to-[#a051b5] text-white py-2.5 px-7 rounded-full border-none font-semibold cursor-pointer">
                  {status === "Saving..." ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

              {status && <p className="mt-4 text-sm font-semibold text-[#4b4b4b]">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
