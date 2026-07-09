import React from 'react';

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

export default function HoroscopeTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <div className="w-full mt-6">
      <div className="bg-[#1A1A1A] border border-[#F0E6DD] rounded-2xl p-2 flex items-center gap-1 overflow-x-auto hide-scrollbar shadow-sm">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#2D1205] text-white shadow-md' 
                    : 'bg-transparent text-slate-600 hover:bg-orange-50/50 hover:text-[#F26500]'
                }`}
              >
                <i className={`${tab.icon} text-[#F26500]`}></i>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
