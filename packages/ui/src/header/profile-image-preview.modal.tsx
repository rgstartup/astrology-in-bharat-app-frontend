"use client";

import React from "react";
import { CloseButton } from "../components/CloseButton";

interface ProfileImagePreviewModalProps {
  showImageModal: boolean;
  setShowImageModal: React.Dispatch<React.SetStateAction<boolean>>;
  avatarSrc: string;
}

const ProfileImagePreviewModal = (props: ProfileImagePreviewModalProps) => {
  if (!props.showImageModal) return null;

  return (
    <div
      onClick={() => props.setShowImageModal(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100000,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(3px)",
        padding: "20px",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg"
        style={{
          position: "relative",
          padding: "10px",
          maxWidth: "min(500px, 95vw)",
          maxHeight: "95vh",
          animation: "zoomIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton
          onClick={() => props.setShowImageModal(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
          }}
        />
        <div
          className="overflow-hidden rounded-3 d-flex align-items-center justify-content-center"
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          <img
            src={props.avatarSrc}
            alt="Profile Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
      <style>{`
            @keyframes zoomIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            .close-modal-btn:hover {
              transform: rotate(90deg) scale(1.1);
              background-color: #301118 !important;
            }
          `}</style>
    </div>
  );
};

export default ProfileImagePreviewModal;
