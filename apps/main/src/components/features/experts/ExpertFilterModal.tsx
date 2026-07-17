"use client";
import React, { useEffect } from "react";

import { ExpertFilterModalProps } from "@/lib/types";
import { useLanguageStore } from "@repo/store";
import { CloseButton } from "@repo/ui";
import { homeTranslations } from "../../../lib/translations/home";

const ExpertFilterModal: React.FC<ExpertFilterModalProps> = ({
    show,
    onHide,
    localFilter,
    setLocalFilter,
    applyFilters,
    resetFilters,
}) => {
    const { lang } = useLanguageStore();
    const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'auto'; };
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" data-lenis-prevent="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onHide}
            ></div>

            {/* Modal Content */}
            <div className="relative w-[95%] sm:w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h5 className="text-xl font-bold text-gray-900">{t.expertSection.filterTitle}</h5>
                    <CloseButton onClick={onHide} />
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* 1. Availability */}
                    <div className="mb-4 sm:mb-6 flex items-center justify-between p-3 sm:p-4 bg-orange/5 rounded-xl sm:rounded-2xl border border-orange/10">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${localFilter.onlyOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
                            <span className="font-bold text-gray-800">{t.expertSection.filterLabels.showOnlineOnly}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={localFilter.onlyOnline}
                                onChange={(e) => setLocalFilter({ ...localFilter, onlyOnline: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
                        </label>
                    </div>

                    {/* 3. Sort Order (Simplified within filter) */}
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.expertSection.sortByTitle}</label>
                        <select
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                            value={localFilter.sortBy}
                            onChange={(e) => setLocalFilter({ ...localFilter, sortBy: e.target.value })}
                        >
                            <option value="newest">{t.expertSection.sortOptions.none}</option>
                            <option value="rating">{t.expertSection.sortOptions.rating}</option>
                            <option value="price_asc">{t.expertSection.sortOptions.priceAsc}</option>
                            <option value="price_desc">{t.expertSection.sortOptions.priceDesc}</option>
                            <option value="experience">{t.expertSection.sortOptions.experience}</option>
                        </select>
                    </div>

                    {/* 4. Rating Filter */}
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.expertSection.filterLabels.minRating}</label>
                        <div className="flex gap-2">
                            {[0, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setLocalFilter({ ...localFilter, minRating: rating })}
                                    className={`flex-1 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${localFilter.minRating === rating
                                        ? 'bg-orange text-white border-orange shadow-lg shadow-orange/20'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange/50 hover:text-orange'
                                        }`}
                                >
                                    {rating === 0 ? t.expertSection.filterLabels.any : <span className="flex items-center justify-center gap-1"><i className="fa-solid fa-star text-[10px]" />{rating}+</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 5. Price Range */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-gray-700">{t.expertSection.filterLabels.priceRange}</label>
                            <span className="px-3 py-1 bg-orange text-white rounded-full font-bold text-xs">
                                ₹{localFilter.maxPrice} {t.expertSection.filterLabels.perMin}
                            </span>
                        </div>
                        <input
                            type="range"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange"
                            min="0"
                            max="1000"
                            step="10"
                            value={localFilter.maxPrice}
                            onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: parseInt(e.target.value) })}
                        />
                        <div className="flex justify-between text-[10px] mt-2 font-medium text-gray-400">
                            {[50, 200, 500, 1000].map(p => (
                                <span key={p} className={`cursor-pointer ${localFilter.maxPrice >= p ? 'text-orange font-bold' : ''}`}>₹{p}</span>
                            ))}
                        </div>
                    </div>

                    {/* 6. Language & State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t.expertSection.filterLabels.language}</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange/20 outline-none"
                                placeholder={t.expertSection.filterLabels.languagePlaceholder}
                                value={localFilter.language}
                                onChange={(e) => setLocalFilter({ ...localFilter, language: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t.expertSection.filterLabels.state}</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange/20 outline-none"
                                placeholder={t.expertSection.filterLabels.statePlaceholder}
                                value={localFilter.addressState}
                                onChange={(e) => setLocalFilter({ ...localFilter, addressState: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={resetFilters}
                        className="flex-1 px-4 sm:px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all text-sm sm:text-base"
                    >
                        {t.expertSection.applyBtns.resetAll}
                    </button>
                    <button
                        onClick={applyFilters}
                        className="flex-1 px-4 sm:px-6 py-3 bg-orange text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-orange/30 hover:opacity-90 active:scale-95 transition-all text-sm sm:text-base"
                    >
                        {t.expertSection.applyBtns.applyFilters}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpertFilterModal;


