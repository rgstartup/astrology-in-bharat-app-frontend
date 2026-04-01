"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import HeroComponent from "./hero.component";
import MatchingForm from "./matching-form.component";
import ResultComponent from "./result.component";
import EducationalContent from "./educational-content.component";

import { ConsultPersonDetails, AdvancedMatchResults } from "@/lib/types";

const KundaliMatchingByNamePage = () => {
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
      setError("Please fill in all birth details for both individuals.");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({
        boy_dob: `${boyDetails.date}T${boyDetails.time}:00+05:30`,
        boy_lat: boyDetails.lat,
        boy_lon: boyDetails.lon,
        girl_dob: `${girlDetails.date}T${girlDetails.time}:00+05:30`,
        girl_lat: girlDetails.lat,
        girl_lon: girlDetails.lon,
      }).toString();

      const [rawData, fetchErr] = await api.get<any>(
        `/astrology/matching/advanced?${query}`,
      );

      if (fetchErr) {
        const errMsg = fetchErr?.message || "Failed to generate report.";
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
        setError("Received incomplete data from the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <HeroComponent />

      <MatchingForm
        boyDetails={boyDetails}
        girlDetails={girlDetails}
        handleInputChange={handleInputChange}
        handleLocationSelect={handleLocationSelect}
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
  );
};

export default KundaliMatchingByNamePage;
