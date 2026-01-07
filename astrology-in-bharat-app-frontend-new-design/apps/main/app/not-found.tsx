import React from "react";
import Link from "next/link";
import Image from "next/image";

const NotFound: React.FC = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center py-20 min-h-[60vh]"
      style={{
        color: "black",
        padding: "20px",
      }}
    >
      {/* Title */}
      <h1 className="display-1 fw-bold text-[#fd6410]">404</h1>
      <h2 className="fw-bold mb-3 text-[#301118]">Page Not Found</h2>

      {/* Message */}
      <p className="mb-4 text-gray-500 italic" style={{ maxWidth: "500px" }}>
        Looks like the stars couldn’t guide you here. The page you are looking
        for might have been moved, renamed, or does not exist in our universe.
      </p>

      {/* Image */}
      <div className="relative mb-4">
        <Image
          src="/images/Astrologer.png"
          alt="Astrologer Illustration"
          width={250}
          height={250}
          className="mx-auto drop-shadow-xl"
        />
      </div>

      {/* Back Home Button */}
      <div className="col-lg-2 col-md-5 mobile-none text-dark fw-bold px-4 py-2 rounded-pill ">
        <Link href="/">
          <span className="btn-link">
            <i className="fas fa-home me-2"></i> Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
