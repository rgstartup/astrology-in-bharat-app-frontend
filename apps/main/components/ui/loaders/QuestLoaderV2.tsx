"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

interface Quote {
  id: number;
  text: string;
  author: string;
  source: string;
}

export default function QuotesLoaderV2() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  // Fetch quotes on mount
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/quotes`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setQuotes(response.data);
          const randomQuote =
            response.data[Math.floor(Math.random() * response.data.length)];
          setCurrentQuote(randomQuote);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  // Handle visibility on route change with smooth fade
  useEffect(() => {
    setIsVisible(true);
    setIsFadingOut(false);

    // Rotate quote if available
    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      if (randomQuote) {
        setCurrentQuote(randomQuote);
      }
    }

    // Start fade out animation before hiding
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2300); // Start fade-out at 2.3s

    // Remove from DOM after fade-out completes
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Total display time: 3s

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname, quotes]);

  if (!isVisible) return null;

  return (
    <div className={`quotes-loader-overlay ${isFadingOut ? "fade-out" : ""}`}>
      <style jsx global>{`
        .quotes-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            135deg,
            #1a0b2e 0%,
            #2d1b4e 40%,
            #4a2c6d 100%
          );
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          animation: smoothFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .quotes-loader-overlay.fade-out {
          animation: smoothFadeOut 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Animated mystical background */
        .quotes-loader-overlay::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(
              circle at 20% 50%,
              rgba(255, 140, 0, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 50%,
              rgba(123, 63, 242, 0.15) 0%,
              transparent 50%
            );
          animation: mysticalPulse 8s ease-in-out infinite;
        }

        /* Floating particles effect */
        .quotes-loader-overlay::after {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background-image:
            radial-gradient(
              2px 2px at 20% 30%,
              rgba(255, 165, 0, 0.3),
              transparent
            ),
            radial-gradient(
              2px 2px at 60% 70%,
              rgba(255, 200, 124, 0.3),
              transparent
            ),
            radial-gradient(
              1px 1px at 50% 50%,
              rgba(123, 63, 242, 0.3),
              transparent
            ),
            radial-gradient(
              1px 1px at 80% 10%,
              rgba(255, 140, 0, 0.3),
              transparent
            ),
            radial-gradient(
              2px 2px at 90% 60%,
              rgba(245, 166, 35, 0.3),
              transparent
            );
          background-size:
            200px 200px,
            300px 300px,
            250px 250px,
            400px 400px,
            350px 350px;
          animation: floatingParticles 30s linear infinite;
          opacity: 0.6;
        }

        .quote-container {
          max-width: 90%;
          width: 700px;
          padding: 3.5rem 3rem;
          text-align: center;
          animation: slideUpSmoothBounce 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 250, 245, 0.95) 100%
          );
          border-radius: 28px;
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.5),
            0 10px 30px rgba(255, 140, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 165, 0, 0.2);
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fade-out .quote-container {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }

        .quote-icon-wrapper {
          position: relative;
          margin-bottom: 2rem;
          animation: iconGlowPulse 3s ease-in-out infinite;
        }

        .quote-icon-wrapper i {
          font-size: 4rem;
          background: linear-gradient(
            135deg,
            #ff8c00 0%,
            #ffa500 50%,
            #f5a623 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 12px rgba(255, 140, 0, 0.4));
          animation: iconRotate 4s ease-in-out infinite;
        }

        .quote-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: clamp(1.3rem, 3.5vw, 2rem);
          font-weight: 600;
          color: #2d1b4e;
          margin-bottom: 1.8rem;
          line-height: 1.75;
          animation: textRevealSmooth 1s ease-out 0.4s both;
          position: relative;
          padding: 0 1rem;
        }

        .quote-text::before,
        .quote-text::after {
          content: '"';
          position: absolute;
          font-size: 4rem;
          background: linear-gradient(135deg, #ff8c00 0%, #f5a623 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.15;
          font-family: Georgia, serif;
        }

        .quote-text::before {
          top: -20px;
          left: -10px;
        }

        .quote-text::after {
          bottom: -40px;
          right: -10px;
        }

        .quote-author {
          font-family: var(--font-poppins), sans-serif;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #7b3ff2 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          animation: textRevealSmooth 1s ease-out 0.6s both;
          margin-top: 0.5rem;
        }

        .quote-source {
          font-size: 1rem;
          color: #ff8c00;
          margin-top: 0.75rem;
          font-style: italic;
          font-weight: 500;
          animation: textRevealSmooth 1s ease-out 0.8s both;
          opacity: 0.85;
        }

        .loading-spinner {
          width: 70px;
          height: 70px;
          border: 6px solid rgba(255, 140, 0, 0.2);
          border-top: 6px solid #ff8c00;
          border-right: 6px solid #f5a623;
          border-radius: 50%;
          animation: spinSmooth 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          margin-bottom: 2rem;
          box-shadow: 0 0 30px rgba(255, 140, 0, 0.3);
        }

        .loading-text {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          font-family: var(--font-poppins), sans-serif;
          animation: textPulseSmooth 2s ease-in-out infinite;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        /* Smooth Animations */
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes smoothFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUpSmoothBounce {
          0% {
            transform: translateY(60px) scale(0.92);
            opacity: 0;
          }
          60% {
            transform: translateY(-5px) scale(1.01);
            opacity: 1;
          }
          80% {
            transform: translateY(2px) scale(0.99);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes textRevealSmooth {
          from {
            opacity: 0;
            transform: translateY(15px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes iconGlowPulse {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 4px 12px rgba(255, 140, 0, 0.4));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 6px 20px rgba(255, 140, 0, 0.6));
          }
        }

        @keyframes iconRotate {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        @keyframes spinSmooth {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes textPulseSmooth {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.98);
          }
        }

        @keyframes mysticalPulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes floatingParticles {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(-50px, -50px) rotate(360deg);
          }
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .quote-container {
            padding: 2.5rem 1.75rem;
            margin: 0 1rem;
            border-radius: 24px;
          }

          .quote-text {
            font-size: 1.4rem;
            padding: 0 0.5rem;
          }

          .quote-text::before,
          .quote-text::after {
            font-size: 3rem;
          }

          .quote-author {
            font-size: 1.1rem;
          }

          .quote-source {
            font-size: 0.9rem;
          }

          .quote-icon-wrapper i {
            font-size: 3rem;
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
            border-width: 5px;
          }

          .loading-text {
            font-size: 1.1rem;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .quotes-loader-overlay,
          .quote-container,
          .quote-text,
          .quote-author,
          .quote-source,
          .quote-icon-wrapper i,
          .loading-spinner {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="quote-container">
        {currentQuote ? (
          <>
            <div className="quote-icon-wrapper">
              <i className="fas fa-om"></i>
            </div>
            <p className="quote-text">{currentQuote.text}</p>
            <div className="quote-author">— {currentQuote.author}</div>
            {currentQuote.source && (
              <div className="quote-source">{currentQuote.source}</div>
            )}
          </>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading ancient wisdom...</p>
          </div>
        )}
      </div>
    </div>
  );
}


