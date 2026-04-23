"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import {
    getClientProfile,
    createClientProfile,
    updateClientProfile,
    uploadClientDocument,
    ClientProfileData,
    AddressDto,
} from "@/libs/api-profile";

// Types
export type ProfileData = ClientProfileData;

export const normalizeAddressesForUI = (addresses?: any[]) => {
    if (!Array.isArray(addresses)) return addresses;
    return addresses.map((addr: any) => ({
        ...addr,
        zip_code: addr?.zip_code ?? addr?.zipCode ?? "",
    }));
};

export const useProfileBaseLogic = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        clientUser,
        isClientAuthenticated,
        isLoggingOut,
        clientLoading,
        clientBalance,
        refreshBalance,
        refreshAuth,
        updateClientUser,
    } = useAuthStore();

    const [profileData, setProfileData] = useState<ProfileData>({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const [editingSections, setEditingSections] = useState({
        personal: false,
        address: false,
        astro: false,
        settings: false,
    });
    const [savingSections, setSavingSections] = useState({
        personal: false,
        address: false,
        astro: false,
        settings: false,
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("/images/aa.webp");

    // Auth Redirection
    useEffect(() => {
        if (!clientLoading && !isClientAuthenticated && !isLoggingOut) {
            router.push("/sign-in?callbackUrl=/profile");
        }
    }, [clientLoading, isClientAuthenticated, isLoggingOut, router]);

    // Tab Initialization
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        } else {
            const savedTab = localStorage.getItem("profileActiveTab");
            if (savedTab) {
                setActiveTab(savedTab);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        localStorage.setItem("profileActiveTab", activeTab);
    }, [activeTab]);

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const [data, profileErr] = await getClientProfile();
            if (data) {
                setProfileData({
                    ...data,
                    full_name: (data as any).full_name || (data as any).user?.name || "",
                    addresses: normalizeAddressesForUI((data as any).addresses),
                });
                if ((data as any).profile_picture) {
                    setImagePreview((data as any).profile_picture);
                }
            }
        } catch (error: any) {
            console.error("❌ Error loading profile:", error);
            if (error.response?.status !== 404) {
                toast.error("Failed to load profile data");
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

    const handleImageChange = async (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        try {
            setSavingSections((prev) => ({ ...prev, personal: true }));
            const [uploadResult, uploadErr] = await uploadClientDocument(file);

            if (uploadResult && (uploadResult as any).url) {
                const imageUrl = (uploadResult as any).url;
                setProfileData((prev) => ({ ...prev, profile_picture: imageUrl }));
                setImagePreview(imageUrl);
                updateClientUser({ avatar: imageUrl, profile_picture: imageUrl });

                try {
                    await updateClientProfile({ profile_picture: imageUrl });
                } catch (err: any) {
                    const status = err?.status ?? err?.response?.status;
                    if (status === 404) {
                        await createClientProfile({ profile_picture: imageUrl });
                    } else {
                        throw err;
                    }
                }
                await refreshAuth();
                setSuccessMessage("Profile picture updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setErrorMessage("Upload succeeded but no URL returned");
            }
        } catch (error: any) {
            const errorDetail =
                error.response?.data?.message || error.message || "Unknown error";
            setErrorMessage(`Failed to upload profile picture: ${errorDetail}`);
            setTimeout(() => setErrorMessage(""), 8000);
        } finally {
            setSavingSections((prev) => ({ ...prev, personal: false }));
        }
    };

    const handleInputChange = (key: keyof ProfileData, value: any) => {
        setProfileData((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddressChange = (
        index: number,
        key: keyof AddressDto,
        value: string,
    ) => {
        setProfileData((prev) => {
            const addresses = [...(prev.addresses || [])];
            if (!addresses[index]) {
                addresses[index] = {
                    line1: "",
                    city: "",
                    state: "",
                    country: "",
                    zip_code: "",
                };
            }
            addresses[index] = { ...addresses[index], [key]: value };
            return { ...prev, addresses };
        });
    };

    const handleSaveSection = async (
        section: keyof typeof editingSections,
    ) => {
        setSavingSections((prev) => ({ ...prev, [section]: true }));
        setSuccessMessage("");
        setErrorMessage("");

        try {
            let sectionFields: string[] = [];
            switch (section) {
                case "personal":
                    sectionFields = [
                        "full_name",
                        "username",
                        "phone",
                        "gender",
                        "marital_status",
                        "occupation",
                        "about_me",
                    ];
                    break;
                case "address":
                    sectionFields = ["addresses"];
                    break;
                case "astro":
                    sectionFields = [
                        "date_of_birth",
                        "time_of_birth",
                        "place_of_birth",
                    ];
                    break;
                case "settings":
                    sectionFields = ["language_preference"];
                    break;
            }

            const payload: any = {};
            sectionFields.forEach((field) => {
                if (profileData[field as keyof ProfileData] !== undefined) {
                    payload[field] = profileData[field as keyof ProfileData];
                }
            });

            Object.keys(payload).forEach((key) => {
                if (typeof payload[key] === "string") {
                    payload[key] = payload[key].trim();
                    if (payload[key] === "") {
                        delete payload[key];
                    }
                }
            });

            if (
                section === "personal" &&
                (!payload.gender || payload.gender.trim() === "")
            ) {
                payload.gender = "other";
            }

            if (
                section === "address" &&
                payload.addresses &&
                Array.isArray(payload.addresses)
            ) {
                payload.addresses = payload.addresses.map((addr: any) => {
                    const cleanAddr: any = { line1: addr.line1 };
                    if (addr.id !== undefined) cleanAddr.id = addr.id;
                    if (addr.line2 !== undefined && addr.line2 !== "")
                        cleanAddr.line2 = addr.line2;
                    if (addr.house_no !== undefined && addr.house_no !== "")
                        cleanAddr.house_no = addr.house_no;
                    if (addr.city !== undefined && addr.city !== "")
                        cleanAddr.city = addr.city;
                    if (addr.district !== undefined && addr.district !== "")
                        cleanAddr.district = addr.district;
                    if (addr.state !== undefined && addr.state !== "")
                        cleanAddr.state = addr.state;
                    if (addr.country !== undefined && addr.country !== "")
                        cleanAddr.country = addr.country;
                    const zipVal = addr.zip_code ?? addr.zipCode;
                    if (zipVal !== undefined && zipVal !== "")
                        cleanAddr.zip_code = zipVal;
                    if (addr.pincode !== undefined && addr.pincode !== "")
                        cleanAddr.pincode = addr.pincode;
                    const primaryVal = addr.is_primary ?? addr.isPrimary;
                    if (primaryVal !== undefined) cleanAddr.is_primary = primaryVal;
                    if (addr.tag !== undefined) cleanAddr.tag = addr.tag;
                    return cleanAddr;
                });
            }

            let savedData: any;
            try {
                const [updateRes, updateErr] = await updateClientProfile(payload);
                if (updateErr) throw updateErr;
                savedData = updateRes;
            } catch (err: any) {
                const status = err?.status ?? err?.response?.status;
                if (status === 404) {
                    const [createRes, createErr] = await createClientProfile(payload);
                    if (createErr) throw createErr;
                    savedData = createRes;
                } else {
                    throw err;
                }
            }
            toast.success(
                `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`,
            );

            if (savedData) {
                setProfileData((prev) => ({
                    ...prev,
                    ...savedData,
                    addresses: normalizeAddressesForUI((savedData as any).addresses),
                }));
            }
            await refreshAuth();
            setEditingSections((prev) => ({ ...prev, [section]: false }));
        } catch (error: any) {
            console.error(`❌ Error updating ${section}:`, error);
            const errMsg =
                error.response?.data?.message || error.message || "Unknown error";
            toast.error(`Failed to update ${section}: ${errMsg}`);
        } finally {
            setSavingSections((prev) => ({ ...prev, [section]: false }));
        }
    };

    return {
        clientUser,
        isClientAuthenticated,
        clientLoading,
        clientBalance,
        refreshBalance,
        refreshAuth,
        updateClientUser,
        profileData,
        loading,
        activeTab,
        setActiveTab,
        editingSections,
        setEditingSections,
        savingSections,
        setSavingSections,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        imagePreview,
        setImagePreview,
        loadProfile,
        handleImageChange,
        handleInputChange,
        handleAddressChange,
        handleSaveSection,
    };
};
