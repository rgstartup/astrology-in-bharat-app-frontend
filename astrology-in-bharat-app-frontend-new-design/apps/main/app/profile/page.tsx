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
  useEffect(() => {
    if (!isClientAuthenticated) {
      router.push('/sign-in');
    }
  }, [isClientAuthenticated, router]);

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/v1/client/profile', {
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
          'http://localhost:4000/api/v1/client/profile',
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
            'http://localhost:4000/api/v1/client/profile',
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
          'http://localhost:4000/api/v1/client/profile/picture',
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

  // Handle input changes
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
    <div className="min-vh-100 bg-light">
      {/* Header Section */}
      <div className="bg-white py-4 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0" style={{ color: "var(--primary-color)" }}>
                    My Profile
                  </h2>
                  <p className="mb-0 text-muted">Manage your profile information</p>
                </div>
                <div>
                  <button
                    className="btn px-4 text-white btn-lg"
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    {isEditing ? (
                      <>
                        <i className="fa-solid fa-times me-2"></i>
                        Cancel
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-edit me-2"></i>
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Floating Edit Button */}
        {!isEditing && (
          <div className="position-fixed" style={{ bottom: "20px", right: "20px", zIndex: 1000 }}>
            <button
              className="btn btn-primary btn-lg rounded-circle shadow-lg"
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: "#fd6410",
                width: "60px",
                height: "60px",
                borderRadius: "50%"
              }}
              title="Edit Profile"
            >
              <i className="fa-solid fa-edit"></i>
            </button>
          </div>
        )}

        <div className="row">
          {/* Left Column - Profile Picture */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <ProfileImageUpload
                  imagePreview={imagePreview}
                  onImageChange={isEditing ? handleImageChange : () => { }}
                  userName={profileData.username || "User"}
                  userEmail={clientUser?.email}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Alert Messages */}
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="fa-solid fa-check-circle me-2"></i>
                    {successMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccessMessage("")}
                    ></button>
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fa-solid fa-exclamation-circle me-2"></i>
                    {errorMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setErrorMessage("")}
                    ></button>
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <ProfileFormSection title="Personal Information" icon="fa-solid fa-user">
                      <div className="col-md-6">
                        <FormInput
                          label="Username"
                          type="text"
                          value={profileData.username || ""}
                          onChange={(value) => handleInputChange('username', value)}
                          placeholder="Enter your username"
                        />
                      </div>

                      <div className="col-md-6">
                        <FormInput
                          label="Email"
                          type="email"
                          value={clientUser?.email || ""}
                          disabled={true}
                          className="bg-light"
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>

                      <div className="col-md-6">
                        <FormInput
                          label="Phone"
                          type="tel"
                          value={profileData.phone || ""}
                          onChange={(value) => handleInputChange('phone', value)}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="col-md-6">
                        <FormInput
                          label="Gender"
                          type="text"
                          value={profileData.gender || ""}
                          onChange={(value) => handleInputChange('gender', value as 'male' | 'female' | 'other')}
                          options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' }
                          ]}
                          placeholder="Select Gender"
                        />
                      </div>
                    </ProfileFormSection>

                    {/* Birth Information Section */}
                    <ProfileFormSection title="Birth Information" icon="fa-solid fa-calendar">
                      <div className="col-md-4">
                        <FormInput
                          label="Date of Birth"
                          type="date"
                          value={profileData.date_of_birth || ""}
                          onChange={(value) => handleInputChange('date_of_birth', value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <FormInput
                          label="Time of Birth"
                          type="time"
                          value={profileData.time_of_birth || ""}
                          onChange={(value) => handleInputChange('time_of_birth', value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <FormInput
                          label="Place of Birth"
                          type="text"
                          value={profileData.place_of_birth || ""}
                          onChange={(value) => handleInputChange('place_of_birth', value)}
                          placeholder="Enter your birth place"
                        />
                      </div>
                    </ProfileFormSection>

                    {/* Preferences Section */}
                    <ProfileFormSection title="Preferences" icon="fa-solid fa-cog">
                      <div className="col-md-6">
                        <FormInput
                          label="Language Preference"
                          type="text"
                          value={profileData.language_preference || ""}
                          onChange={(value) => handleInputChange('language_preference', value)}
                          options={[
                            { value: 'english', label: 'English' },
                            { value: 'hindi', label: 'हिंदी' }
                          ]}
                          placeholder="Select Language"
                        />
                      </div>

                      <div className="col-md-6">
                        <FormInput
                          label="Astrology Preferences"
                          type="textarea"
                          value={profileData.preferences || ""}
                          onChange={(value) => handleInputChange('preferences', value)}
                          placeholder="Enter your astrology preferences"
                          rows={3}
                        />
                      </div>
                    </ProfileFormSection>

                    {/* Submit Button */}
                    <div className="col-12">
                      <div className="d-flex gap-3 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary px-4"
                          onClick={() => {
                            setIsEditing(false);
                            loadProfile(); // Reload original data
                          }}
                        >
                          <i className="fa-solid fa-times me-2"></i>
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn px-4 text-white"
                          disabled={saving}
                          style={{ backgroundColor: "#fd6410" }}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-save me-2"></i>
                              Save Profile
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <div className="row">
                    <div className="col-12">
                      <h4 className="mb-4" style={{ color: "var(--primary-color)" }}>
                        <i className="fa-solid fa-user me-2"></i>
                        Personal Information
                      </h4>
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <strong>Username:</strong> {profileData.username || "Not set"}
                        </div>
                        <div className="col-md-6">
                          <strong>Email:</strong> {clientUser?.email || "Not set"}
                        </div>
                        <div className="col-md-6">
                          <strong>Phone:</strong> {profileData.phone || "Not set"}
                        </div>
                        <div className="col-md-6">
                          <strong>Gender:</strong> {profileData.gender || "Not set"}
                        </div>
                      </div>

                      <h4 className="mb-4" style={{ color: "var(--primary-color)" }}>
                        <i className="fa-solid fa-calendar me-2"></i>
                        Birth Information
                      </h4>
                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <strong>Date of Birth:</strong> {profileData.date_of_birth || "Not set"}
                        </div>
                        <div className="col-md-4">
                          <strong>Time of Birth:</strong> {profileData.time_of_birth || "Not set"}
                        </div>
                        <div className="col-md-4">
                          <strong>Place of Birth:</strong> {profileData.place_of_birth || "Not set"}
                        </div>
                      </div>

                      <h4 className="mb-4" style={{ color: "var(--primary-color)" }}>
                        <i className="fa-solid fa-cog me-2"></i>
                        Preferences
                      </h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong>Language Preference:</strong> {profileData.language_preference || "Not set"}
                        </div>
                        <div className="col-md-6">
                          <strong>Astrology Preferences:</strong> {profileData.preferences || "Not set"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
