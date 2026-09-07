export default function ExpertRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center justify-center gap-1.5 pt-3 text-center"
      style={{ fontSize: "1.05rem" }}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;
        if (rating >= star) {
          return <i key={star} className="fa-solid fa-star text-[#daa23e]" />;
        }
        if (rating >= star - 0.5) {
          return (
            <i
              key={star}
              className="fa-solid fa-star-half-stroke text-[#daa23e]"
            />
          );
        }
        return <i key={star} className="fa-regular fa-star text-[#ccc]" />;
      })}
      <span className="ml-2 text-sm text-gray-500">
        {rating.toFixed(1)} / 5
      </span>
    </div>
  );
}
