import React from "react";
import { IncludedItemCardProps } from "./types";

export const IncludedItemCard = ({ icon, title, items, description }: IncludedItemCardProps) => (
    <div className="glass-card rounded-3xl p-6 border border-[#301118]/5 hover:border-[#d4af37]/30 transition-all duration-300 group hover:shadow-lg">
        <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#f4d03f]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex-1">
                <h5 className="text-lg font-black text-[#301118] mb-2 tracking-tight">{title}</h5>
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                            <p className="m-0 text-sm text-[#301118]/70">{item}</p>
                        </div>
                    ))}
                </div>
                {description && (
                    <p className="mt-3 text-xs text-[#301118]/50 italic">{description}</p>
                )}
            </div>
        </div>
    </div>
);
