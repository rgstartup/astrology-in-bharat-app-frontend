"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { getClientProfile, updateClientProfile, createClientProfile, uploadClientDocument, ClientProfileData, AddressDto } from "@/libs/api-profile";

import WishlistGrid from "@/components/features/profile/WishlistGrid";

// Types - now imported from api-profile
type ProfileData = ClientProfileData;

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { clientUser, isClientAuthenticated, clientLoading } = useClientAuth();

  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/images/aa.webp");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!clientLoading && !isClientAuthenticated) {
      router.push("/sign-in?callbackUrl=/profile");
    }
  }, [clientLoading, isClientAuthenticated, router]);


  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Loading profile via API client");
      const data = await getClientProfile();

      if (data) {
        console.log("📊 Profile loaded successfully:", data);
        setProfileData(data);
        if (data.profile_picture) {
          setImagePreview(data.profile_picture);
        }
      }
    } catch (error: any) {
      console.error("❌ Error loading profile:", error);
      // 404 is OK - means new user with no profile yet
      if (error.response?.status !== 404) {
        setErrorMessage("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isClientAuthenticated) {
      loadProfile();
    }
  }, [isClientAuthenticated, loadProfile]);

  // Handle image upload dynamically (immediate) - following astrologer dashboard pattern
  const handleImageChange = async (file: File) => {
    // 1. Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 2. Upload immediately for "dynamic" experience
    try {
      setSaving(true);
      console.log("📸 Starting image upload. File details:", { name: file.name, size: file.size, type: file.type });
      console.log("🔍 Auth state:", { isClientAuthenticated, userId: clientUser?.id });

      // Use the centralized upload function
      const uploadResult = await uploadClientDocument(file);
      console.log("☁️ Upload response from server:", uploadResult);

      if (uploadResult && uploadResult.url) {
        const imageUrl = uploadResult.url;
        console.log("✅ Received Cloudinary URL:", imageUrl);

        // Update local state
        setProfileData(prev => ({ ...prev, profile_picture: imageUrl }));
        setImagePreview(imageUrl);

        // PERSIST to profile immediately
        try {
          console.log("💾 Persisting image URL to profile...");
          const savedProfile = await updateClientProfile({ profile_picture: imageUrl });
          console.log("✅ Persist success:", savedProfile);
          setSuccessMessage("Profile picture updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (saveError: any) {
          console.error("❌ Error persisting profile picture:", saveError);
          // If profile doesn't exist (404), create it with the image
          if (saveError.response?.status === 404) {
            console.log("ℹ️ No profile exists, creating new one with image...");
            try {
              await createClientProfile({ profile_picture: imageUrl, gender: 'other' });
              setSuccessMessage("Profile created with picture!");
              setTimeout(() => setSuccessMessage(""), 3000);
            } catch (createError) {
              console.error("❌ Error creating profile:", createError);
            }
          }
        }
      } else {
        console.warn("⚠️ Upload response missing URL:", uploadResult);
        setErrorMessage("Upload succeeded but no URL returned");
      }
    } catch (error: any) {
      console.error("❌ Error uploading profile picture:", error);
      const errorDetail = error.response?.data?.message || error.message || "Unknown error";
      setErrorMessage(`Failed to upload profile picture: ${errorDetail}`);
      setTimeout(() => setErrorMessage(""), 8000);
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (key: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddressChange = (index: number, key: keyof AddressDto, value: string) => {
    setProfileData(prev => {
      const addresses = [...(prev.addresses || [])];
      if (!addresses[index]) {
        addresses[index] = { line1: '', city: '', state: '', country: '', zipCode: '' };
      }
      addresses[index] = { ...addresses[index], [key]: value };
      return { ...prev, addresses };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 1. Prepare and scrub payload
      const allowedFields = [
        'full_name', 'username', 'date_of_birth', 'time_of_birth',
        'place_of_birth', 'gender', 'phone', 'preferences',
        'language_preference', 'addresses', 'profile_picture'
      ];

      const payload: any = {};

      // Only include allowed fields from profileData
      allowedFields.forEach(field => {
        if (profileData[field as keyof ProfileData] !== undefined && profileData[field as keyof ProfileData] !== null && profileData[field as keyof ProfileData] !== '') {
          payload[field] = profileData[field as keyof ProfileData];
        }
      });

      // Ensure gender has a value since it's required
      if (!payload.gender || payload.gender.trim() === '') {
        payload.gender = 'other';
      }

      // Scrub addresses only for forbidden DB fields, but keep 'id' for updates
      if (payload.addresses && Array.isArray(payload.addresses)) {
        payload.addresses = payload.addresses.map((addr: any) => {
          const { createdAt, updatedAt, user, profile_client, ...cleanAddr } = addr;
          return cleanAddr;
        });
      }

      console.log("📤 Submitting profile data:", payload);

      let savedData;

      // Try to update first, if 404, then create
      try {
        console.log("💾 Submitting PATCH via API client");
        savedData = await updateClientProfile(payload);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log("ℹ️ Profile not found, submitting POST instead");
          savedData = await createClientProfile(payload);
        } else {
          throw error;
        }
      }

      setSuccessMessage("Profile updated successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

      // Update local profile data with server response
      if (savedData) {
        setProfileData(prev => ({ ...prev, ...savedData }));
        if (savedData.profile_picture) {
          setImagePreview(savedData.profile_picture);
        }
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

      // Clear message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSaving(false);
    }
  };


  // Sidebar Menu Items
  const menuItems = [
    { icon: "fa-regular fa-user", label: "Personal Profile", id: "profile" },
    { icon: "fa-regular fa-heart", label: "My Wishlist", id: "wishlist" }, // ADDED
    { icon: "fa-solid fa-clock-rotate-left", label: "Consultation History", id: "history" },
    { icon: "fa-solid fa-bag-shopping", label: "My Orders", id: "orders" },
    { icon: "fa-solid fa-scroll", label: "My Kundli Reports", id: "reports" },
    { icon: "fa-solid fa-shield-halved", label: "Security Settings", id: "security" },
  ];


  const [activeTab, setActiveTab] = useState("profile"); // State for active tab

  // Only show full-page loader if we are doing initial load and have no data yet
  if ((loading || clientLoading) && !profileData?.id && !saving) {
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
              {/* <div className="card border-0 shadow-sm rounded-4 mb-4 text-center p-3">
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
                      {saving ? (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <label
                      htmlFor="profile-upload"
                      className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm p-2 cursor-pointer"
                      style={{
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#fd6410",
                        border: "2px solid #fff",
                        transition: "all 0.3s ease"
                      }}
                      title="Update Profile Picture"
                    >
                      <i className="fa-solid fa-camera" style={{ fontSize: "14px" }}></i>
                      <input
                        id="profile-upload"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={(e) => {
                          console.log("📁 File input onChange triggered!");
                          if (e.target.files && e.target.files[0]) {
                            handleImageChange(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <h5 className="fw-bold mb-1">{profileData.username || "User Name"} <i className="fa-solid fa-check-circle text-primary small"></i></h5>
                  

                 
                </div>
              </div> */}

              {/* Navigation Menu */}
              <div className="card border-0  rounded-4 overflow-hidden">
                 <div className="card border-0  rounded-4 mb-4 text-center p-3">
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
                      {saving ? (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <label
                      htmlFor="profile-upload"
                      className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm p-2 cursor-pointer"
                      style={{
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#fd6410",
                        border: "2px solid #fff",
                        transition: "all 0.3s ease"
                      }}
                      title="Update Profile Picture"
                    >
                      <i className="fa-solid fa-camera" style={{ fontSize: "14px" }}></i>
                      <input
                        id="profile-upload"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={(e) => {
                          console.log("📁 File input onChange triggered!");
                          if (e.target.files && e.target.files[0]) {
                            handleImageChange(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <h5 className="fw-bold mb-1">{profileData.username || "User Name"} <i className="fa-solid fa-check-circle text-primary small"></i></h5>
                  

                 
                </div>
              </div>
               


                <div className=" bg-white border-0 pt-3 px-3">
                  <small className="text-uppercase  fw-bold" style={{ fontSize: "11px", letterSpacing: "1px", color: "black" }}>ACCOUNT MENU</small>
                </div>
                <div className=" p-2">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className={` border-0 rounded-3 d-flex align-items-center px-3 py-2 mb-1 transition-all  text-black
                        hover:bg-orange-light hover:text-black hover:font-bold ${activeTab === item.id ? 'font-bold' : 'text-gray-500'}`}
                      style={activeTab === item.id ? { backgroundColor: "#fd6410", color: "white" } : {}}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item.id);
                      }}
                    >
                      <i className={`${item.icon} me-3`} style={{ width: "20px", color: activeTab === item.id ? "#fff" : "inherit" }}></i>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="col-lg-9">
              {/* Feedback Messages */}
              {successMessage && (
                <div className="alert alert-success border-0 shadow-sm rounded-3 mb-4" role="alert">
                  <i className="fa-solid fa-check-circle me-2"></i> {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4" role="alert">
                  <i className="fa-solid fa-exclamation-circle me-2"></i> {errorMessage}
                </div>
              )}

              {/* Tab Content */}
              {activeTab === "profile" && (
                <>
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
                        className="text-decoration-none p-0 fw-bold text-white px-3 py-2"
                        style={{ backgroundColor: "#fd6410", fontSize: "14px", borderRadius: "10px" }}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <i className="fa-solid fa-pen me-1"></i> {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                       
                         
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold text-uppercase mb-1">User Name</label>
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

                  {/* Address Details Card */}
                  <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                      <h5 className="fw-bold mb-0">
                        <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e2f8ff", color: "#00b4d8" }}>
                          <i className="fa-solid fa-location-dot"></i>
                        </span>
                        Address Details
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      {isEditing ? (
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label className="text-muted small fw-bold text-uppercase mb-1">Address Line 1</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileData.addresses?.[0]?.line1 || ""}
                              onChange={(e) => handleAddressChange(0, 'line1', e.target.value)}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="text-muted small fw-bold text-uppercase mb-1">Address Line 2 (Optional)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileData.addresses?.[0]?.line2 || ""}
                              onChange={(e) => handleAddressChange(0, 'line2', e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold text-uppercase mb-1">City</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileData.addresses?.[0]?.city || ""}
                              onChange={(e) => handleAddressChange(0, 'city', e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold text-uppercase mb-1">State</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileData.addresses?.[0]?.state || ""}
                              onChange={(e) => handleAddressChange(0, 'state', e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="text-muted small fw-bold text-uppercase mb-1">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileData.addresses?.[0]?.country || ""}
                              onChange={(e) => handleAddressChange(0, 'country', e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="text-muted small fw-bold text-uppercase mb-1">Zip Code</label>
                            <input
                              type="text"
                              className="form-control"
                              value={profileData.addresses?.[0]?.zipCode || ""}
                              onChange={(e) => handleAddressChange(0, 'zipCode', e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          {profileData.addresses && profileData.addresses.length > 0 ? (
                            <div className="d-flex align-items-start gap-3">
                              <i className="fa-solid fa-map-location-dot text-muted mt-1"></i>
                              <div>
                                <p className="fw-bold mb-0">{profileData.addresses[0]?.line1}</p>
                                {profileData.addresses[0]?.line2 && <p className="text-muted mb-0">{profileData.addresses[0]?.line2}</p>}
                                <p className="text-muted mb-0">
                                  {profileData.addresses[0]?.city}, {profileData.addresses[0]?.state}, {profileData.addresses[0]?.country} - {profileData.addresses[0]?.zipCode}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted italic mb-0">No address set. Click Edit to add one.</p>
                          )}
                        </div>
                      )}
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
                </>
              )}

              {activeTab === "wishlist" && (
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                    <h5 className="fw-bold mb-0">
                      <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#ffebee", color: "#e53935" }}>
                        <i className="fa-solid fa-heart"></i>
                      </span>
                      My Wishlist
                    </h5>
                  </div>
                  <div className="card-body p-4 pt-0">
                    <WishlistGrid />
                  </div>
                </div>
              )}

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
