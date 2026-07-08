"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import HeroComponent from "./hero.component";
import MatchingForm from "./matching-form.component";
import ResultComponent from "./result.component";
import EducationalContent from "./educational-content.component";
import KundaliMatchingSeoContent from "./kundali-matching-seo.component";
import { useLanguageStore } from "@repo/store";
import { matchingTranslations } from "@/lib/translations/calculators/matching";

import { ConsultPersonDetails, AdvancedMatchResults } from "@/lib/types";
import { useAuthStore } from "@repo/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const KundaliMatchingByNamePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { lang } = useLanguageStore();
  const t = (matchingTranslations[lang as keyof typeof matchingTranslations] || matchingTranslations.en).form;

  const [boyDetails, setBoyDetails] = useState<ConsultPersonDetails>({
    name: "",
    date: "",
    time: "",
    lat: "",
    lon: "",
    locationName: "",
  });

  const [girlDetails, setGirlDetails] = useState<ConsultPersonDetails>({
    name: "",
    date: "",
    time: "",
    lat: "",
    lon: "",
    locationName: "",
  });

  const [loading, setLoading] = useState(false);
  const [matchingResult, setMatchingResult] = useState<AdvancedMatchResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const handleInputChange = (
    gender: "boy" | "girl",
    field: keyof ConsultPersonDetails,
    value: string,
  ) => {
    if (gender === "boy") {
      setBoyDetails((prev) => ({ ...prev, [field]: value }));
    } else {
      setGirlDetails((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSwap = () => {
    setBoyDetails((prevBoy) => {
      setGirlDetails(prevBoy);
      return girlDetails;
    });
  };

  const handleLocationSelect = (
    gender: "boy" | "girl",
    location: { name: string; lat: string; lon: string },
  ) => {
    if (gender === "boy") {
      setBoyDetails((prev) => ({
        ...prev,
        locationName: location.name,
        lat: location.lat,
        lon: location.lon,
      }));
    } else {
      setGirlDetails((prev) => ({
        ...prev,
        locationName: location.name,
        lat: location.lat,
        lon: location.lon,
      }));
    }
  };

  const handleMatch = async () => {
    setError(null);
    if (
      !boyDetails.date ||
      !boyDetails.time ||
      !boyDetails.lat ||
      !girlDetails.date ||
      !girlDetails.time ||
      !girlDetails.lat
    ) {
      setError(t.errorFillAll);
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to generate your Kundli matching report", {
        onClick: () => router.push("/sign-in"),
        autoClose: 3000,
        style: { cursor: 'pointer' }
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        boy_dob: `${boyDetails.date}T${boyDetails.time}:00+05:30`,
        boy_lat: boyDetails.lat,
        boy_lon: boyDetails.lon,
        boy_tz: "5.5",
        boy_name: boyDetails.name,
        boy_place: boyDetails.locationName,
        girl_dob: `${girlDetails.date}T${girlDetails.time}:00+05:30`,
        girl_lat: girlDetails.lat,
        girl_lon: girlDetails.lon,
        girl_tz: "5.5",
        girl_name: girlDetails.name,
        girl_place: girlDetails.locationName,
      };

      const [rawData, fetchErr] = await api.post<any>(
        `/astrology/kundli-reports`,
        payload
      );

      if (fetchErr) {
        const errMsg = fetchErr?.message || t.errorFailed;
        setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        return;
      }

      let finalData = rawData?.data ?? rawData;

      if (finalData) {
        setMatchingResult(finalData);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        setError(t.errorIncomplete);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff7ef] text-slate-900">
      <HeroComponent />
      <div className="bg-[#fff7f0] pb-14 pt-4">
        <MatchingForm
          boyDetails={boyDetails}
          girlDetails={girlDetails}
          handleInputChange={handleInputChange}
          handleLocationSelect={handleLocationSelect}
          handleSwap={handleSwap}
          handleMatch={handleMatch}
          loading={loading}
          error={error}
        />

        {matchingResult && (
          <ResultComponent
            resultsRef={resultsRef}
            matchingResult={matchingResult}
            boyDetails={boyDetails}
            girlDetails={girlDetails}
          />
        )}

        <EducationalContent />
      </div>
      
      <KundaliMatchingSeoContent />
    </main>
  );
};

export default KundaliMatchingByNamePage;
