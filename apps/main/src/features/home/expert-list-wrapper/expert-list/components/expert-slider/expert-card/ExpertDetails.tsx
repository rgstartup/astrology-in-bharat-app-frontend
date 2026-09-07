interface ExpertDetailsProps {
  name: string;
  services: string[];
  experience: number;
  languages: string;
  labels: {
    experience: string;
    years: string;
    languages: string;
  };
}

export default function ExpertDetails({
  name,
  services,
  experience,
  languages,
  labels,
}: ExpertDetailsProps) {
  const visibleServices = services.slice(0, 3);
  const remainingServices = services.length - visibleServices.length;

  return (
    <>
      <div
        className="truncate px-4 pt-2 pb-1 text-center text-[18px] font-semibold text-[#301118]"
        title={name}
      >
        {name}
      </div>
      <div className="mt-1 mb-1 flex min-h-7 flex-wrap items-center justify-center gap-1 px-3">
        {visibleServices.map((service) => (
          <span
            key={service}
            title={service}
            className="inline-block max-w-full truncate rounded-full bg-orange px-2 py-0.5 text-center text-[10px] font-semibold text-white"
          >
            {service}
          </span>
        ))}
        {remainingServices > 0 && (
          <span className="inline-block rounded-full bg-orange/20 px-2 py-0.5 text-[11px] font-semibold text-orange">
            +{remainingServices}
          </span>
        )}
      </div>
      <div className="my-2 flex items-center justify-center gap-1.5 px-2 text-[14px] text-[#1a1a1a]">
        <strong>{labels.experience}</strong>
        <span className="shrink-0 rounded bg-orange/10 px-2 py-0.5 text-[12px] font-semibold text-orange">
          {experience} {labels.years}
        </span>
      </div>
      <div className="my-1.5 flex w-full items-center justify-center gap-1.5 px-2 text-[14px] text-[#1a1a1a]">
        <strong>{labels.languages}</strong>
        <span
          className="inline-block max-w-[130px] truncate rounded bg-gray-100 px-2 py-0.5 text-[12px] font-semibold"
          title={languages}
        >
          {languages}
        </span>
      </div>
    </>
  );
}
