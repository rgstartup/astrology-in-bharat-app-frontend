"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Clock,
  Edit3,
  Save,
  MapPin,
  Languages,
  Sparkles,
  Briefcase,
  IndianRupee,
  Users,
  Shield,
  CreditCard
} from "lucide-react";

const ProfileManagement = () => {
  const [profile, setProfile] = useState({
    name: "",
    gender: "male",
    bio: "",
    specialization: "",
    experience: 0,
    languages: [] as string[],
    price: 0,
    address: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    bankDetails: "",
    is_available: false,
  });

  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState(profile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const API_BASE_URL = "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/expert/profile`, {
          withCredentials: true,
        });

        if (response.data) {
          const data = response.data;
          const mappedProfile = {
            name: data.user?.name || "Expert",
            gender: data.gender || "male",
            bio: data.bio || "",
            specialization: data.specialization || "",
            experience: data.experience_in_years || 0,
            languages: data.languages ? (Array.isArray(data.languages) ? data.languages : data.languages.split(",")) : [],
            price: data.price || 0,
            address: data.addresses?.[0]?.line1 || "",
            city: data.addresses?.[0]?.city || "",
            state: data.addresses?.[0]?.state || "",
            country: data.addresses?.[0]?.country || "India",
            zipCode: data.addresses?.[0]?.zipCode || "",
            bankDetails: data.bank_details || "",
            is_available: data.is_available ?? false,
          };
          setProfile(mappedProfile);
          setTempProfile(mappedProfile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
          console.log("No expert profile found. User can create one.");
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setProfileExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = (section: string) => {
    setEditMode(section);
    setTempProfile(profile);
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    try {
      const payload = {
        gender: tempProfile.gender.toLowerCase() as any,
        specialization: tempProfile.specialization,
        experience_in_years: Number(tempProfile.experience) || 0,
        bio: tempProfile.bio,
        languages: tempProfile.languages,
        price: Number(tempProfile.price) || 0,
        bank_details: tempProfile.bankDetails,
        is_available: Boolean(tempProfile.is_available),
        addresses: [
          {
            line1: tempProfile.address || "Main Address",
            city: tempProfile.city || "N/A",
            state: tempProfile.state || "N/A",
            country: tempProfile.country || "India",
            zipCode: tempProfile.zipCode || "110001"
          }
        ]
      };

      if (profileExists) {
        await axios.patch(`${API_BASE_URL}/expert/profile`, payload, { withCredentials: true });
      } else {
        await axios.post(`${API_BASE_URL}/expert/profile`, payload, { withCredentials: true });
        setProfileExists(true);
      }

      setProfile(tempProfile);
      setEditMode(null);
      alert("Profile saved successfully!");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      const errorMsg = err.response?.data?.message;
      alert(Array.isArray(errorMsg) ? errorMsg.join("\n") : (errorMsg || "Failed to save profile"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your personal info, expertise, and payout details.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Astrologer Profile Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-800">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              Basic Astrologer Profile
            </h2>
            {editMode !== "basic" && (
              <button
                onClick={() => handleEditClick("basic")}
                className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {editMode === "basic" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={tempProfile.gender}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={tempProfile.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Vedic Astrology, Numerology"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={tempProfile.experience}
                      onChange={handleChange}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price / Min (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={tempProfile.price}
                      onChange={handleChange}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    name="languages"
                    value={tempProfile.languages.join(", ")}
                    onChange={(e) => setTempProfile({ ...tempProfile, languages: e.target.value.split(",").map(s => s.trim()) })}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={tempProfile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none resize-none"
                    placeholder="Tell us about your expertise..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={tempProfile.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm outline-none resize-none"
                    placeholder="Residential or Office Address"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={tempProfile.city} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" name="state" value={tempProfile.state} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input type="text" name="zipCode" value={tempProfile.zipCode} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Details / UPI</label>
                    <input type="text" name="bankDetails" value={tempProfile.bankDetails} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("basic")}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors shadow-md disabled:opacity-50 font-semibold"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg"><Users className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</h4>
                    <p className="text-gray-800 font-medium capitalize">{profile.gender}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg"><Sparkles className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Specialization</h4>
                    <p className="text-gray-800 font-medium">{profile.specialization || "Not Set"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg"><Briefcase className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</h4>
                    <p className="text-gray-800 font-medium">{profile.experience} Years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg"><Languages className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Languages</h4>
                    <p className="text-gray-800 font-medium">{profile.languages.length > 0 ? profile.languages.join(", ") : "Not Set"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg"><IndianRupee className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price / Min</h4>
                    <p className="text-gray-800 font-medium">₹{profile.price}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg"><MapPin className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</h4>
                    <p className="text-gray-800 font-medium text-sm line-clamp-1">{profile.city || "Not Set"}, {profile.state || ""}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About Astrologer</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{profile.bio || "No bio available."}</p>
              </div>

              <div className="md:col-span-2 lg:col-span-3 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payout Details
                  </h4>
                  <p className="text-gray-700 text-sm font-medium">{profile.bankDetails || "Not Set"}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Account Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${profile.is_available ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span className="text-sm font-medium text-gray-700">{profile.is_available ? "Online / Available" : "Offline / Unavailable"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;