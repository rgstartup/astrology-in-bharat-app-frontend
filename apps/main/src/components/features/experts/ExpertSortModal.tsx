"use client";
import React, { useEffect } from "react";

import { ExpertSortModalProps } from "@/lib/types";
import { useLanguageStore } from "@repo/store";
import { CloseButton } from "@repo/ui";
import { homeTranslations } from "../../../lib/translations/home";

const ExpertSortModal: React.FC<ExpertSortModalProps> = ({
    show,
    onHide,
    sortBy,
    setSortBy,
    applySort,
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

    const options = [
        { value: "newest", label: t.expertSection.sortOptions.none, icon: "fa-sun" },
        { value: "rating", label: t.expertSection.sortOptions.rating, icon: "fa-star" },
        { value: "price_asc", label: t.expertSection.sortOptions.priceAsc, icon: "fa-arrow-up-1-9" },
        { value: "price_desc", label: t.expertSection.sortOptions.priceDesc, icon: "fa-arrow-down-9-1" },
        { value: "experience", label: t.expertSection.sortOptions.experience, icon: "fa-briefcase" },
    ];

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" data-lenis-prevent="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onHide}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h5 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <i className="fa-solid fa-sort text-orange"></i>
                        {t.expertSection.sortByTitle}
                    </h5>
                    <CloseButton onClick={onHide} />
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                    {options.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${sortBy === option.value
                                ? 'border-orange bg-orange/5 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-orange/30 hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="sortOption"
                                value={option.value}
                                checked={sortBy === option.value}
                                onChange={() => setSortBy(option.value)}
                                className="w-5 h-5 text-orange bg-gray-100 border-gray-300 focus:ring-orange accent-orange"
                            />
                            <div className="ml-4 flex items-center gap-3">
                                <i className={`fa-solid ${option.icon} text-orange w-5 text-center`}></i>
                                <span className={`font-bold ${sortBy === option.value ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {option.label}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={applySort}
                        className="w-full py-4 bg-orange text-white font-bold rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        {t.expertSection.applyBtns.applySort}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpertSortModal;
