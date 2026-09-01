import { principles } from "./data";

const PrincipleComponent = () => {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {principles.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-[#ffd8c0] bg-white/75 p-8 shadow-[0_10px_26px_rgba(105,47,16,0.04)]"
          >
            <item.icon className="mb-5 h-14 w-14 text-[#ff5c00]" />
            <h3 className="mb-4 text-xl font-black text-[#32131b]">
              {item.title}
            </h3>
            {item.desc ? (
              <p className="text-sm font-medium leading-7 text-[#4f403d]">
                {item.desc}
              </p>
            ) : (
              <ul className="space-y-2 text-sm font-medium text-[#4f403d]">
                {item.list?.map((value) => (
                  <li key={value} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#32131b]"></span>
                    {value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrincipleComponent;
