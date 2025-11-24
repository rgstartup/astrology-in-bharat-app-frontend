"use client";
import React, { useState } from "react";

export default function ClientSettingsPage() {
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    full_name: "New Name",
    email: "client@example.com",
    phone: "9876543210",
    date_of_birth: "1990-01-01",
    language: "English",
    preferences: "Astrology",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setStatus("Saving...");
    setTimeout(() => setStatus("Saved Successfully!"), 1200);
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
                <h3>{formData.full_name}</h3>
                <span>Update your personal information</span>
              </div>
            </div>

            {/* -------- FORM -------- */}
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Language Preference</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Astrology Preferences</label>
                <textarea
                  name="preferences"
                  rows={3}
                  value={formData.preferences}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* -------- BUTTONS -------- */}
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
