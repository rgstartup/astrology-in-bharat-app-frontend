import { journey } from "./data";
import IconBubble from "./icon.component";

const OurJourneyComponent = () => {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-[#ffd8c0] bg-white/70 px-5 py-10 shadow-[0_12px_32px_rgba(105,47,16,0.06)]">
        <div className="mb-10 text-center text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
          Our Journey
        </div>
        <div className="relative grid gap-8 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#ffb286] lg:block"></div>
          {journey.map((item) => (
            <div key={item.year} className="relative text-center">
              <IconBubble
                icon={item.icon}
                className="relative z-10 mx-auto mb-4 h-16 w-16 bg-white"
              />
              <div className="text-xs font-extrabold text-[#ff5c00]">
                {item.year}
              </div>
              <div className="mt-2 text-sm font-black text-[#32131b]">
                {item.title}
              </div>
              <p className="mx-auto mt-2 max-w-[190px] text-xs font-medium leading-6 text-[#6f5c58]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurJourneyComponent;
