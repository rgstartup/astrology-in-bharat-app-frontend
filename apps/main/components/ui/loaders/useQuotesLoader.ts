"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

export interface Quote {
  id: number;
  text: string;
  author: string;
  source: string;
}

export const useQuotesLoader = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const [data] = await api.get<Quote[]>(`/quotes`);
        if (Array.isArray(data) && data.length > 0) {
          setQuotes(data);
          const randomQuote = data[Math.floor(Math.random() * data.length)];
          setCurrentQuote(randomQuote ?? null);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    setIsVisible(true);
    setIsFadingOut(false);

    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      if (randomQuote) setCurrentQuote(randomQuote);
    }

    const fadeOutTimer = setTimeout(() => setIsFadingOut(true), 2300);
    const hideTimer = setTimeout(() => setIsVisible(false), 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname, quotes]);

  return { isVisible, isFadingOut, currentQuote };
};
