import React from "react";
import { IPlatformReviewModalState } from "..";

interface IPlatformReviewRating extends Pick<
  IPlatformReviewModalState,
  "hovered" | "rating"
> {
  setHovered: (star: number) => void;
  setRating: (star: number) => void;
}

const PlatformReviewRating = (props: IPlatformReviewRating) => {
  const { hovered, rating, setHovered, setRating } = props;

  return (
    <div className="mb-5">
      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2.5">
        Apna Rating Dijiye
      </p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none transform transition-transform duration-150 hover:scale-110 active:scale-95"
          >
            <svg
              className={`w-9 h-9 transition-colors duration-150 drop-shadow-sm ${
                star <= (hovered || rating)
                  ? "text-orange-400 fill-orange-400"
                  : "text-gray-200 fill-gray-200"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.5}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        {(hovered || rating) > 0 && (
          <span className="text-[11px] font-black text-orange-400 ml-2">
            {
              [
                "",
                "😐 Poor",
                "🙁 Fair",
                "😊 Good",
                "😄 Great",
                "🤩 Excellent!",
              ][hovered || rating]
            }
          </span>
        )}
      </div>
    </div>
  );
};

export default PlatformReviewRating;
