"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPlaceImages, getPlaceBySlug, Place } from "@/libs/serp-api";
import NextImage from "next/image";
import NextLink from "next/link";

const Image = NextImage as any;
const Link = NextLink as any;

const PlaceDetailPage = () => {
  const { slug } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getPlaceBySlug(slug as string);
    if (!data) {
      // If not found in cache (e.g. direct link), we might need to search for it
      // For now, redirect back if not found to avoid errors
      // router.push("/famous-places");
      setLoading(false);
      return;
    }

    setPlace(data);

    const loadImages = async () => {
      const imgs = await fetchPlaceImages(data.title);
      setImages(imgs);
      setLoading(false);
    };

    loadImages();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-sub-light font-bold animate-pulse">
            Gathering Divine Details...
          </p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-border-light max-w-sm">
          <div className="text-5xl mb-4">📍</div>
          <h2 className="text-xl font-bold text-secondary mb-2">
            Place Not Found
          </h2>
          <p className="text-text-sub-light text-sm mb-6">
            We couldn't find the details for this spiritual site. It might have
            moved or is temporarily unavailable.
          </p>
          <Link
            href="/famous-places"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold"
          >
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    images.length > 0
      ? images[0]
      : place.thumbnailUrl ||
        "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg";

  return (
    <div className="min-h-screen bg-background-dark pb-24">
      {/* Dynamic Header with back-img style */}
      <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={place.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>

        <div className="absolute top-10 left-6 md:left-12 z-20">
          <Link
            href="/famous-places"
            className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-primary transition-all shadow-xl no-underline border border-white/20"
          >
            <span className="text-xl">&larr;</span> Back to Sacred Places
          </Link>
        </div>

        <div className="absolute bottom-40 left-0 right-0 text-center px-4 z-10">
          <span className="aib-trust-badge mb-4 mx-auto inline-block">
            Verified Spiritual Site
          </span>
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-4 drop-shadow-2xl">
            {place.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-star text-accent-gold"></i>
              <span className="font-bold text-white text-lg">
                {place.rating || "4.8"}
              </span>
            </div>
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            <span className="font-medium tracking-wide uppercase text-sm">
              {place.category}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-[#1e0b0f6e] backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-[#fd641054] p-8 md:p-16">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:col-span-2 flex-1 space-y-12">
              <section>
                <h2 className="title-line text-white mb-8">
                  <span>About this Divine Location</span>
                </h2>
                <div className="bg-[#2d1215]/50 p-8 rounded-3xl border border-[#fd641020] flex items-start gap-6">
                  <div className="bg-gradient-to-br from-primary to-primary-hover w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="fa-solid fa-location-dot text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">
                      Location Address
                    </h3>
                    <p className="text-text-sub-dark italic leading-relaxed text-lg">
                      {place.address}
                    </p>
                  </div>
                </div>
              </section>

              {images.length > 1 && (
                <section>
                  <h2 className="title-line text-white mb-8">
                    <span>Divine Gallery</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {images.slice(1, 7).map((img, i) => (
                      <div
                        key={i}
                        className="relative h-44 md:h-56 rounded-2xl overflow-hidden group border border-white/10"
                      >
                        <Image
                          src={img}
                          alt={`${place.title} ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="bg-gradient-to-br from-[#2d1215] to-[#1e0b0f] p-10 rounded-[2rem] border border-[#fd641030] shadow-inner relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <h2 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-3">
                  <i className="fa-solid fa-om text-primary"></i>
                  Spiritual Significance
                </h2>
                <p className="text-text-sub-dark text-lg leading-relaxed mb-8">
                  Experience the profound serenity and divine energy of this
                  sacred site. Known for its historical depth and spiritual
                  vibrations, it offers a unique sanctuary for devotees and
                  seekers alike.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Best time to visit: Early morning (Brahma Muhurta)",
                    "Photography: Allowed in designated areas",
                    "Dress Code: Modest traditional attire recommended",
                    "Offerings: Local flowers and sweets available nearby",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-white/80 font-medium"
                    >
                      <i className="fa-solid fa-circle-check text-primary"></i>
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="w-full lg:w-[350px] shrink-0">
              <div className="sticky top-10 space-y-8">
                <div className="bg-surface-dark rounded-3xl border border-[#fd641040] p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                  <h3 className="font-bold text-white text-xl mb-6 border-b border-white/10 pb-4">
                    Darshan Timings
                  </h3>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-text-sub-dark font-medium">
                        Daily Opening
                      </span>
                      <span className="font-bold text-primary">
                        5:00 AM - 9:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-sub-dark font-medium">
                        Special Aarti
                      </span>
                      <span className="font-bold text-accent-gold">
                        6:30 AM & 7:30 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-sub-dark font-medium">
                        Entry Fee
                      </span>
                      <span className="font-bold text-green-500">
                        Free Darshan
                      </span>
                    </div>
                  </div>

                  <div className="mt-10 p-5 bg-[#1e0b0f] rounded-2xl border border-primary/20 text-center">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-2">
                      Vedic Insight
                    </p>
                    <p className="text-sm text-text-sub-dark italic leading-relaxed">
                      &quot;Visiting during your <strong>Jupiter Hora</strong>{" "}
                      is believed to enhance the spiritual connection.&quot;
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + " " + place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-8 bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold transition-all shadow-lg text-center no-underline flex items-center justify-center gap-3 active:scale-95"
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                    Get Directions
                  </a>
                </div>

                <div className="bg-gradient-to-r from-[#fd6410] to-[#c34500] rounded-3xl p-8 text-center text-white shadow-xl group cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <i className="fa-solid fa-comments text-3xl mb-4 inline-block"></i>
                  <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                  <p className="text-white/80 text-sm mb-6">
                    Talk to our experts for a personalized spiritual
                    consultation.
                  </p>
                  <button className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm w-full">
                    Start Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
