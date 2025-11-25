"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ClientSettingsPage() {
  const API = "http://localhost:4000/api/v1/client/profile";

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

  function convertIsoToDisplayDate(isoDateString) {
    // 1. Create a Date object from the ISO string
    const date = new Date(isoDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // 2. Define formatting options
    const options = {
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
    updated[index][e.target.name] = e.target.value;
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
      <div className="settings-page-wrapper">
        <div className="settings-container">
          {/* -------- PAGE TITLE -------- */}
          <div className="settings-header">
            <h2>Profile Settings</h2>
            <p>Manage your personal account details.</p>
          </div>

          {/* -------- PROFILE CARD -------- */}
          <div className="settings-card">
            <div className="profile-section">
              <div className="profile-img-wrapper">
                {preview ? (
                  <img src={preview} alt="User" />
                ) : (
                  <div className="placeholder-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                )}

                <label htmlFor="profile-upload" className="profile-upload-btn">
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
                <h3>{formData.full_name || "Loading..."}</h3>
                <span>Update your personal information</span>
              </div>
            </div>

            {/* -------- FORM -------- */}
            <form onSubmit={handleSubmit} className="profile-form">
              {/* FULL NAME */}
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* DOB */}
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={convertIsoToDisplayDate(formData.date_of_birth)}
                  onChange={handleChange}
                />
              </div>

              {/* GENDER */}
              <div className="form-group">
                <label>Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>

              {/* LANGUAGE */}
              <div className="form-group">
                <label>Language Preference</label>
                <input
                  type="text"
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={handleChange}
                />
              </div>

              {/* PREFERENCES */}
              <div className="form-group">
                <label>Astrology Preferences</label>
                <textarea
                  name="preferences"
                  rows={3}
                  value={formData.preferences}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* ADDRESS BLOCK */}
              <h4 style={{ marginTop: "20px" }}>Address</h4>
              {formData.addresses.map((addr, index) => (
                <div key={index} className="address-section">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      name="street"
                      value={addr.street}
                      onChange={(e) => handleAddressChange(e, index)}
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      name="city"
                      value={addr.city}
                      onChange={(e) => handleAddressChange(e, index)}
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      name="state"
                      value={addr.state}
                      onChange={(e) => handleAddressChange(e, index)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      name="postal_code"
                      value={addr.postal_code}
                      onChange={(e) => handleAddressChange(e, index)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      name="country"
                      value={addr.country}
                      onChange={(e) => handleAddressChange(e, index)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tag</label>
                    <input
                      name="tag"
                      value={addr.tag}
                      onChange={(e) => handleAddressChange(e, index)}
                    />
                  </div>
                </div>
              ))}

              {/* BUTTONS */}
              <div className="form-actions">
                <button type="button" className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {status === "Saving..." ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

              {status && <p className="status-text">{status}</p>}
            </form>
          </div>
        </div>

        {/* ---------- INTERNAL CSS SCOPED BY PARENT ---------- */}
        <style>{`
          .settings-page-wrapper {
            font-family: "Outfit", sans-serif;
            background: #f7f7f9;
            padding: 40px;
            display: flex;
            justify-content: center;
          }

          .settings-container {
            width: 100%;
            max-width: 850px;
          }

          .settings-header h2 {
            font-weight: 700;
            color: #242424;
            margin-bottom: 4px;
          }
          .settings-header p {
            color: #777;
            margin-bottom: 25px;
          }

          .settings-card {
            background: #ffffff;
            padding: 35px;
            border-radius: 22px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          }

          .profile-section {
            display: flex;
            align-items: center;
            gap: 25px;
            margin-bottom: 35px;
          }

          .profile-img-wrapper {
            position: relative;
            width: 110px;
            height: 110px;
          }
          .profile-img-wrapper img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #d09b3a;
          }
          .placeholder-icon {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 38px;
            color: #888;
            border: 2px solid #d09b3a;
          }

          .profile-upload-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 34px;
            height: 34px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ddd;
            cursor: pointer;
          }

          .profile-text h3 {
            font-size: 22px;
            margin: 0;
            font-weight: 700;
          }
          .profile-text span {
            color: #777;
            font-size: 14px;
          }

          .profile-form {
            margin-top: 10px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 18px;
          }

          .form-group label {
            font-size: 13px;
            font-weight: 600;
            color: #666;
            margin-bottom: 6px;
          }

          .form-group input,
          .form-group textarea {
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid #e5e5e5;
            background: #fafafa;
            transition: 0.25s;
            font-size: 15px;
          }
          .form-group input:focus,
          .form-group textarea:focus {
            background: #fff;
            border-color: #c7c7c7;
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 25px;
          }

          .cancel-btn {
            background: #e9e9e9;
            padding: 10px 22px;
            border-radius: 30px;
            border: none;
            font-weight: 600;
            cursor: pointer;
          }
          .save-btn {
            background: linear-gradient(135deg,#732882,#a051b5);
            color: #fff;
            padding: 10px 28px;
            border-radius: 30px;
            border: none;
            font-weight: 600;
            cursor: pointer;
          }

          .status-text {
            margin-top: 15px;
            font-size: 14px;
            font-weight: 600;
            color: #4b4b4b;
          }

          @media (max-width: 600px) {
            .settings-card {
              padding: 25px;
            }
            .profile-section {
              flex-direction: column;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </>
  );
}
