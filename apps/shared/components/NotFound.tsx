import React from "react";
import Link from "next/link";

interface NotFoundProps {
  returnUrl?: string;
  returnLabel?: string;
  title?: string;
  message?: string;
  imagePath?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({
  returnUrl = "/",
  returnLabel = "Back to Home",
  title = "Page Not Found",
  message = "Looks like the stars couldn't guide you here. The page you are looking for might have been moved, renamed, or does not exist in our universe.",
  imagePath = "/images/Astrologer.png",
}) => {
  return (
    <div className="flex flex-col justify-center items-center text-center h-screen overflow-hidden p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Title - Smaller */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-2">
        404
      </h1>
      
      {/* Heading - Compact */}
      <h2 className="text-base md:text-lg lg:text-xl font-bold mb-2 text-gray-800">
        {title}
      </h2>

      {/* Message - Shorter */}
      <p className="max-w-md mb-4 text-xs md:text-sm text-gray-600 leading-snug px-4">
        {message}
      </p>

      {/* Image - Much Smaller */}
    <div className="mb-4">
  <img
    src={imagePath}
    alt="Astrologer Illustration"
    className="w-24 h-24 md:w-28 md:h-28 lg:w-52 lg:h-52 object-contain mx-auto"
    onError={(e) => {
      console.error("Image failed to load:", imagePath);
      e.currentTarget.style.display = "none";
    }}
  />
</div>


      {/* Back Home Button - Compact */}
      <Link
        href={returnUrl}
        className="inline-flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-orange-600 text-black no-underline rounded-full font-bold text-xs md:text-sm transition-all duration-300 hover:bg-orange-700 hover:-translate-y-1 shadow-lg hover:shadow-xl active:translate-y-0"
      >
        <i className="fas fa-home text-xs md:text-sm"></i>
        <span>{returnLabel}</span>
      </Link>
    </div>
  );
};

export default NotFound;