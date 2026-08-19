"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

const Featured4Cards = () => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;

  const cards = [
    {
      href: "/our-experts",
      icon: "/images/icon1.png",
      alt: "Live Chat",
      title: t.featuredCards.liveChat.title,
      desc: t.featuredCards.liveChat.desc,
    },
    {
      href: "/our-experts",
      icon: "/images/icon2.png",
      alt: "Speak",
      title: t.featuredCards.speak.title,
      desc: t.featuredCards.speak.desc,
    },
    {
      href: "/buy-products",
      icon: "/images/icon3.png",
      alt: "Store",
      title: t.featuredCards.store.title,
      desc: t.featuredCards.store.desc,
    },
    {
      href: "/online-puja",
      icon: "/images/icon4.png",
      alt: "Pooja",
      title: t.featuredCards.pooja.title,
      desc: t.featuredCards.pooja.desc,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-2 items-stretch">
      {
        cards.map((card) => (
          <Link key={card.href + card.title} href={card.href} className="no-underline block h-full p-[3px] sm:p-[13px]">
            {/* card-hero → bg-[#301118], rounded-[20px], min-h-[250px], border, padding, hover, transition */}
            <div
              className="
              h-full text-center min-h-[160px] sm:min-h-[280px] rounded-[10px] sm:rounded-[20px] px-[10px] pb-[20px] pt-[16px] sm:px-[20px] sm:pb-[40px] sm:pt-[30px]
              bg-[#301118] border border-[#fd9d69]
              flex flex-col items-center justify-start
              transition-all duration-200 ease-in-out
              hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
              cursor-pointer
            "
            >
              {/* card-hero img → width 77px, margin 11px 0 */}
              <Image
                src={card.icon}
                alt={card.alt}
                width={77}
                height={77}
                className="my-[4px] sm:my-[6px] md:my-[11px] w-[40px] sm:w-[50px] md:w-[77px] h-auto"
              />
              {/* card-hero h5 → color #fff, 20px, fw-600 */}
              <h5 className="text-white text-[12px] sm:text-[14px] md:text-[20px] font-semibold mt-2 mb-1 md:mb-2 leading-tight">
                {card.title}
              </h5>
              {/* color-light → text-white, card-hero p → 16px */}
              <p className="text-white/90 text-[10px] sm:text-[12px] md:text-[16px] mb-0 leading-tight md:leading-normal">
                {card.desc}
              </p>
            </div>
          </Link>
        ))
      }
    </div>
  );
};

export default Featured4Cards;
