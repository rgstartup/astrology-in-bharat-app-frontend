import React from 'react';
import { useLanguageStore } from "@repo/store";

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'fa-regular fa-compass' },
  { id: 'love', label: 'Love', icon: 'fa-regular fa-heart' },
  { id: 'career', label: 'Career', icon: 'fa-solid fa-briefcase' },
  { id: 'money', label: 'Money', icon: 'fa-solid fa-wallet' },
  { id: 'health', label: 'Health', icon: 'fa-solid fa-heart-pulse' },
  { id: 'education', label: 'Education', icon: 'fa-solid fa-graduation-cap' },
  { id: 'family', label: 'Family', icon: 'fa-solid fa-users' },
  { id: 'travel', label: 'Travel', icon: 'fa-solid fa-plane' },
  { id: 'remedies', label: 'Remedies', icon: 'fa-solid fa-hands-praying' }
];

const TABS_HI: Record<string, string> = {
  'overview': 'अवलोकन',
  'love': 'प्रेम',
  'career': 'करियर',
  'money': 'धन',
  'health': 'स्वास्थ्य',
  'education': 'शिक्षा',
  'family': 'परिवार',
  'travel': 'यात्रा',
  'remedies': 'उपाय'
};

export default function HoroscopeTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const { lang } = useLanguageStore();
  return (
    <div className="w-full mt-6">
      <div className="bg-[#FFFDF9] border border-[#F0E6DD] rounded-2xl p-2 flex items-center gap-1 overflow-x-auto hide-scrollbar shadow-sm">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#F26500] text-white shadow-md' 
                    : 'bg-transparent text-slate-600 hover:bg-orange-50/50 hover:text-[#F26500]'
                }`}
              >
                <i className={`${tab.icon} text-[#F26500]`}></i>
                {lang === 'hi' ? TABS_HI[tab.id] : tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
