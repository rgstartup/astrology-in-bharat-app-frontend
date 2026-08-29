"use client";

import React, { useState } from "react";

const QUICK_TAGS = [
  "Highly Accurate",
  "Life Changing",
  "Great Guidance",
  "Very Helpful",
  "Best Platform",
  "Amazing Experience",
];

interface QuickTagProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const QuickTag = (props: QuickTagProps) => {
  const { selectedTags, setSelectedTags } = props;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="mb-5">
      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2.5">
        Quick Tags (Optional)
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-200 ${
              selectedTags.includes(tag)
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickTag;
