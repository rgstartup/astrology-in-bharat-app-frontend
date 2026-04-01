"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";

import HeroSection from "./hero.component";
import InputForm from "./input-form.component";
import ResultsSection from "./results.component";
import EducationalContent from "./educational-content.component";

const MangalDoshaPage = () => {
  const [details, setDetails] = useState({
    name: "",
    gender: "male",
    date: "",
    time: "",
    lat: "",
    lon: "",
    locationName: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: {
    name: string;
    lat: string;
    lon: string;
  }) => {
    setDetails((prev) => ({
      ...prev,
      locationName: location.name,
      lat: location.lat,
      lon: location.lon,
    }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (
      !details.date ||
      !details.time ||
      !details.lat ||
      !details.lon ||
      !details.name
    ) {
      setError("Please fill in all details including birth location.");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({
        datetime: `${details.date}T${details.time}:00+05:30`,
        lat: details.lat,
        lon: details.lon,
      }).toString();

      const [rawData, fetchErr] = await api.get<any>(
        `/astrology/mangal-dosha?${query}`,
      );

      if (fetchErr || !rawData) {
        setError(
          fetchErr?.message || "Failed to generate report. Please try again.",
        );
        return;
      }

      let data = rawData?.data ?? rawData;
      const finalData = data?.mangal_dosha || data;

      if (
        finalData &&
        (finalData.description || finalData.has_dosha !== undefined)
      ) {
        setResult(finalData);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        setError("The API returned data in an unexpected format.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <HeroSection />

      <InputForm
        details={details}
        handleInputChange={handleInputChange}
        handleLocationSelect={handleLocationSelect}
        handleAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      {result && <ResultsSection resultsRef={resultsRef} result={result} />}

      <EducationalContent />
    </div>
  );
};

export default MangalDoshaPage;
