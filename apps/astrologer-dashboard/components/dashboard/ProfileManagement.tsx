"use client";

import React, { useState } from "react";
import { User, Clock, Award, Upload, CreditCard, Edit3, Save,  ChevronRight } from "lucide-react";



const ProfileManagement = () => {
  const [profile, setProfile] = useState({
    name: "Astrologer Rajesh Sharma",
    bio: "Experienced Vedic Astrologer helping clients for 10+ years.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    specialization: ["Vedic Astrology", "Numerology"],
    experience: "12 years",
    languages: ["English", "Hindi", "Marathi"],
    availability: "Mon - Sat, 10AM - 6PM",
    certificates: ["Vedic Astrology Certification", "Tarot Reading Diploma"],
    bankDetails: "UPI: rajesh@upi",
    profilePic: "/images/profile.jpg",
    isProfileActive: true, // New field for profile status
  });

  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleEditClick = (section: string) => {
    setEditMode(section);
    setTempProfile(profile);
  };

  const handleSave = (section: string) => {
    // Implement API call to save data
    setProfile(tempProfile);
    setEditMode(null);
    console.log(`Saving changes for ${section}...`, tempProfile);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
      <p className="text-gray-600 mb-8 text-sm sm:text-base">
        Manage your personal info, expertise, availability, and payout details.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative w-20 h-20 rounded-full bg-gray-200 animate-pulse">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-yellow-500 shadow-md bg-top
                "
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {profile.isProfileActive ? (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
                {profile.specialization.map((spec, i) => (
                  <span key={i} className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
            {editMode !== "personal" && (
              <button
                onClick={() => handleEditClick("personal")}
                className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
          {editMode === "personal" ? (
            <div className="space-y-4">
              <textarea
                name="bio"
                value={tempProfile.bio}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={4}
              />
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("personal")}
                  className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Expertise & Availability */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <User className="w-5 h-5 mr-2 text-yellow-600" /> Expertise
          </h2>
          <div className="mb-4">
            <p className="font-semibold text-gray-700">Experience</p>
            <p className="text-gray-600">{profile.experience}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-gray-700">Languages</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.languages.map((lang, i) => (
                <span key={i} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <h2 className="flex items-center text-lg font-semibold mb-4 mt-6">
            <Clock className="w-5 h-5 mr-2 text-yellow-600" /> Availability
          </h2>
          <p className="text-gray-600 mb-3">{profile.availability}</p>
          <button className="flex items-center space-x-2 mt-4 bg-yellow-600 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
            <Edit3 className="w-4 h-4" />
            <span>Set Availability</span>
          </button>
        </div>

        {/* Certificates */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <Award className="w-5 h-5 mr-2 text-yellow-600" /> Certificates
          </h2>
          <ul className="space-y-2 text-gray-700 mb-4">
            {profile.certificates.map((cert, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                <span>{cert}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Certificate</span>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <CreditCard className="w-5 h-5 mr-2 text-yellow-600" /> Payout Info
          </h2>
          <p className="text-gray-700 mb-3 font-mono bg-gray-100 p-3 rounded-md">
            {profile.bankDetails}
          </p>
          <button className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
            <Edit3 className="w-4 h-4" />
            <span>Update Payout Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;