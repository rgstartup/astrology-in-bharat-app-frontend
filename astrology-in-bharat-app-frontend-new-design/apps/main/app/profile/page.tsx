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
  full_name?: string;
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
  const [imagePreview, setImagePreview] = useState<string>("/images/default-avatar.png");

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
      const formData = new FormData();
      
      // Add profile data
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof ProfileData];
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image if selected
      if (profileImage) {
        formData.append('file', profileImage);
      }

      const response = await axios.patch(
        'http://localhost:4000/api/v1/client/profile',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccessMessage("Profile updated successfully!");
      if (response.data.profile_picture) {
        setImagePreview(response.data.profile_picture);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile");
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
              <h2 className="mb-0" style={{ color: "var(--primary-color)" }}>
                My Profile
              </h2>
              <p className="mb-0 text-muted">Manage your personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Left Column - Profile Picture */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <ProfileImageUpload
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  userName={profileData.full_name}
                  userEmail={clientUser?.email}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
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

                <form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <ProfileFormSection title="Personal Information" icon="fa-solid fa-user">
                    <div className="col-md-6">
                      <FormInput
                        label="Full Name"
                        type="text"
                        value={profileData.full_name || ""}
                        onChange={(value) => handleInputChange('full_name', value)}
                        placeholder="Enter your full name"
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
                        onClick={() => router.push('/')}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn px-4 text-white"
                        disabled={saving}
                        style={{ backgroundColor: "var(--primary-color)" }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
