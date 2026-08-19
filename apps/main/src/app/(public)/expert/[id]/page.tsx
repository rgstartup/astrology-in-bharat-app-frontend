import React, { Suspense } from "react";
import ExpertDetailsClient from "@/components/features/experts/ExpertDetailsClient";
import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import { api } from "@/lib/api";
import { getErrorMessage } from "@repo/lib";
import ExpertSeoContent from "./expert-seo-content.component";
import ProductSection from "@/components/features/shop/ProductSection";
import { PujaCard } from "@/components/features/puja/PujaCard";
import { Loading } from "@repo/ui";

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

async function AsyncPujas({ expertId, expertName }: { expertId: string; expertName: string }) {
  try {
    const pujaData = await api.get<any>('/expert/pujas/all', { cache: "no-store" });
    if (!Array.isArray(pujaData)) return null;
    const expertPujas = pujaData.filter((p: any) => p.expert_id === expertId);
    if (expertPujas.length === 0) return null;
    return (
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Pujas by {expertName}</h2>
            <p className="text-gray-500 font-medium">Book a personalized puja with this expert astrologer.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertPujas.map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

async function AsyncProducts() {
  try {
    const pData = await api.get<any>(`/products`, { cache: "no-store" });
    if (!pData) return null;
    const rawList = Array.isArray(pData) ? pData : (Array.isArray(pData?.data) ? pData.data : []);
    const products = rawList.map(normalizeProduct).filter((p: Product) => p.name);
    if (products.length === 0) return null;
    return (
      <section className="py-12 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
          <ProductSection products={products} />
        </div>
      </section>
    );
  } catch {
    return null;
  }
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
    // 1. Fetch ONLY expert details initially to unblock page load
    let data: any, astroError: any;
    
    if (id.startsWith("dummy-")) {
      data = {
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
      };
      astroError = null;
    } else {
      const result = await api.get<any>(`/expert/details/${id}`, { cache: "no-store" });
      data = result[0];
      astroError = result[1];
    }

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
      about: expertData.about,
      detailed_experience: expertData.detailed_experience,
      gallery: expertData.gallery,
      videos: expertData.videos,
      total_likes: expertData.total_likes,
      is_available: expertData.is_available,
    };

    return (
      <>
        {/* Render primary expert info immediately */}
        <ExpertDetailsClient expert={expert} />
        
        {/* Background-load heavy resources */}
        <Suspense fallback={<div className="py-20 flex justify-center"><Loading size="md" text="Loading Pujas..." /></div>}>
          {id.startsWith("dummy-") ? null : <AsyncPujas expertId={expert.id} expertName={expert.name} />}
        </Suspense>

        <Suspense fallback={<div className="py-20 flex justify-center"><Loading size="md" text="Loading Products..." /></div>}>
          {id.startsWith("dummy-") ? null : <AsyncProducts />}
        </Suspense>
        
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
