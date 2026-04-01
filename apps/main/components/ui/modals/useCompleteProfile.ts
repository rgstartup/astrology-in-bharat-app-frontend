"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export interface AddressDto {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  is_primary?: boolean;
}

export interface ProfileFormData {
  date_of_birth?: string;
  gender: "male" | "female" | "other" | "";
  preferences?: string;
  addresses?: AddressDto[];
}

export const useCompleteProfile = (onClose: () => void) => {
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileFormData>({
    gender: "",
    addresses: [
      {
        line1: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        is_primary: false,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value, type, checked } = e.target;
    const updatedAddresses: AddressDto[] = [...(formData.addresses || [])];

    if (!updatedAddresses[index]) {
      updatedAddresses[index] = {
        line1: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        is_primary: false,
      };
    }

    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: type === "checkbox" ? checked : value,
    } as AddressDto;

    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
    setError(null);
  };

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
          zip_code: "",
          is_primary: false,
        },
      ],
    }));
  };

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
              zip_code: "",
              is_primary: false,
            },
          ],
    }));
  };

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
          !addr.zip_code
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const payload: any = { gender: formData.gender };
    if (formData.date_of_birth?.trim()) payload.date_of_birth = formData.date_of_birth;
    if (formData.preferences?.trim()) payload.preferences = formData.preferences.trim();

    if (formData.addresses) {
      const validAddresses = formData.addresses
        .filter((addr) =>
          addr.line1?.trim() && addr.city?.trim() && addr.state?.trim() &&
          addr.country?.trim() && addr.zip_code?.trim()
        )
        .map((addr) => ({
          line1: addr.line1.trim(),
          city: addr.city.trim(),
          state: addr.state.trim(),
          country: addr.country.trim(),
          zip_code: addr.zip_code.trim(),
          line2: addr.line2?.trim() || undefined,
          is_primary: addr.is_primary || false
        }));
      if (validAddresses.length > 0) payload.addresses = validAddresses;
    }

    try {
      const [data, fetchErr] = await api.post<any>(`/client/profile`, payload);

      if (fetchErr) {
        if (fetchErr.status === 401) {
          setError("You are not authenticated. Please sign in first.");
          setTimeout(() => { onClose(); router.push("/sign-in"); }, 3000);
        } else {
          setError(fetchErr.message || `An error occurred (${fetchErr.status})`);
        }
      } else {
        setSuccessMessage(data?.message || "Profile saved successfully!");
        setTimeout(() => { onClose(); }, 1500);
      }
    } catch {
      setError("Network Error: Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      gender: "",
      addresses: [{
        line1: "", city: "", state: "", country: "", zip_code: "", is_primary: false,
      }],
    });
    setError(null);
    setSuccessMessage(null);
  };

  return {
    formData,
    isLoading,
    error,
    successMessage,
    handleInputChange,
    handleAddressChange,
    handleAddAddress,
    handleRemoveAddress,
    handleSubmit,
    handleReset,
  };
};
