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

export default function QuotesLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<string>("");

  // Fetch only once — then store quotes in session storage
  const loadQuotes = async () => {
    try {
      const savedQuotes = sessionStorage.getItem("quotesData");

      if (savedQuotes) {
        const parsedQuotes: Quote[] = JSON.parse(savedQuotes);
        setQuotes(parsedQuotes);
        if (parsedQuotes.length > 0) {
          const firstRandom =
            parsedQuotes[Math.floor(Math.random() * parsedQuotes.length)];
          if (firstRandom) {
            setRandomQuote(firstRandom.text);
          }
        }
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/quotes`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setQuotes(response.data);
        sessionStorage.setItem("quotesData", JSON.stringify(response.data));
        const firstFetchRandom =
          response.data[Math.floor(Math.random() * response.data.length)];
        if (firstFetchRandom) {
          setRandomQuote(firstFetchRandom.text);
        }
      } else {
        setRandomQuote("Unlock Your Destiny. The stars align you.");
      }
    } catch (error) {
      setRandomQuote("Unlock Your Destiny. The stars align you.");
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  // Each time route changes → show random quote from saved list
  useEffect(() => {
    if (quotes.length > 0) {
      const effectRandom = quotes[Math.floor(Math.random() * quotes.length)];
      if (effectRandom) {
        setRandomQuote(effectRandom.text);
      }
    }

    setIsVisible(true);
    setIsFadingOut(false);

    const fadeStart = setTimeout(() => setIsFadingOut(true), 1800);
    const hide = setTimeout(() => setIsVisible(false), 2900);

    return () => {
      clearTimeout(fadeStart);
      clearTimeout(hide);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className={`loader-overlay ${isFadingOut ? "fade-out" : ""}`}>
      <style jsx global>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          background: #f5f3ee;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          z-index: 99999;
          padding: 1rem;
          animation: fadeIn 0.6s ease-out forwards;
        }

        .fade-out {
          animation: fadeOut 0.9s ease forwards;
        }

        .quote-symbol {
          font-size: clamp(2.2rem, 6vw, 3rem);
          color: #6b4477;
          opacity: 0.75;
        }

        .quote-text {
          max-width: 850px;
          padding: 0 0.8rem;
          font-family: var(--font-outfit);
          color: #4a2f57;
          font-size: clamp(1rem, 2.8vw, 1.45rem);
          font-weight: 400;
          line-height: 1.55;
          margin: 0.85rem auto;
        }

        .quote-img {
          width: 100px;
          height: auto;
          margin-top: 2rem;
          opacity: 0.92;
        }

        .loading-text {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.75;
          letter-spacing: 0.5px;
          animation: pulse 1.4s infinite;
          color: #472a52;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <span className="quote-symbol">“</span>

      <p className="quote-text">{randomQuote}</p>

      <span className="quote-symbol">”</span>

      <img
        src="http://localhost:3000/images/logo.png"
        className="quote-img"
        alt="Astrology in Bharat Logo"
      />
      <div className="loading-text">Loading...</div>
    </div>
  );
}


