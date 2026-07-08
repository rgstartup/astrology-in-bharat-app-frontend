import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from '@/lib/translations/profile';
import Skeleton from '@/components/ui/Skeleton';

interface ProfileSidebarProps {
    profileData: any;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    imagePreview: string;
    handleImageChange: (file: File) => void;
    savingSections: {
        personal: boolean;
        address: boolean;
        astro: boolean;
        settings: boolean;
    };
    loading?: boolean;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    profileData,
    activeTab,
    setActiveTab,
    imagePreview,
    handleImageChange,
    savingSections,
    loading = false,
}) => {
    const legacyUploadsOrigin = process.env.NEXT_PUBLIC_ADMIN_UPLOADS_ORIGIN || "http://localhost:3001";

    const normalizeImagePath = (value: string | null | undefined): string => {
        if (!value) return "/images/aa.webp";
        if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) {
            return value;
        }
        if (value.startsWith("/uploads/")) return value;
        if (value.startsWith("/")) return value;
        return `${legacyUploadsOrigin}/uploads/${value}`;
    };

    const displayImage = normalizeImagePath(imagePreview);

    const { lang } = useLanguageStore();
    const t = profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { icon: "fa-regular fa-user", label: t.sidebar.tabs.profile, id: "profile" },
        { icon: "fa-solid fa-wallet", label: t.sidebar.tabs.wallet, id: "wallet" },
        { icon: "fa-solid fa-gift", label: t.sidebar.tabs.rewards, id: "rewards" },
        { icon: "fa-regular fa-heart", label: t.sidebar.tabs.wishlist, id: "wishlist" },
        { icon: "fa-solid fa-clock-rotate-left", label: t.sidebar.tabs.history, id: "history" },
        { icon: "fa-solid fa-bag-shopping", label: t.sidebar.tabs.orders, id: "orders" },
        { icon: "fa-solid fa-scroll", label: t.sidebar.tabs.reports, id: "reports" },
        { icon: "fa-solid fa-circle-question", label: t.sidebar.tabs.disputes, id: "disputes" },
        { icon: "fa-solid fa-bell", label: t.sidebar.tabs.notifications, id: "notifications" },
        { icon: "fa-solid fa-om", label: t.sidebar.tabs.pujas, id: "pujas" },
        { icon: "fa-solid fa-headset", label: t.sidebar.tabs.support, id: "support" },
    ];

    const activeMenuItem = menuItems.find(item => item.id === activeTab) || menuItems[0];

    return (
        <div className="flex flex-col gap-0 lg:sticky lg:top-[140px] z-30 self-start w-full">
            {/* Profile Header - Visible on all devices */}
            <div className="bg-white rounded-2xl lg:rounded-b-none lg:rounded-t-2xl p-4 shadow-premium lg:border-b lg:border-gray-100 mb-4 lg:mb-0">
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full overflow-hidden border-2 border-white shadow-md">
                            {loading ? (
                                <Skeleton width="100%" height="100%" variant="circular" />
                            ) : savingSections.personal ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <Image
                                    src={displayImage}
                                    alt="Profile"
                                    width={72}
                                    height={72}
                                    className="object-cover w-full h-full text-[0]"
                                />
                            )}
                        </div>
                        {!loading && (
                            <label
                                htmlFor="profile-upload"
                                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-100 hover:bg-gray-50 transition-colors"
                                title={t.sidebar.updatePhoto}
                            >
                                <i className="fa-solid fa-camera text-[10px] text-brown"></i>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleImageChange(e.target.files[0]);
                                        }
                                    }}
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="space-y-1">
                                <Skeleton width={100} height={16} />
                                <Skeleton width={60} height={12} />
                            </div>
                        ) : (
                            <>
                                <h6 className="font-bold text-gray-900 text-base md:text-lg truncate flex items-center gap-1.5 m-0" style={fontStyle}>
                                    {profileData.full_name || profileData.username || t.sidebar.userNameFallback}
                                    <i className="fa-solid fa-check-circle text-orange/80 text-[12px] md:text-sm"></i>
                                </h6>
                                <p className="text-xs md:text-sm text-gray-500 mt-0.5 truncate" style={fontStyle}>
                                    {lang === "hi" ? "उपयोगकर्ता खाता" : "User Account"}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Trigger */}
            <div className="lg:hidden w-full">
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-brown text-white p-4 rounded-2xl flex items-center justify-between shadow-premium border-0 cursor-pointer hover:cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <i className={`${activeMenuItem?.icon || ''} text-xl text-orange`}></i>
                        <span className="font-bold text-base" style={fontStyle}>{activeMenuItem?.label || ''}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
            </div>

            {/* Navigation Menu - Responsive visibility */}
            <div
                className={`bg-brown lg:rounded-b-2xl shadow-premium overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out ${
                    isDropdownOpen 
                    ? 'max-h-[500px] opacity-100 visible mt-2 rounded-2xl py-2' 
                    : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100 invisible lg:visible mt-0 lg:mt-0 lg:rounded-b-2xl'
                }`}
                style={{
                    maxHeight: isDropdownOpen ? "500px" : undefined
                }}
                data-lenis-prevent
            >
                <div className="pt-4 px-4 pb-2 hidden lg:block">
                    <small
                        className="text-[10px] uppercase font-bold tracking-wider text-white/50"
                        style={lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    >
                        {t.sidebar.accountMenu}
                    </small>
                </div>
                <div className="p-2 space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={index}
                                type="button"
                                className={`w-full text-left border-0 rounded-xl flex items-center px-4 py-3 transition-all duration-200 group cursor-pointer hover:cursor-pointer ${
                                    isActive
                                        ? 'bg-orange text-white shadow-gold font-bold'
                                        : 'bg-transparent text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsDropdownOpen(false); // Close dropdown on mobile selection
                                }}
                            >
                                <i className={`${item.icon} w-5 mr-3 text-lg transition-transform group-hover:scale-110`}></i>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
