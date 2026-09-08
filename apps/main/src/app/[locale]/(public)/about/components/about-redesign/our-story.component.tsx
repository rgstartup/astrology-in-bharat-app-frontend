import { storyHighlights } from "./data";
import IconBubble from "./icon.component";
import Image from "next/image";

const OurStoryComponent = () => {
  return (
    <section className="mx-auto grid max-w-[1180px] items-start gap-12 px-4 py-8 sm:px-6 lg:grid-cols-[0.82fr_1fr] lg:px-8">
      <div className="overflow-hidden rounded-[24px] border border-[#ffc9aa] bg-white shadow-[0_14px_34px_rgba(105,47,16,0.09)]">
        <Image
          src="/images/about-story-banner.png"
          alt="Our astrology story"
          width={1200}
          height={720}
          className="w-full h-auto max-h-[390px] object-contain bg-[#3a130a]"
        />
      </div>

      <div className="pt-2">
        <h2 className="mb-5 font-serif text-4xl font-bold text-[#32131b]">
          Our Story
        </h2>
        <div className="space-y-5 text-sm font-medium leading-7 text-[#6f5c58]">
          <p>
            Astrology In Bharat was founded with a simple yet powerful vision -
            to make authentic Vedic astrology accessible to everyone.
          </p>
          <p>
            Our team of learned astrologers brings decades of wisdom in Vedic
            scriptures, combined with deep understanding of planetary
            influences, to offer solutions that are practical and easy to
            follow.
          </p>
          <p>
            With thousands of satisfied users, we continue to be a trusted
            companion in your journey towards happiness, prosperity and success.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {storyHighlights.map((item) => (
            <div key={item.label} className="text-center">
              <IconBubble
                icon={item.icon}
                className="mx-auto h-12 w-12 rounded-xl"
              />
              <div className="mt-3 text-xs font-extrabold text-[#32131b]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStoryComponent;
