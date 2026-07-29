import { FaBriefcase, FaHeart, FaHospital, FaUser } from "react-icons/fa"


type options = {
    icon: React.JSX.Element,
    label: string,
    text: string,
    bg: string
}


export const CharacteristicsGrid = () => {

    const menuOptions: options[] = [
                    {
                      icon: <FaUser className="text-blue-500" />,
                      label: "Personality",
                      text: "Strong, ambitious and determined individuals with a natural spark for leadership.",
                      bg: "bg-blue-50",
                    },
                    {
                      icon: <FaHeart className="text-pink-500" />,
                      label: "Love & Relations",
                      text: "Passionate and loyal partners who seek deep emotional connections.",
                      bg: "bg-pink-50",
                    },
                    {
                      icon: <FaBriefcase className="text-orange-500" />,
                      label: "Career",
                      text: "Excel in creative and structured environments where their skills are valued.",
                      bg: "bg-orange-50",
                    },
                    {
                      icon: <FaHospital className="text-green-500" />,
                      label: "Health",
                      text: "Generally strong constitution but need to maintain balance in routines.",
                      bg: "bg-green-50",
                    },
    ]


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {menuOptions.map((feat, i) => (
              <div key={i} className="group">
                <div className="h-full bg-white rounded-[2.5rem] p-8 shadow-premium border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:border-yellow-500/20 flex gap-6 items-start">
                   <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center text-2xl shrink-0 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500`}>
                      {feat.icon}
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-yellow-600 transition-colors">
                        {feat.label}
                      </h4>
                      <p className="text-sm font-bold text-gray-900 leading-relaxed italic">
                        &quot;{feat.text}&quot;
                      </p>
                   </div>
                </div>
              </div>
            ))}
        </div>
    )
}
