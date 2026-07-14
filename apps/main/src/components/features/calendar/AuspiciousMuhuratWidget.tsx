import React from 'react';

interface AuspiciousMuhuratWidgetProps {
  panchang: any;
  lang: string;
}

export default function AuspiciousMuhuratWidget({ panchang, lang }: AuspiciousMuhuratWidgetProps) {
  const shubh = panchang?.shubhMuhurat || {};
  
  // Fallbacks for when backend is not updated yet
  const abhijit = shubh.abhijit || { start: '11:58 AM', end: '12:53 PM' };
  const marriage = shubh.marriage || { start: '07:15 AM', end: '08:48 AM' };
  const grihaPravesh = shubh.grihaPravesh || { start: '10:32 AM', end: '12:14 PM' };
  const vehiclePurchase = shubh.vehiclePurchase || { start: '01:32 PM', end: '03:05 PM' };

  const muhurats = [
    { 
      name: lang === 'hi' ? 'अभिजीत मुहूर्त' : 'Abhijit Muhurat', 
      icon: 'fa-sun', 
      start: abhijit.start, 
      end: abhijit.end,
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
      tag: 'Auspicious',
      tagColor: 'bg-green-100 text-green-700'
    },
    { 
      name: lang === 'hi' ? 'विवाह मुहूर्त' : 'Marriage Muhurat', 
      icon: 'fa-ring', 
      start: marriage.start, 
      end: marriage.end,
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      iconColor: 'text-pink-500',
      textColor: 'text-pink-800',
      tag: 'Very Auspicious',
      tagColor: 'bg-pink-100 text-pink-700'
    },
    { 
      name: lang === 'hi' ? 'गृह प्रवेश' : 'Griha Pravesh', 
      icon: 'fa-house', 
      start: grihaPravesh.start, 
      end: grihaPravesh.end,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
      tag: 'Auspicious',
      tagColor: 'bg-blue-100 text-blue-700'
    },
    { 
      name: lang === 'hi' ? 'वाहन खरीद' : 'Vehicle Purchase', 
      icon: 'fa-car', 
      start: vehiclePurchase.start, 
      end: vehiclePurchase.end,
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconColor: 'text-orange-500',
      textColor: 'text-orange-800',
      tag: 'Auspicious',
      tagColor: 'bg-orange-100 text-orange-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <i className="fa-solid fa-om text-[#c85a17] text-xl"></i>
        <h3 className="text-xl font-bold text-[#5b2a26]">
          {lang === 'hi' ? 'आज के शुभ मुहूर्त' : 'Today\'s Auspicious Muhurat'}
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {muhurats.map((m, idx) => (
          <div key={idx} className={`${m.bg} border ${m.border} rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer`}>
            <div className={`text-3xl mb-3 ${m.iconColor}`}>
              <i className={`fa-solid ${m.icon}`}></i>
            </div>
            <h4 className="text-[#5b2a26] font-bold text-sm mb-2">{m.name}</h4>
            <div className="text-gray-700 font-bold text-sm mb-1 leading-tight">{m.start}</div>
            <div className="text-gray-500 text-xs mb-1">to</div>
            <div className="text-gray-700 font-bold text-sm mb-3 leading-tight">{m.end}</div>
            
            <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${m.tagColor}`}>
              {m.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
