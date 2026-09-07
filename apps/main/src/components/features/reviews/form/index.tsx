"use client";

import { useState } from "react";
import PlatformReviewHeader from "./header";
import PlatformReviewRating from "./rating";
import QuickTag from "./quick-tag";
import { api } from "@/actions";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

interface IReviewFormProps {
  userName?: string;
  state: IPlatformReviewModalState;
  setState: React.Dispatch<React.SetStateAction<IPlatformReviewModalState>>;
  show: boolean;
  handleOnSubmit: () => void;
  handleClose: () => void;
}

export interface IPlatformReviewModalState {
  rating: number;
  hovered: number;
  review: string;
}

const ReviewForm: React.FC<IReviewFormProps> = (props) => {
  const { state, setState } = props;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const updateState = <K extends keyof IPlatformReviewModalState>(
    key: K,
    value: IPlatformReviewModalState[K],
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (state.rating === 0) return;
    try {
      const [_, err] = await api.post("/reviews", {
        rating: state.rating,
        comment: state.review || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        review_type: "platform",
      });

      if (err) {
        toast.error(
          getErrorMessage(err) ||
            "Review submit karne mein problem hui. Dobara try karein.",
        );
        return;
      }
      // updateState("submitted", true);
      props.handleOnSubmit();
      setTimeout(() => props.handleClose(), 2500);
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Kuch gadbad ho gayi. Dobara try karein.",
      );
    }
  };

  if (!props.show) return null;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <PlatformReviewHeader
        userName={props.userName}
        handleClose={props.handleClose}
      />

      {/* Star Rating */}
      <PlatformReviewRating
        hovered={state.hovered}
        rating={state.rating}
        setHovered={(star) => updateState("hovered", star)}
        setRating={(star) => updateState("rating", star)}
      />

      <QuickTag selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      {/* Text Area */}
      <div className="mb-6">
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2.5">
          Apna Anubhav Likhein (Optional)
        </p>
        <textarea
          value={state.review}
          onChange={(e) => updateState("review", e.target.value)}
          placeholder="Aapka kya anubhav raha Astrology in Bharat ke saath?"
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] text-gray-700 font-medium resize-none focus:outline-none focus:border-orange-200 focus:bg-white transition-all duration-200 placeholder:text-gray-300"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={state.rating === 0}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F25E0A] to-orange-500 text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/25 hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          Submit Review ✨
        </button>
        <button
          onClick={props.handleClose}
          className="px-4 py-3.5 rounded-2xl bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors duration-200"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
