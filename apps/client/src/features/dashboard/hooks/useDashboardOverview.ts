"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  fetchClientProfile,
  fetchBirthAstrologyDetails,
  fetchActiveClientConsultation,
} from "../api/dashboard.api";

export interface BirthAstrologyDetails {
  sunSign?: string;
  moonSign?: string;
  ascendant?: string;
  nakshatra?: string;
  nakshatraLord?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  raw?: any;
}

export function useDashboardOverview() {
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();

  const [profileData, setProfileData] = useState<any>(null);
  const [astrologyDetails, setAstrologyDetails] = useState<
    BirthAstrologyDetails | undefined
  >(undefined);
  const [isLoadingAstrology, setIsLoadingAstrology] = useState<boolean>(false);
  const [activeConsultation, setActiveConsultation] = useState<any>(null);
  const [isLoadingConsultation, setIsLoadingConsultation] =
    useState<boolean>(false);

  const activeUser = profileData || user;

  // Has complete birth details?
  const hasBirthDetails = Boolean(
    activeUser?.date_of_birth &&
      activeUser?.time_of_birth &&
      (activeUser?.place_of_birth || (activeUser as any)?.birth_place)
  );

  // 1. Fetch Profile using safeFetch
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const loadProfile = async () => {
      const [data, err] = await fetchClientProfile();
      if (!err && data && isMounted) {
        setProfileData(data);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // 2. Fetch Astrology Birth Details using safeFetch
  useEffect(() => {
    if (!isAuthenticated || !hasBirthDetails || !activeUser) {
      setAstrologyDetails(undefined);
      return;
    }

    let isMounted = true;
    const loadAstrologyDetails = async () => {
      setIsLoadingAstrology(true);

      const u = activeUser;
      const dob = u.date_of_birth?.includes("T")
        ? u.date_of_birth.split("T")[0]
        : u.date_of_birth;
      const tob = u.time_of_birth || "12:00";
      const datetime = `${dob}T${tob}:00+05:30`;

      const lat = (u as any)?.latitude || "28.6139";
      const lon = (u as any)?.longitude || "77.2090";

      const [res, err] = await fetchBirthAstrologyDetails({
        datetime,
        lat,
        lon,
      });

      if (!isMounted) return;

      if (err || !res) {
        setAstrologyDetails({
          birthDate: u.date_of_birth,
          birthTime: u.time_of_birth,
          birthPlace: u.place_of_birth,
        });
      } else {
        const d = res?.data || res;
        setAstrologyDetails({
          sunSign: d?.soorya_rasi?.name || d?.sun_sign || "Aries",
          moonSign: d?.chandra_rasi?.name || d?.moon_sign || "Taurus",
          ascendant: d?.ascendant?.name || d?.lagna || "Gemini",
          nakshatra: d?.nakshatra?.name || "Rohini",
          nakshatraLord: d?.nakshatra?.lord?.name,
          birthDate: u.date_of_birth,
          birthTime: u.time_of_birth,
          birthPlace: u.place_of_birth,
          raw: d,
        });
      }
      setIsLoadingAstrology(false);
    };

    loadAstrologyDetails();
    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    hasBirthDetails,
    activeUser?.date_of_birth,
    activeUser?.time_of_birth,
    activeUser?.place_of_birth,
  ]);

  // 3. Fetch Active Consultation Session using safeFetch
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const checkActiveConsultation = async () => {
      setIsLoadingConsultation(true);
      const [res, err] = await fetchActiveClientConsultation();
      if (!isMounted) return;

      if (err || !res) {
        setActiveConsultation(null);
      } else {
        const session = res?.data ?? res;
        if (
          session &&
          (session.status === "active" || session.status === "pending")
        ) {
          setActiveConsultation(session);
        } else {
          setActiveConsultation(null);
        }
      }
      setIsLoadingConsultation(false);
    };

    checkActiveConsultation();
    const interval = setInterval(checkActiveConsultation, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return {
    user: activeUser,
    isAuthenticated,
    authLoading,
    hasBirthDetails,
    astrologyDetails,
    isLoadingAstrology,
    activeConsultation,
    isLoadingConsultation,
  };
}
