"use client";

import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  initialData?: any;
}

interface FormData {
  full_name: string;
  gender: "male" | "female" | "other" | "";
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  phone: string;
  language_preference: string;
  preferences: string; // Additional notes/preferences
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    gender: "",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    phone: "",
    language_preference: "",
    preferences: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data when initialData provided
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        full_name: initialData.full_name || prev.full_name,
        gender: initialData.gender || prev.gender,
        date_of_birth: initialData.date_of_birth || prev.date_of_birth,
        time_of_birth: initialData.time_of_birth || prev.time_of_birth,
        place_of_birth: initialData.place_of_birth || prev.place_of_birth,
        phone: initialData.phone || prev.phone,
        language_preference: initialData.language_preference || prev.language_preference,
        preferences: initialData.preferences || prev.preferences,
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.full_name ||
      !formData.gender ||
      !formData.date_of_birth ||
      !formData.time_of_birth ||
      !formData.place_of_birth
    ) {
      setError("Please fill in all required birth details.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use the centralized apiClient which handles tokens automatically
      await apiClient.post("/client/profile", formData);

      setSuccess("Profile updated successfully!");

      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(
        err.response?.data?.message ||
        "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content overflow-hidden border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">Complete Your Profile</h5>
          </div>
          <div className="modal-body p-4 bg-light">
            <p className="text-secondary mb-4">
              Please provide your birth details for accurate astrological
              predictions.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Gender */}
              <div className="mb-3">
                <label className="form-label fw-bold">Gender *</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="row">
                {/* Date of Birth */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Date of Birth *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Time of Birth */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Time of Birth *</label>
                  <input
                    type="time"
                    className="form-control"
                    name="time_of_birth"
                    value={formData.time_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Place of Birth */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Place of Birth *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="place_of_birth"
                    value={formData.place_of_birth}
                    onChange={handleChange}
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="form-label fw-bold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* Language Preference */}
              <div className="mb-3">
                <label className="form-label fw-bold">Language Preference</label>
                <select
                  className="form-select"
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={handleChange}
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Sanskrit">Sanskrit</option>
                </select>
              </div>

              {/* Preferences */}
              <div className="mb-3">
                <label className="form-label fw-bold">Astrological Preferences / Notes</label>
                <textarea
                  className="form-control"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  placeholder="Any specific areas you are interested in (e.g., Career, Health, Marriage)..."
                  rows={3}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
