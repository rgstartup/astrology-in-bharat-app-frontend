"use client";

import React from "react";
import { Quote } from "./useQuotesLoader";
import QuotesLoaderStyles from "./QuotesLoaderStyles";

interface QuotesLoaderContentProps {
  currentQuote: Quote | null;
  isFadingOut: boolean;
}

const QuotesLoaderContent: React.FC<QuotesLoaderContentProps> = ({
  currentQuote,
  isFadingOut,
}) => {
  return (
    <div className={`quotes-loader-overlay ${isFadingOut ? "fade-out" : ""}`}>
      <QuotesLoaderStyles />
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
};

export default QuotesLoaderContent;
