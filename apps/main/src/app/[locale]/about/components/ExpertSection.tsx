import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const ExpertSection = async () => {
  const t = await getTranslations("About");

  const team = [
    {
      name: "Pandit Rajesh Sharma",
      role: "Head of Vedic Astrology",
      exp: "22 Years Experience",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      specialty: "Kundli, Marriage, Career",
    },
    {
      name: "Jyotishi Sunita Devi",
      role: "Numerology & Tarot Expert",
      exp: "15 Years Experience",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      specialty: "Tarot, Numerology, Vastu",
    },
    {
      name: "Acharya Vinod Kumar",
      role: "KP & Lal Kitab Specialist",
      exp: "18 Years Experience",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      specialty: "KP System, Lal Kitab",
    },
    {
      name: "Pandit Meera Joshi",
      role: "Nakshatra & Gemstone Expert",
      exp: "12 Years Experience",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      specialty: "Gemstones, Nakshatra, Puja",
    },
  ];

  return (
    <section className="py-24 bg-[#FFF9F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-orange block animate-in fade-in slide-in-from-top-4 duration-700">
            {t("expertTag")}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t("expertTitle")}
          </h2>
          <p className="text-slate-500 text-lg font-medium italic mx-auto max-w-xl animate-in fade-in duration-1000">
            &quot;{t("expertDesc")}&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="group animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="bg-white rounded-[3rem] p-8 text-center border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full active:scale-95">
                {/* Avatar with Status */}
                <div className="relative inline-block mx-auto mb-6 transform group-hover:rotate-3 transition-transform duration-500">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-100 p-1 bg-white relative overflow-hidden shadow-lg group-hover:border-orange/20 transition-all">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <i className="fa-solid fa-check text-white text-[8px]" />
                  </div>
                </div>

                {/* Expert Info */}
                <div className="space-y-2 mb-6 grow">
                  <h6 className="text-lg font-black text-slate-900 group-hover:text-orange transition-colors">
                    {member.name}
                  </h6>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange bg-orange/5 py-1 px-3 rounded-full inline-block">
                    {member.role}
                  </p>
                  <p className="text-slate-400 text-xs font-bold italic py-2">
                    {member.exp}
                  </p>
                </div>

                {/* Specialties Container */}
                <div className="pt-4 border-t border-slate-50">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">
                    Specialization
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specialty.split(", ").map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-orange/10 group-hover:text-orange-600 transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link
            href="/our-experts"
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-orange-500/30 hover:bg-orange transition-all duration-500 no-underline"
          >
            <span className="relative z-10 flex items-center gap-3 group-hover:text-orange transition-colors">
              {t("expertBtn")}
              <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
