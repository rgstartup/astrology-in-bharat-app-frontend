import {
  FaArrowRight,
  FaCalendarAlt,
  FaChartBar,
  FaCheck,
  FaDice,
  FaGem,
  FaPalette,
  FaTimes,
} from "react-icons/fa";

type Options = {
  icon: React.JSX.Element;
  label: string;
  val: string;
};

const menuOptions: Options[] = [
  {
    icon: <FaPalette />,
    label: "Lucky Color",
    val: "Golden & Red",
  },
  {
    icon: <FaDice />,
    label: "Lucky No.",
    val: "1, 5, 9",
  },
  {
    icon: <FaGem />,
    label: "Stone",
    val: "Ruby / Amber",
  },
  {
    icon: <FaCalendarAlt />,
    label: "Lucky Day",
    val: "Sunday",
  },
];

export const SidebarStats = () => {
  return (
    <div className="lg:col-span-4 self-start sticky top-[180px]">
      <div className="space-y-8">
        {/* Attributes Card */}
        <div className="bg-gray-950 text-white p-10 rounded-[2.5rem] border border-gray-900 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-colors"></div>
          
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-4 text-white/50">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
            Key Attributes
          </h3>
          
          <div className="space-y-4">
            {menuOptions.map((stat, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/item"
              >
                <div className="flex items-center gap-4">
                  <span className="text-yellow-500 text-lg group-hover/item:scale-110 transition-transform">{stat.icon}</span>
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest mt-0.5">
                    {stat.label}
                  </span>
                </div>
                <span className="text-sm font-black text-white italic group-hover/item:text-yellow-500 transition-colors">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility Card */}
        <div className="bg-yellow-50/50 rounded-[2.5rem] p-10 border border-yellow-100/50 shadow-premium relative overflow-hidden group">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">
            Network Harmony
          </h4>
          
          <div className="space-y-6">
            <div className="flex items-start gap-5 group/item">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                <FaCheck size={12} />
              </div>
              <div className="space-y-1">
                 <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Best Synergy</p>
                 <p className="text-sm font-bold text-gray-700 italic pr-4 mt-1">
                   Leo, Sagittarius, Aries
                 </p>
              </div>
            </div>

            <div className="flex items-start gap-5 group/item">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-red-100 group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                <FaTimes size={12} />
              </div>
              <div className="space-y-1">
                 <p className="text-[8px] font-black text-red-500 uppercase tracking-widest leading-none">Potential Conflict</p>
                 <p className="text-sm font-bold text-gray-700 italic pr-4 mt-1">
                   Scorpio, Aquarius
                 </p>
              </div>
            </div>
          </div>

          <button className="group/btn relative w-full mt-10 px-8 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden shadow-2xl hover:bg-yellow-600 transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center justify-center gap-4">
               Audit Full Compatibility <FaArrowRight className="text-[10px] group-hover/btn:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
