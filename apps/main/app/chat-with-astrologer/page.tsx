import React from "react";
import Link from "next/link";

const ChatWithAstrologerPage = () => {
  return (
    <section className="connect-hero-section">
      <div className="container">
        <h1 className="title-primary color-secondary">
          Connect with Astrologers
        </h1>
        <p className="p-lg mt-3 mb-5">
          Choose your preferred way to consult with India’s top astrologers.
          <br /> Instant solutions for your life’s problems.
        </p>

        <div className="connect-modes-grid">
          {/* Chat Mode */}
          <div className="mode-card">
            <div className="mode-icon">
              <i className="fa-regular fa-comment-dots"></i>
            </div>
            <h3>Chat with Astrologer</h3>
            <p>
              Prefer texting? Chat privately with expert astrologers and get
              instant replies to your queries.
            </p>
            <Link href="/our-astrologers">
              <button className="mode-btn">Start Chat</button>
            </Link>
          </div>

          {/* Call Mode */}
          <div className="mode-card">
            <div className="mode-icon">
              <i className="fa-solid fa-phone-volume"></i>
            </div>
            <h3>Talk to Astrologer</h3>
            <p>
              Connect over a voice call for a personal and detailed consultation
              with our premium astrologers.
            </p>
            <Link href="/our-astrologers">
              <button className="mode-btn">Call Now</button>
            </Link>
          </div>

          {/* Video Mode */}
          <div className="mode-card">
            <div className="mode-icon">
              <i className="fa-solid fa-video"></i>
            </div>
            <h3>Video Call</h3>
            <p>
              Experience face-to-face consultation. See and speak with
              astrologers for a deeper connection.
            </p>
            <Link href="/our-astrologers">
              <button className="mode-btn">Video Call</button>
            </Link>
          </div>
        </div>

        <div className="mt-40">
          <p className="p-md">
            Not sure which one to choose? Explore our
            <Link
              href="/our-astrologers"
              className="fw-bold color-secondary ms-1"
            >
              full list of astrologers
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChatWithAstrologerPage;
