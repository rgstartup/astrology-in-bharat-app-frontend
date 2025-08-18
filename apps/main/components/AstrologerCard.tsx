"use client";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface Astrologer {
  image: string;
  name: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
}

interface AstrologerCardProps {
  astrologerData: Astrologer;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({ astrologerData }) => {
  const { image, name, expertise, experience, language, price, video } = astrologerData;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="grid-item">
      <div className="astro-card">
        <div className="vid-part">
          <img src={image} alt={name} className="astro-profile-img" />
          <span className="play-vid fa-beat" onClick={handleShow}>
            <i className="fa-solid fa-circle-play"></i>
          </span>
        </div>
        <div className="rating-star">★★★★★</div>
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
        <div className="astro-actions">
          <button>
            <i className="fa-regular fa-comment-dots"></i> Chat
          </button>
          <button className="call">
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
