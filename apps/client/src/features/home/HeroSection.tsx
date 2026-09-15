import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Featured4Cards from "@/components/ui/common/Featured4Cards";
import { getTranslations } from "next-intl/server";
import type HomeMessages from "@messages/en/home.json";

const HeroSection = async () => {
  const t = await getTranslations("Home");
  const features = t.raw("hero.features") as typeof HomeMessages.hero.features;

  return (
    <section
      className="py-0 overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/white-background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="py-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
          {/* contant-hero */}
          <div
            className="bg-[#f7f3ec] rounded-[20px] p-5 md:p-6 overflow-visible"
            style={{ border: "solid 1px rgba(242,107,0,0.17)" }}
          >
            {/* row: flex col-reverse on mobile, row on lg */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-6 overflow-visible">
              {/* Left col — col-lg-7 */}
              <div className="w-full lg:w-[58%]">
                {/* hero-card */}
                <div className="flex flex-col justify-center min-h-[400px]">
                  {/* card-z */}
                  <div className="relative z-[9]">
                    {/* aib-trust-badge */}
                    <span className="inline-block px-[14px] py-[6px] bg-[#fde6d3] text-[#c45a13] text-sm font-semibold rounded-[20px] mb-4">
                      {t("hero.trustBadge")}
                    </span>

                    {/* banner-part h1 */}
                    <h1 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[50px] font-bold tracking-[1px] text-[#2b1b1b] leading-tight mb-3 md:mb-4">
                      {t("hero.title")}
                    </h1>

                    {/* card-title */}
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-orange font-semibold mt-3 md:mt-4 mb-2 md:mb-3 leading-snug break-words">
                      {t("hero.subtitle")}
                    </h2>

                    {/* banner-part p */}
                    <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
                      {t("hero.description")}
                    </p>

                    {/* list-check */}
                    <ul className="list-none p-0 m-0 space-y-1">
                      {features.map((point) => (
                        <li
                          key={point}
                          className="flex items-start md:items-center gap-2.5 text-sm md:text-base text-gray-800 py-1 leading-snug"
                        >
                          <i
                            className="fa-solid fa-check text-white text-xs flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 md:mt-0"
                            style={{
                              width: "22px",
                              height: "22px",
                              background: "#ff6e20",
                              border: "2px solid #FF6B00",
                              padding: "2px",
                            }}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/our-experts"
                      className="btn-primary !rounded-full !px-8 !py-3.5 !text-base mt-5 mb-3 shadow-lg shadow-orange-600/20 tracking-wide font-bold inline-block"
                    >
                      {t("hero.startConsultationBtn")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right col — col-lg-5 */}
              <div className="w-full lg:w-[42%] overflow-visible mt-6 lg:mt-0 mb-4 lg:mb-0">
                {/* right-illus */}
                <div className="relative h-[250px] md:h-[300px] lg:h-[400px] overflow-visible">
                  {/* Expert-img-h wrapper — positioned div for width/left, spin on the image */}
                  <div className="absolute w-[90%] left-[5%] lg:left-[10%] -top-[40px] lg:top-[-160px] bottom-0 z-[5]">
                    <Image
                      src="/images/Expert-h.png"
                      alt="Expert background"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="animate-[spin_30s_linear_infinite] object-contain scale-[0.85] lg:scale-100"
                      style={{ transformOrigin: "center center" }}
                      loading="eager"
                    />
                  </div>
                  {/* Expert-img → z-index 6 */}
                  <Image
                    src="/images/Expert.png"
                    alt="Expert"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                    className="object-contain scale-110 lg:scale-[1.4] origin-bottom translate-y-6 -translate-x-4 lg:translate-y-16 lg:-translate-x-2 pointer-events-none z-[6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <Featured4Cards /> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
