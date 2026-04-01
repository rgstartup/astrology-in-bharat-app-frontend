import React from "react";
import AstrologerDetailsClient from "@/components/features/astrologers/AstrologerDetailsClient";
import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import { api } from "@/lib/api";

const normalizeProduct = (raw: any): Product => {
  const images = Array.isArray(raw?.images) ? raw.images : [];
  const firstImage = images[0];
  const firstImageUrl =
    typeof firstImage === "string"
      ? firstImage
      : firstImage?.secure_url || firstImage?.url || firstImage?.image || "";

  return {
    id: raw?.id ?? raw?._id,
    _id: raw?._id,
    name: raw?.name || "",
    description: raw?.description || "",
    price: Number(raw?.price ?? raw?.sale_price ?? 0),
    originalPrice: Number(raw?.originalPrice ?? raw?.original_price ?? raw?.price ?? 0),
    imageUrl: raw?.secure_url || raw?.imageUrl || raw?.image_url || raw?.image || firstImageUrl || "",
    percentageOff: Number(raw?.percentageOff ?? raw?.percentage_off ?? 0),
  };
};

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
    // Fetch astrologer details + products in parallel using the centralized api client
    const [
      [data, astroError],
      [pData, productsError]
    ] = await Promise.all([
      api.get<any>(`/expert/details/${id}`, { cache: "no-store" }),
      api.get<any>(`/products`, { cache: "no-store" }),
    ]);

    if (astroError) {
      if (astroError.status === 404) return notFound();
      throw new Error(astroError.message || "Failed to fetch astrologer details");
    }

    const astrologerData = data.data || data;

    // Normalize astrologer
    const astrologer = {
      id: astrologerData.id,
      name: astrologerData.user?.name || astrologerData.name || "Astrologer",
      image: astrologerData.user?.avatar || astrologerData.avatar || astrologerData.image || "/images/dummy-astrologer.jpg",
      expertise: astrologerData.specialization || astrologerData.expertise || "",
      experience: astrologerData.experience_in_years !== undefined ? astrologerData.experience_in_years : (astrologerData.experience || 0),
      language: Array.isArray(astrologerData.languages)
        ? astrologerData.languages.join(", ")
        : astrologerData.user?.language || astrologerData.language || "Hindi, English",
      price: astrologerData.price || 0,
      video: astrologerData.video || "https://www.youtube.com/embed/INoPh_oRooU",
      ratings: astrologerData.rating !== undefined ? Math.round(astrologerData.rating) : (astrologerData.ratings ? Math.round(astrologerData.ratings) : 5),
      bio: astrologerData.bio || "",
      detailed_experience: astrologerData.detailed_experience || astrologerData.detailedExperience || [],
      gallery: astrologerData.gallery || [],
      videos: astrologerData.videos || [],
      total_likes: astrologerData.total_likes || astrologerData.totalLikes || 0,
      is_available: astrologerData.isAvailable ?? astrologerData.is_available ?? false,
    };

    // Normalize products (empty array if fetch failed)
    let products: Product[] = [];
    if (!productsError && pData) {
      const rawList = Array.isArray(pData) ? pData : (Array.isArray(pData?.data) ? pData.data : []);
      products = rawList.map(normalizeProduct).filter((p: Product) => p.name);
    }

    return <AstrologerDetailsClient astrologer={astrologer} products={products} />;
  } catch (error) {
    console.error("SSR Detail Page Error:", error);
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
