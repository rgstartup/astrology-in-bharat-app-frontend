"use client";
import React, { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface AddressDto {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isPrimary?: boolean;
}

interface ProfileFormData {
  date_of_birth?: string;
  gender: "male" | "female" | "other" | "";
  preferences?: string;
  addresses?: AddressDto[];
}

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  onSkip,
}) => {
  const router = useRouter();
  const API_ENDPOINT = "http://localhost:4000/api/v1/client/profile";

  const [formData, setFormData] = useState<ProfileFormData>({
    gender: "",
    addresses: [
      {
        line1: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        isPrimary: false,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle main form field changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccessMessage(null);
  };

  // Handle address field changes
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value, type, checked } = e.target;

    const updatedAddresses: AddressDto[] = [...(formData.addresses || [])];

    // Ensure the index exists
    if (!updatedAddresses[index]) {
      updatedAddresses[index] = {
        line1: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        isPrimary: false,
      };
    }

    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: type === "checkbox" ? checked : value,
    } as AddressDto;

    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
    setError(null);
  };

  // Add new address
  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...(prev.addresses || []),
        {
          line1: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          isPrimary: false,
        },
      ],
    }));
  };

  // Remove address
  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = [...(formData.addresses || [])];
    updatedAddresses.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      addresses:
        updatedAddresses.length > 0
          ? updatedAddresses
          : [
              {
                line1: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
                isPrimary: false,
              },
            ],
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    setError(null);

    if (!formData.gender) {
      setError("Gender is required.");
      return false;
    }

    if (formData.addresses && formData.addresses.length > 0) {
      for (const addr of formData.addresses) {
        if (
          !addr.line1 ||
          !addr.city ||
          !addr.state ||
          !addr.country ||
          !addr.zipCode
        ) {
          setError(
            "Please fill all required address fields (Address Line 1, City, State, Country, Zip Code)."
          );
          return false;
        }
      }
    }

    return true;
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Prepare payload according to backend DTO
    const payload: any = {
      gender: formData.gender as "male" | "female" | "other",
    };

    // Add optional date_of_birth if provided
    if (formData.date_of_birth && formData.date_of_birth.trim() !== "") {
      payload.date_of_birth = formData.date_of_birth;
    }

    // Add optional preferences if provided
    if (formData.preferences && formData.preferences.trim() !== "") {
      payload.preferences = formData.preferences.trim();
    }

    // Add addresses if provided and valid
    if (formData.addresses && formData.addresses.length > 0) {
      const validAddresses = formData.addresses
        .filter(
          (addr) =>
            addr.line1?.trim() &&
            addr.city?.trim() &&
            addr.state?.trim() &&
            addr.country?.trim() &&
            addr.zipCode?.trim()
        )
        .map((addr) => {
          const addressDto: any = {
            line1: addr.line1.trim(), // REQUIRED by backend
            city: addr.city.trim(),
            state: addr.state.trim(),
            country: addr.country.trim(),
            zipCode: addr.zipCode.trim(),
          };

          // Add optional line2 if provided
          if (addr.line2 && addr.line2.trim() !== "") {
            addressDto.line2 = addr.line2.trim();
          }

          // Add optional isPrimary if provided (default to false)
          if (addr.isPrimary !== undefined) {
            addressDto.isPrimary = addr.isPrimary;
          }

          return addressDto;
        });

      if (validAddresses.length > 0) {
        payload.addresses = validAddresses;
      }
    }

    try {
      const response = await axios.post(API_ENDPOINT, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setSuccessMessage(
        response.data?.message || "Profile saved successfully!"
      );

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data as any;

        if (status === 401) {
          setError("You are not authenticated. Please sign in first.");
          setTimeout(() => {
            onClose();
            router.push("/sign-in");
          }, 3000);
          setIsLoading(false);
          return;
        }

        let msg: string = "";

        if (typeof errorData === "string") {
          msg = errorData;
        } else if (errorData?.message) {
          if (typeof errorData.message === "string") {
            msg = errorData.message;
          } else if (Array.isArray(errorData.message)) {
            msg = errorData.message.join(", ");
          } else if (typeof errorData.message === "object") {
            msg = JSON.stringify(errorData.message);
          }
        } else if (errorData?.error) {
          if (typeof errorData.error === "string") {
            msg = errorData.error;
          } else if (
            errorData.error?.message &&
            typeof errorData.error.message === "string"
          ) {
            msg = errorData.error.message;
          } else {
            msg = JSON.stringify(errorData.error);
          }
        } else {
          msg = `Server responded with status ${status}.`;
        }

        setError(msg || `An error occurred (${status})`);
      } else if (error.request) {
        setError(
          "Network Error: Could not reach the server. Please check your connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      gender: "",
      addresses: [
        {
          line1: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          isPrimary: false,
        },
      ],
    });
    setError(null);
    setSuccessMessage(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ display: "block", zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block", zIndex: 1050 }}
        tabIndex={-1}
        aria-labelledby="completeProfileModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          style={{ maxWidth: "800px" }}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="completeProfileModalLabel">
                <i
                  className="fa-solid fa-user-edit me-2"
                  style={{ color: "#daa23e" }}
                ></i>
                Complete Your Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <form onSubmit={handleSubmit} id="profile-form">
                {/* Date of Birth */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Date of Birth <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={formData.date_of_birth || ""}
                    onChange={handleInputChange}
                    style={{
                      borderColor: "#daa23e",
                      borderWidth: "2px",
                    }}
                  />
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: "#daa23e",
                      borderWidth: "2px",
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Preferences */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Preferences <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    name="preferences"
                    rows={3}
                    value={formData.preferences || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your astrology preferences..."
                    style={{
                      borderColor: "#daa23e",
                      borderWidth: "2px",
                    }}
                  />
                </div>

                {/* Addresses Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw-bold mb-0">
                      Address <span className="text-muted">(Optional)</span>
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={handleAddAddress}
                      style={{
                        background:
                          "linear-gradient(45deg, #daa23e, #e0a800)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <i className="fa-solid fa-plus me-1"></i> Add Address
                    </button>
                  </div>

                  {formData.addresses?.map((address, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3"
                      style={{
                        borderColor: "#daa23e",
                        borderWidth: "2px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Address {index + 1}</h6>
                        {formData.addresses &&
                          formData.addresses.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveAddress(index)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                      </div>

                      <div className="row">
                        {/* Address Line 1 (REQUIRED) */}
                        <div className="col-md-12 mb-3">
                          <label className="form-label">
                            Address Line 1{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="line1"
                            value={address.line1}
                            onChange={(e) => handleAddressChange(e, index)}
                            required={index === 0}
                            placeholder="Street address, house no., etc."
                          />
                        </div>

                        {/* Address Line 2 */}
                        <div className="col-md-12 mb-3">
                          <label className="form-label">
                            Address Line 2{" "}
                            <span className="text-muted">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="line2"
                            value={address.line2 || ""}
                            onChange={(e) => handleAddressChange(e, index)}
                            placeholder="Apartment, suite, etc."
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            City <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={address.city}
                            onChange={(e) => handleAddressChange(e, index)}
                            required={index === 0}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            State <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="state"
                            value={address.state}
                            onChange={(e) => handleAddressChange(e, index)}
                            required={index === 0}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Country <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="country"
                            value={address.country}
                            onChange={(e) => handleAddressChange(e, index)}
                            required={index === 0}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Zip Code <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="zipCode"
                            value={address.zipCode}
                            onChange={(e) => handleAddressChange(e, index)}
                            required={index === 0}
                          />
                        </div>

                        <div className="col-md-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="isPrimary"
                              checked={address.isPrimary || false}
                              onChange={(e) => handleAddressChange(e, index)}
                              id={`isPrimary-${index}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`isPrimary-${index}`}
                            >
                              Set as Primary Address
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fa-solid fa-circle-exclamation me-2"></i>
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    <i className="fa-solid fa-check-circle me-2"></i>
                    {successMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                <i className="fa-solid fa-rotate-left me-2"></i>
                Reset
              </button>
              <button
                type="button"
                className="btn"
                onClick={onSkip}
                disabled={isLoading}
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "none",
                }}
              >
                Skip
              </button>
              <button
                type="submit"
                form="profile-form"
                className="btn"
                disabled={isLoading}
                style={{
                  background: "linear-gradient(45deg, #daa23e, #e0a800)",
                  color: "white",
                  border: "none",
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
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
        </div>
      </div>
    </>
  );
};

export default CompleteProfileModal;
