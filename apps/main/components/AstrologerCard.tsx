"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

interface Astrologer {
  userId?: number;
  image: string;
  name: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
  ratings?: number;
  isAvailable?: boolean;
}

interface AstrologerCardProps {
  astrologerData: Astrologer;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({ astrologerData }) => {
  const { userId, image, name, expertise, experience, language, price, video, ratings = 0, isAvailable: initialAvailable } = astrologerData as any;

  const [show, setShow] = useState(false);
  const [online, setOnline] = useState(initialAvailable);
  const router = useRouter();

  useEffect(() => {
    setOnline(initialAvailable);
  }, [initialAvailable]);

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:4000");

    socket.on("expert_status_changed", (data: { userId: number | string; status: string }) => {
      console.log(`Status change received for expert ${data.userId}: ${data.status}`);
      // Use == to handle potential string/number mismatch, though we expect numbers
      if (Number(data.userId) === Number(userId)) {
        setOnline(data.status === "online");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const handleClose = () => setShow(false);
  const handleShow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(true);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/user-detail-form');
  }

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
    <div className="grid-item">
      <div className="astro-card position-relative">
        {/* Online/Offline Dot */}
        <div
          className="status-dot-wrapper"
          title={online ? "Online" : "Offline"}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "10px",
            fontWeight: "bold",
            color: online ? "#10b981" : "#ef4444",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <span
            className={`status-dot ${online ? "bg-success" : "bg-danger"}`}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: online ? "#10b981" : "#ef4444",
              boxShadow: online ? "0 0 8px #10b981" : "none",
              display: "inline-block"
            }}
          ></span>
          {online ? "ONLINE" : "OFFLINE"}
        </div>

        <Link href={createDetailsUrl()} className="text-decoration-none text-dark">
          <div className="vid-part">
            <img src={image} alt={name} className="astro-profile-img" />
            <span className="play-vid fa-beat" onClick={handleShow}>
              <i className="fa-solid fa-circle-play"></i>
            </span>
          </div>

          <div className="rating-star text-warning d-flex align-items-center mt-2" style={{ gap: 6, fontSize: "1.05rem" }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const starIndex = i + 1;
              if (ratings >= starIndex) return <i key={i} className="fa-solid fa-star color-secondary"></i>;
              if (ratings >= starIndex - 0.5) return <i key={i} className="fa-solid fa-star-half-stroke color-secondary"></i>;
              return <i key={i} className="fa-regular fa-star" style={{ color: "#ccc" }}></i>;
            })}
            <span className="text-muted small ms-2">{Number(ratings).toFixed(1)} / 5</span>
          </div>
          <div className="astro-name">{name}</div>
          <div className="astro-tags text-truncate">{expertise}</div>
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
          <button className="call btn-global btn-outline-secondary" onClick={handleChatClick}>
            <i className="fa-solid fa-phone-volume"></i> Call
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered size="xl" contentClassName="astro-modal-content">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-astro-about">
            Meet Astrologer {name} Introduction Video
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
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
