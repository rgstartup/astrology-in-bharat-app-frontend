"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ClientSettingsPage() {
  const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/client/profile`;

  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    preferences: "",
    language_preference: "",
    addresses: [
      {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        tag: "",
      },
    ],
  });

  function convertIsoToDisplayDate(isoDateString: string) {
    // 1. Create a Date object from the ISO string
    const date = new Date(isoDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // 2. Define formatting options
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric", // Day of the month (e.g., 15)
      month: "long", // Full month name (e.g., August)
      year: "numeric", // Full year (e.g., 1995)
      timeZone: "UTC", // Ensures the date is interpreted as UTC to avoid local timezone shifting the date
    };

    // 3. Format the date using Intl.DateTimeFormat
    // 'en-US' locale is used for standard English names (e.g., "December")
    const formatter = new Intl.DateTimeFormat("en-US", options);

    return formatter.format(date);
  }
  // ------------------------------------
  // GET PROFILE DATA ON PAGE LOAD
  // ------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(API, {
          withCredentials: true, // ALWAYS IMPORTANT FOR COOKIES
        });

        const data = res.data;
        console.log(data);

        setFormData({
          full_name: data.user.name || "",
          email: data.user.email || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          phone: data.phone || "",
          preferences: data.preferences || "",
          language_preference: data.language_preference || "",
          addresses: data.addresses?.length
            ? data.addresses
            : [
              {
                street: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
                tag: "",
              },
            ],
        });
      } catch (err) {
        console.log("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // ------------------------------------
  // HANDLE GENERAL INPUT CHANGE
  // ------------------------------------
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------------------------
  // HANDLE ADDRESS CHANGE
  // ------------------------------------
  const handleAddressChange = (e: any, index: number) => {
    const updated = [...formData.addresses];
    if (updated[index]) {
      // @ts-ignore
      updated[index][e.target.name] = e.target.value;
    }
    setFormData({ ...formData, addresses: updated });
  };

  // ------------------------------------
  // IMAGE PREVIEW
  // ------------------------------------
  const handleImage = (e: any) => {
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      await axios.patch(API, formData, {
        withCredentials: true,
      });

      setStatus("Saved Successfully!");
    } catch (err) {
      console.log("Update failed:", err);
      setStatus("Update Failed!");
    }
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
                  <img src={preview} alt="User" className="w-full h-full rounded-full object-cover border-[3px] border-[#d09b3a]" />
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
                  className="d-none"
                  onChange={handleImage}
                />
              </div>

              <div className="profile-text">
                <h3 className="text-[22px] m-0 font-bold">{formData.full_name || "Loading..."}</h3>
                <span className="text-[#777] text-sm">Update your personal information</span>
              </div>
            </div>

            {/* -------- FORM -------- */}
            <form onSubmit={handleSubmit} className="mt-2.5">
              {/* FULL NAME */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                />
              </div>

              {/* PHONE */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                />
              </div>

              {/* DOB */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={convertIsoToDisplayDate(formData.date_of_birth)}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                />
              </div>

              {/* GENDER */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                />
              </div>

              {/* LANGUAGE */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Language Preference</label>
                <input
                  type="text"
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                />
              </div>

              {/* PREFERENCES */}
              <div className="flex flex-col mb-[18px]">
                <label className="text-[13px] font-semibold text-[#666] mb-1.5">Astrology Preferences</label>
                <textarea
                  name="preferences"
                  rows={3}
                  value={formData.preferences}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                ></textarea>
              </div>

              {/* ADDRESS BLOCK */}
              <h4 style={{ marginTop: "20px" }}>Address</h4>
              {formData.addresses.map((addr, index) => (
                <div key={index} className="address-section">
                  <div className="flex flex-col mb-[18px]">
                    <label className="text-[13px] font-semibold text-[#666] mb-1.5">Street</label>
                    <input
                      name="street"
                      value={addr.street}
                      onChange={(e) => handleAddressChange(e, index)}
                      className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                    />
                  </div>

                  <div className="flex flex-col mb-[18px]">
                    <label className="text-[13px] font-semibold text-[#666] mb-1.5">City</label>
                    <input
                      name="city"
                      value={addr.city}
                      onChange={(e) => handleAddressChange(e, index)}
                      className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                    />
                  </div>

                  <div className="flex flex-col mb-[18px]">
                    <label className="text-[13px] font-semibold text-[#666] mb-1.5">State</label>
                    <input
                      name="state"
                      value={addr.state}
                      onChange={(e) => handleAddressChange(e, index)}
                      className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                    />
                  </div>

                  <div className="flex flex-col mb-[18px]">
                    <label className="text-[13px] font-semibold text-[#666] mb-1.5">Postal Code</label>
                    <input
                      name="postal_code"
                      value={addr.postal_code}
                      onChange={(e) => handleAddressChange(e, index)}
                      className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                    />
                  </div>

                  <div className="flex flex-col mb-[18px]">
                    <label className="text-[13px] font-semibold text-[#666] mb-1.5">Country</label>
                    <input
                      name="country"
                      value={addr.country}
                      onChange={(e) => handleAddressChange(e, index)}
                      className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                    />
                  </div>

                  <div className="flex flex-col mb-[18px]">
                    <label className="text-[13px] font-semibold text-[#666] mb-1.5">Tag</label>
                    <input
                      name="tag"
                      value={addr.tag}
                      onChange={(e) => handleAddressChange(e, index)}
                      className="p-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] transition-all text-[15px] focus:bg-white focus:border-[#c7c7c7] w-full"
                    />
                  </div>
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
