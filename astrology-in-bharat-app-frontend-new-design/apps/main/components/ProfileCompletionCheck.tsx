"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "../services/apiClient";
import CompleteProfileModal from "./CompleteProfileModal";

interface ProfileData {
    full_name: string;
    gender: "male" | "female" | "other" | "";
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
    phone?: string;
    language_preference?: string;
    preferences?: string; // Additional notes/preferences
    [key: string]: any;
}

const ProfileCompletionCheck: React.FC = () => {
    const { accessToken, user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkProfile = async () => {
            if (!accessToken) return;

            try {
                // Fetch profile
                const { data } = await apiClient.get<ProfileData>("/client/profile");

                const profile = data || {};

                // Check missing fields (Critical fields only)
                const isProfileIncomplete =
                    (!profile.full_name && !user?.name) ||
                    !profile.gender ||
                    !profile.date_of_birth ||
                    !profile.time_of_birth ||
                    !profile.place_of_birth;

                if (isProfileIncomplete) {
                    timeoutId = setTimeout(() => {
                        setProfileData({
                            full_name: profile.full_name || user?.name || "",
                            gender: profile.gender || "",
                            date_of_birth: profile.date_of_birth || "",
                            time_of_birth: profile.time_of_birth || "",
                            place_of_birth: profile.place_of_birth || "",
                            phone: profile.phone || "",
                            language_preference: profile.language_preference || "",
                            preferences: profile.preferences || "",
                        });
                        setIsModalOpen(true);
                    }, 10000); // 10 seconds delay as requested
                }
            } catch (err: any) {
                console.error("Failed to fetch profile for check:", err);
                // If 404 (profile doesn't exist at all), then it is definitely empty
                if (err.response?.status === 404) {
                    timeoutId = setTimeout(() => {
                        setIsModalOpen(true);
                    }, 10000);
                }
            } finally {
                setHasChecked(true);
            }
        };

        if (accessToken && !hasChecked) {
            checkProfile();
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [accessToken, hasChecked, user]);

    return (
        <CompleteProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSkip={() => setIsModalOpen(false)}
            initialData={profileData}
        />
    );
};

export default ProfileCompletionCheck;
