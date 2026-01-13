"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import ProfileImageUpload from "@packages/ui/src/components/profile/ProfileImageUpload";
import ProfileFormSection from "@packages/ui/src/components/profile/ProfileFormSection";
import FormInput from "@packages/ui/src/components/profile/FormInput";

// Types
interface ProfileData {
  username?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  preferences?: string;
  language_preference?: string;
  profile_picture?: string;
  addresses?: AddressDto[];
}

interface AddressDto {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { clientUser, isClientAuthenticated } = useClientAuth();

  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/images/a.webp");
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  // useEffect(() => {
  //   if (!isClientAuthenticated) {
  //     router.push('/sign-in');
  //   }
  // }, [isClientAuthenticated, router]);

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543'}/api/v1/client/profile`, {
        withCredentials: true
      });

      if (response.data) {
        setProfileData(response.data);
        if (response.data.profile_picture) {
          setImagePreview(response.data.profile_picture);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setErrorMessage("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isClientAuthenticated) {
      loadProfile();
    }
  }, [isClientAuthenticated, loadProfile]);

  // Handle image upload
  const handleImageChange = (file: File) => {
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare JSON payload
      const payload: any = { ...profileData };

      // Ensure gender has a value since it's required
      if (!payload.gender || payload.gender.trim() === '') {
        payload.gender = 'other';
      }

      // Clean payload: remove empty strings/nulls/undefined to avoid validation errors
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });
      // Remove non-DTO fields if any (axios will ignore extra properties usually, but good to be clean)

      console.log("📤 Submitting profile data:", payload);

      let response;

      // Try to update first, if 404, then create
      try {
        response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543'}/api/v1/client/profile`,
          payload,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log("✅ PATCH response:", response.status, response.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Profile doesn't exist, create it
          console.log("📝 Profile not found, creating new profile...");
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543'}/api/v1/client/profile`,
            payload,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log("✅ POST response:", response.status, response.data);
        } else {
          console.log("❌ Other error:", error.response?.status, error.response?.data);
          throw error;
        }
      }

      // Handle image upload if selected
      if (profileImage) {
        console.log("🖼️ Uploading profile picture...");
        const formData = new FormData();
        formData.append('file', profileImage);

        const imageResponse = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543'}/api/v1/client/profile/picture`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log("✅ Picture upload response:", imageResponse.status);

        // Update local state with new image path if returned
        if (imageResponse.data && imageResponse.data.profile_picture) {
          response.data.profile_picture = imageResponse.data.profile_picture;
        }
      }

      setSuccessMessage("Profile updated successfully!");

      // Update local profile data with server response
      setProfileData(prev => ({ ...prev, ...response.data }));

      if (response.data.profile_picture) {
        setImagePreview(response.data.profile_picture);
      }
      setIsEditing(false); // Exit edit mode after save
    } catch (error: any) {
      console.error("❌ Error updating profile:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Better error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error occurred';

      setErrorMessage(`Failed to update profile: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // ... (previous logic remains, just updating the return)

  // Sidebar Menu Items
  const menuItems = [
    { icon: "fa-regular fa-user", label: "Personal Profile", active: true },
    { icon: "fa-solid fa-clock-rotate-left", label: "Consultation History" },
    { icon: "fa-solid fa-bag-shopping", label: "My Orders" },
    { icon: "fa-solid fa-scroll", label: "My Kundli Reports" },
    { icon: "fa-solid fa-shield-halved", label: "Security Settings" },
  ];

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Breadcrumb & Title */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item"><a href="/" className="text-muted text-decoration-none">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page" style={{ color: "#fd6410" }}>Profile</li>
              </ol>
            </nav>
            <h1 className="h3 fw-bold mb-1">User Account</h1>
            <p className="text-muted">Manage your cosmic identity and preferences</p>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Sidebar Column */}
            <div className="col-lg-3">
              {/* Profile Summary Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4 text-center p-3">
                <div className="card-body">
                  <div className="position-relative d-inline-block mb-3">
                    <div style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid #fff",
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      margin: "0 auto"
                    }}>
                      <img
                        src={imagePreview}
                        alt="Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    {isEditing && (
                      <label
                        className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm p-2 cursor-pointer"
                        style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fd6410" }}
                      >
                        <i className="fa-solid fa-camera" style={{ fontSize: "14px" }}></i>
                        <input type="file" className="d-none" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleImageChange(e.target.files[0]);
                        }} />
                      </label>
                    )}
                  </div>

                  <h5 className="fw-bold mb-1">{profileData.username || "User Name"} <i className="fa-solid fa-check-circle text-primary small"></i></h5>
                  <p className="text-muted small mb-3">Capricorn | Nakshatra: Shravana</p>

                  <div className="d-flex justify-content-center gap-4 mt-3 pt-3 border-top">
                    <div>
                      <h4 className="fw-bold mb-0" style={{ color: "#fd6410" }}>12</h4>
                      <small className="text-muted" style={{ fontSize: "10px", fontWeight: 600 }}>CONSULTS</small>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-0" style={{ color: "#fd6410" }}>4.8</h4>
                      <small className="text-muted" style={{ fontSize: "10px", fontWeight: 600 }}>KARMA SCORE</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 pt-3 px-3">
                  <small className="text-uppercase text-warning fw-bold" style={{ fontSize: "11px", letterSpacing: "1px" }}>ACCOUNT MENU</small>
                </div>
                <div className="list-group list-group-flush p-2">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center px-3 py-2 mb-1 ${item.active ? 'bg-orange-light text-dark fw-bold' : 'text-muted'}`}
                      style={item.active ? { backgroundColor: "#fff8ec", color: "#fd6410" } : {}}
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className={`${item.icon} me-3`} style={{ width: "20px", color: item.active ? "#fd6410" : "inherit" }}></i>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="col-lg-9">
              {/* Personal Details Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#ffefe5", color: "#fd6410" }}>
                      <i className="fa-regular fa-id-card"></i>
                    </span>
                    Personal Details
                  </h5>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0 fw-bold"
                    style={{ color: "#fd6410", fontSize: "14px" }}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <i className="fa-solid fa-pen me-1"></i> {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="text-muted small fw-bold text-uppercase mb-1">FULL NAME</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control fw-bold"
                          value={profileData.username || ""}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                        />
                      ) : (
                        <p className="fw-bold mb-0">{profileData.username || "Not set"}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-bold text-uppercase mb-1">EMAIL ADDRESS</label>
                      <p className="fw-bold mb-0">{clientUser?.email || "Not set"}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-bold text-uppercase mb-1">PHONE NUMBER</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control fw-bold"
                          value={profileData.phone || ""}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="d-flex align-items-center">
                          <p className="fw-bold mb-0 me-2">{profileData.phone || "Not set"}</p>
                          {profileData.phone && <span className="badge bg-success bg-opacity-10 text-success px-2 py-1" style={{ fontSize: "10px" }}>VERIFIED</span>}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-bold text-uppercase mb-1">GENDER</label>
                      {isEditing ? (
                        <select
                          className="form-select fw-bold"
                          value={profileData.gender || ""}
                          onChange={(e) => handleInputChange('gender', e.target.value as any)}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="fw-bold mb-0 text-capitalize">{profileData.gender || "Not set"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Astro Birth Details Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#f0f2f5", color: "#333" }}>
                      <i className="fa-regular fa-calendar"></i>
                    </span>
                    Astro Birth Details
                  </h5>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0 fw-bold"
                    style={{ color: "#fd6410", fontSize: "14px" }}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <i className="fa-solid fa-pen me-1"></i> {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1">DATE OF BIRTH</label>
                      {isEditing ? (
                        <input
                          type="date"
                          className="form-control fw-bold"
                          value={profileData.date_of_birth || ""}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        />
                      ) : (
                        <p className="fw-bold mb-0 text-dark"><i className="fa-regular fa-calendar me-2 text-warning"></i>{profileData.date_of_birth || "Not set"}</p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1">TIME OF BIRTH</label>
                      {isEditing ? (
                        <input
                          type="time"
                          className="form-control fw-bold"
                          value={profileData.time_of_birth || ""}
                          onChange={(e) => handleInputChange('time_of_birth', e.target.value)}
                        />
                      ) : (
                        <p className="fw-bold mb-0 text-dark"><i className="fa-regular fa-clock me-2 text-warning"></i>{profileData.time_of_birth || "Not set"}</p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1">BIRTH PLACE</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control fw-bold"
                          value={profileData.place_of_birth || ""}
                          onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="fw-bold mb-0 text-dark"><i className="fa-solid fa-location-dot me-2 text-warning"></i>{profileData.place_of_birth || "Not set"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings & Preferences Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e8f0fe", color: "#4285f4" }}>
                      <i className="fa-solid fa-sliders"></i>
                    </span>
                    Settings & Preferences
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row align-items-center mb-4">
                    <div className="col-md-8">
                      <h6 className="fw-bold mb-1">Preferred Language</h6>
                      <p className="text-muted small mb-0">Language for horoscopes and consultation</p>
                    </div>
                    <div className="col-md-4 text-end">
                      {isEditing ? (
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={profileData.language_preference || "english"}
                          onChange={(e) => handleInputChange('language_preference', e.target.value)}
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                        </select>
                      ) : (
                        <span className="badge bg-light text-dark px-3 py-2 border rounded-pill">
                          <i className="fa-solid fa-globe me-2"></i>
                          {profileData.language_preference === 'hindi' ? 'Hindi' : 'English / Hindi'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="row align-items-center mb-4">
                    <div className="col-md-8">
                      <h6 className="fw-bold mb-1">Email Notifications</h6>
                      <p className="text-muted small mb-0">Receive daily horoscope and offers</p>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="form-check form-switch d-inline-block">
                        <input className="form-check-input" type="checkbox" role="switch" id="emailNotif" defaultChecked style={{ backgroundColor: "#fd6410", borderColor: "#fd6410" }} />
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="fw-bold mb-1">App Theme</h6>
                      <p className="text-muted small mb-0">Switch between light and dark mode</p>
                    </div>
                    <div className="col-md-4 text-end">
                      <button type="button" className="btn btn-light rounded-circle"><i className="fa-solid fa-moon"></i></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 mb-5">
                <button type="button" className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-bold bg-white text-dark border-0 shadow-sm">
                  Deactivate Account
                </button>
                <button type="submit" disabled={saving} className="btn text-white px-4 py-2 rounded-3 fw-bold shadow-sm" style={{ backgroundColor: "#fd6410" }}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
