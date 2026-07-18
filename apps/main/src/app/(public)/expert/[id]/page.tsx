import React from "react";
import ExpertDetailsClient from "@/components/features/experts/ExpertDetailsClient";
import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import { api } from "@/lib/api";
import { getErrorMessage } from "@repo/lib";
import ExpertSeoContent from "./expert-seo-content.component";

const normalizeProduct = (raw: any): Product => {
  return {
    id: raw?.id || raw?._id,
    _id: raw?._id,
    name: raw?.product_name || raw?.name || "",
    description: raw?.short_description || raw?.description || "",
    price: Number(raw?.price || 0),
    originalPrice: Number(raw?.original_price || raw?.originalPrice || 0),
    imageUrl: raw?.product_image || raw?.image_url || raw?.imageUrl || "",
    percentageOff: Number(raw?.percentage_off || raw?.percentageOff || 0),
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
    // Fetch expert details + products
    // If it's a dummy expert, mock the expert response to avoid backend UUID validation errors
    let results;
    if (id.startsWith("dummy-")) {
      results = [
        [
          {
            data: {
              id: id,
              userId: "dummy-user",
              user: { name: "Expert " + id.replace('dummy-', ''), avatar: "/images/dummy-expert.jpg" },
              specialization: "Vedic, Numerology",
              experience_in_years: 5,
              languages: ["English", "Hindi"],
              price: 51,
              rating: 5,
              is_available: true,
              bio: "This is a dummy expert profile used for placeholder layouts.",
            }
          }, 
          null
        ],
        await api.get<any>(`/products`, { cache: "no-store" }),
        [[], null]
      ];
    } else {
      results = await Promise.all([
        api.get<any>(`/expert/details/${id}`, { cache: "no-store" }),
        api.get<any>(`/products`, { cache: "no-store" }),
        api.get<any>('/expert/pujas/all', { cache: "no-store" }),
      ]);
    }
    
    const [[data, astroError], [pData, productsError], [pujaData, pujaError]] = results;

    if (astroError) {
      if (astroError.status === 404 || astroError.status === 400) return notFound();
      throw new Error(getErrorMessage(astroError) || "Failed to fetch expert details");
    }

    const expertData = data.data || data;

    // Normalize expert
    const expert = {
      id: expertData.id,
      userId: expertData.userId || expertData.user_id,
      name: expertData.user?.name || "Expert",
      image: expertData.user?.avatar || "/images/dummy-expert.jpg",
      expertise: expertData.specialization || "",
      experience: expertData.experience_in_years || 0,
      language: Array.isArray(expertData.languages)
        ? expertData.languages.join(", ")
        : "Hindi, English",
      price: expertData.price,
      chat_price: expertData.chat_price,
      call_price: expertData.call_price,
      video_call_price: expertData.video_call_price,
      video: expertData.video,
      ratings: expertData.ratings,
      bio: expertData.bio,
      detailed_experience: expertData.detailed_experience,
      gallery: expertData.gallery,
      videos: expertData.videos,
      total_likes: expertData.total_likes,
      is_available: expertData.is_available,
    };

    // Normalize products (empty array if fetch failed)
    let products: Product[] = [];
    if (!productsError && pData) {
      const rawList = Array.isArray(pData) ? pData : (Array.isArray(pData?.data) ? pData.data : []);
      products = rawList.map(normalizeProduct).filter((p: Product) => p.name);
    }

    // Process expert pujas
    let expertPujas: any[] = [];
    if (!pujaError && Array.isArray(pujaData)) {
      expertPujas = pujaData.filter((p: any) => p.expert_id === expert.id);
    }

    return (
      <>
        <ExpertDetailsClient expert={expert} products={products} expertPujas={expertPujas} />
        <ExpertSeoContent expertName={expert.name} />
      </>
    );
  } catch (error) {
    console.error("SSR Detail Page Error:", error);
    return (
      <div className="container py-20 text-center">
        <h2>Something went wrong</h2>
        <p>
          We couldn&apos;t load the expert details. Please try again later.
        </p>
      </div>
    );
  }
}
