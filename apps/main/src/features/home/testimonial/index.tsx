import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import type HomeMessages from "@messages/en/home.json";
import { api } from "@/actions";

import TestimonialCarousel, {
  type TestimonialReview,
} from "./TestimonialCarousel";

function TestimonialSkeleton() {
  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-[18px] bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

async function TestimonialContent() {
  const t = await getTranslations("Home");
  const fallbackReviews = (
    t.raw("testimonials.list") as typeof HomeMessages.testimonials.list
  ).map((review, index): TestimonialReview => ({
    id: `fallback-${index}`,
    user: { name: review.name },
    rating: 5,
    text: review.text,
  }));

  const [reviews, error] = await api.get<TestimonialReview[]>(
    "/reviews/platform/approved?limit=6",
  );
  const displayedReviews =
    !error && Array.isArray(reviews) && reviews.length > 0
      ? reviews
      : fallbackReviews;

  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          <h2 className="text-xl md:text-[32px] font-semibold mb-[35px] relative pb-[15px] text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#a9a9a92b] after:w-full">
            <span className="relative after:content-[''] after:bg-orange after:w-full after:h-[2px] after:absolute after:left-0 after:bottom-[-15px]">
              {t("testimonials.title")}
            </span>
          </h2>
          <div className="py-2">
            <TestimonialCarousel
              reviews={displayedReviews}
              emptyMessage="Be the first to share your experience!"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Testimonial() {
  return (
    <Suspense fallback={<TestimonialSkeleton />}>
      <TestimonialContent />
    </Suspense>
  );
}
