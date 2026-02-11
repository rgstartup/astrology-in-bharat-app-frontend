import React from "react";
import AstrologerDetailsClient from "@/components/features/astrologers/AstrologerDetailsClient";
import { notFound } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6543/api/v1";

interface ExpertData {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  specialization: string;
  experience_in_years: number;
  languages: string[];
  price: number;
  rating: number;
  video?: string;
  bio?: string;
  detailed_experience?: any[];
  gallery?: string[];
  videos?: string[];
  total_likes?: number; // ADDED
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  try {
    const url = `${API_BASE_URL}/expert/${id}`;
    const response = await fetch(url, {
      cache: 'no-store', // Disable caching for real-time updates
    });

    if (!response.ok) {
      if (response.status === 404) return notFound();
      throw new Error("Failed to fetch astrologer details");
    }

    const data: ExpertData = await response.json();
    console.log("DEBUG: Fetched detailed_experience:", JSON.stringify(data.detailed_experience, null, 2));

    const astrologer = {
      id: data.id,
      name: data.user.name || "Astrologer",
      image: data.user.avatar || "/images/dummy-astrologer.jpg",
      expertise: data.specialization || "Vedic Astrology",
      experience: data.experience_in_years || 0,
      language:
        data.languages.length > 0
          ? data.languages.join(", ")
          : "Hindi, English",
      price: data.price || 0,
      video: data.video || "https://www.youtube.com/embed/INoPh_oRooU",
      ratings: Math.round(data.rating) || 5,
      bio: data.bio || "",
      detailed_experience: data.detailed_experience || [],
      gallery: data.gallery || [],
      videos: data.videos || [],
      total_likes: data.total_likes || 0, // ADDED
    };

    return <AstrologerDetailsClient astrologer={astrologer} />;
  } catch (error) {
    console.error("SSR Detail Page Error:", error);
    // Fallback or better error UI
    return (
      <div className="container py-20 text-center">
        <h2>Something went wrong</h2>
        <p>
          We couldn&apos;t load the astrologer details. Please try again later.
        </p>
      </div>
    );
  }
}
