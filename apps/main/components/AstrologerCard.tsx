"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Astrologer {
  image: string;
  name: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
  ratings?: number;
}

interface AstrologerCardProps {
  astrologerData: Astrologer;
}




const AstrologerCard: React.FC<AstrologerCardProps> = ({ astrologerData }) => {
  const { image, name, expertise, experience, language, price, video, ratings = 0 } = astrologerData as any;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const router = useRouter();

  const handleChatClick = () => {
    router.push('/user-detail-form');
  }

  // Create URL-safe query string with astrologer data
  const createDetailsUrl = () => {
    const params = new URLSearchParams({
      name: name || '',
      image: image || '',
      expertise: expertise || '',
      experience: String(experience || 0),
      language: language || '',
      price: String(price || 0),
      video: video || '',
      ratings: String(ratings || 0),
    });
    return `/astrologer-details?${params.toString()}`;
  };

  return (
    <div className="grid-item" >
      <div className="astro-card">
        <Link href={createDetailsUrl()}>
          <div className="vid-part">
            <img src={image} alt={name} className="astro-profile-img" />
            <span className="play-vid fa-beat" >
              <i className="fa-solid fa-circle-play"></i>
            </span>
          </div>

          <div className="rating-star text-warning d-flex align-items-center" style={{ gap: 6, fontSize: "1.05rem" }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const starIndex = i + 1;
              if (ratings >= starIndex) {
                return <i key={i} className="fa-solid fa-star color-secondary"></i>;
              }
              if (ratings >= starIndex - 0.5) {
                return <i key={i} className="fa-solid fa-star-half-stroke color-secondary"></i>;
              }
              return <i key={i} className="fa-regular fa-star" style={{ color: "#ccc" }}></i>;
            })}
            <span className="text-muted small ms-2">{ratings.toFixed(1)} / 5</span>
          </div>
          <div className="astro-name">{name}</div>
          <div className="astro-tags">{expertise}</div>
          <div className="astro-info">
            <strong>Exp:</strong> {experience} Years
          </div>
          <div className="astro-info">
            <strong>Lang:</strong> {language}
          </div>
          <div className="astro-info">
            <strong>Price:</strong> ₹{price}/min
          </div>
        </Link>
        <div className="astro-actions">
          <button onClick={handleChatClick} className="btn-global btn-outline-primary">
            <i className="fa-regular fa-comment-dots"></i> Chat
          </button>
          <button className="call btn-global btn-outline-secondary" onClick={handleChatClick} >
            <i className="fa-solid fa-phone-volume"></i> Call
          </button>
        </div>
      </div>

      {/* ✅ React-Bootstrap Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="xl"
        contentClassName="astro-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-astro-about">
            Meet Astrologer {name} Introduction Video
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="500"
            src={video}
            title={`Astrologer ${name} Video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AstrologerCard;
