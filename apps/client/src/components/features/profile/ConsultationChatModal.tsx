import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

/** Session kind across the legacy (`AUDIO_CALL`) and current (`voice`) vocabularies. */
function sessionKind(session: any): "chat" | "voice" | "video" {
  const raw = String(session.type ?? session.session_type ?? "").toLowerCase();
  if (raw === "video" || raw === "video_call" || raw === "video-call") return "video";
  if (raw === "voice" || raw === "audio" || raw === "audio_call" || raw === "audio-call" || raw === "call") {
    return "voice";
  }
  return "chat";
}

interface ConsultationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSession: any;
  chatMessages: any[];
  userAvatar?: string;
}

function BirthDetailsIntroCard({ data }: { data: any }) {
  const formattedDob = data.dob
    ? !isNaN(new Date(data.dob).getTime())
      ? new Date(data.dob).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : data.dob
    : "N/A";

  return (
    <div
      className="my-4 w-full shadow-lg rounded-[20px] p-1 mx-auto"
      style={{ backgroundColor: "#FFEA00", maxWidth: "280px" }}
    >
      <div
        className="rounded-[16px] px-5 py-5 border"
        style={{ borderColor: "rgba(0,0,0,0.05)", backgroundColor: "transparent" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
          >
            <i className="fa-regular fa-user text-black text-lg"></i>
          </div>
          <div>
            <h5 className="font-black text-black text-[13px] tracking-widest mb-0.5">
              BIRTH DETAILS
            </h5>
            <p className="text-black/60 font-bold text-[8px] uppercase tracking-widest mb-0">
              Shared Profile Info
            </p>
          </div>
        </div>

        <div className="h-px w-full mb-5" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}></div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-3 text-left">
          <div>
            <label
              className="block font-black text-[9px] uppercase tracking-widest mb-1"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              Name
            </label>
            <p className="font-black text-black text-sm m-0 truncate">{data.name}</p>
          </div>
          <div>
            <label
              className="block font-black text-[9px] uppercase tracking-widest mb-1"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              Gender
            </label>
            <p className="font-black text-black text-sm m-0 capitalize">{data.gender || "N/A"}</p>
          </div>
          <div>
            <label
              className="block font-black text-[9px] uppercase tracking-widest mb-1"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              DOB
            </label>
            <p className="font-black text-black text-sm m-0">{formattedDob}</p>
          </div>
          <div>
            <label
              className="block font-black text-[9px] uppercase tracking-widest mb-1"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              TOB
            </label>
            <p className="font-black text-black text-sm m-0">{data.tob || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <label
              className="block font-black text-[9px] uppercase tracking-widest mb-1"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              POB
            </label>
            <p className="font-black text-black text-[13px] m-0 flex items-start gap-1.5 leading-snug">
              <i className="fa-solid fa-location-dot mt-0.5" style={{ color: "rgba(0,0,0,0.3)" }}></i>
              <span>{data.pob || "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CallSessionSummary({ selectedSession }: { selectedSession: any }) {
  const isVideo = sessionKind(selectedSession) === "video";
  const iconClass = isVideo ? "fa-video text-purple-600" : "fa-phone text-blue-600";
  const bgClass = isVideo ? "bg-purple-50" : "bg-blue-50";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-100/50 ${bgClass}`}
      >
        <i className={`fa-solid ${iconClass} text-4xl`}></i>
      </div>

      <h4 className="text-2xl font-black text-gray-900 mb-2">
        {isVideo ? "Video Consultation" : "Audio Consultation"}
      </h4>
      <p className="text-gray-500 mb-10 max-w-xs mx-auto">
        This was a successful {isVideo ? "video" : "audio"} session with{" "}
        {selectedSession.expert?.user?.name || selectedSession.expert?.name || "the expert"}.
      </p>

      <div className="w-full max-w-sm bg-gray-50/50 rounded-3xl p-8 border border-gray-100 flex flex-col gap-5 text-left">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
          <span className="text-sm font-bold text-gray-400">Total Duration</span>
          <span className="font-black text-gray-900">{selectedSession.durationString || "0s"}</span>
        </div>
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
          <span className="text-sm font-bold text-gray-400">Consultation Rate</span>
          <span className="font-black text-gray-700">₹{selectedSession.rate || 0}/min</span>
        </div>
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
          <span className="text-sm font-bold text-gray-400">Consultation Fee</span>
          <span className="font-black text-[#FF6B00]">₹{selectedSession.total_cost || 0}</span>
        </div>

        {selectedSession.metadata?.recordingUrl ? (
          <div className="mt-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              <i className="fa-solid fa-play-circle text-blue-500"></i>
              Call Recording
            </label>
            <audio controls className="w-full h-10 accent-blue-600">
              <source src={selectedSession.metadata.recordingUrl} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 p-4 bg-gray-100/50 rounded-2xl text-xs font-bold text-gray-400 italic">
            <i className="fa-solid fa-info-circle"></i>
            No recording available for this call
          </div>
        )}
      </div>
    </div>
  );
}

function ChatMessageBubble({
  msg,
  selectedSession,
  userDisplayAvatar,
}: {
  msg: any;
  selectedSession: any;
  userDisplayAvatar: string;
}) {
  const sType = (msg.senderType || msg.sender_type || "").toLowerCase();
  const content = msg.content || "";
  const isUser = sType === "user" || sType === "customer" || sType === "client";
  const isAdmin = sType === "admin" || sType === "system";

  if (isAdmin) {
    const isEnded =
      content.toLowerCase().includes("end") ||
      content.toLowerCase().includes("finish") ||
      content.toLowerCase().includes("close") ||
      content.toLowerCase().includes("system");
    const bgColor = isEnded ? "bg-red-50" : "bg-gray-50";
    const borderColor = isEnded ? "border-red-200" : "border-gray-200";
    const textColor = isEnded ? "text-red-600" : "text-gray-600";

    return (
      <div className="my-4 w-full flex justify-center">
        <div className="flex flex-col items-start" style={{ maxWidth: "85%" }}>
          <div
            className={`${bgColor} border ${borderColor} rounded-2xl px-6 py-4 shadow-sm text-center`}
            style={{ minWidth: "260px" }}
          >
            <div className={`flex items-center justify-center gap-1.5 mb-1.5 ${textColor}`}>
              <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
              <span className="text-[11px] font-black uppercase tracking-widest">
                System Message
              </span>
            </div>
            <div className={`${textColor} text-[15px] font-medium`}>{msg.content}</div>
          </div>
          <div className="mt-1.5 ml-1">
            <small className="text-gray-400 font-bold" style={{ fontSize: "10px", letterSpacing: "0.02em" }}>
              {msg.createdAt || msg.created_at
                ? new Date(msg.createdAt || msg.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </small>
          </div>
        </div>
      </div>
    );
  }

  const isIntroCard = content.startsWith("[INTRO_CARD]");
  let cardJson: any = null;
  if (isIntroCard) {
    try {
      cardJson = JSON.parse(content.replace("[INTRO_CARD]", ""));
    } catch {
      cardJson = null;
    }
  }

  return (
    <div
      className={`flex gap-3 items-start ${
        isIntroCard ? "justify-content-center" : isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isIntroCard && (
        <div
          className="rounded-full overflow-hidden flex-shrink-0 relative mt-1"
          style={{
            width: "36px",
            height: "36px",
            border: `1.5px solid ${isUser ? "#FF6B00" : "#e0e0e0"}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Image
            src={isUser ? userDisplayAvatar : selectedSession.expert_image}
            alt={sType}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as any).src = isUser
                ? "https://avatar.iran.liara.run/public/boy?username=User"
                : "/images/dummy-expert.jpg";
            }}
          />
        </div>
      )}

      <div
        className={`flex flex-col ${isIntroCard ? "w-full items-center" : isUser ? "items-end" : "items-start"}`}
        style={{ maxWidth: isIntroCard ? "100%" : "75%" }}
      >
        {isIntroCard && cardJson ? (
          <BirthDetailsIntroCard data={cardJson} />
        ) : (
          <div
            className={`px-5 py-4 inline-block ${
              isUser ? "text-white border-0" : "bg-white text-gray-800 border border-gray-100"
            }`}
            style={{
              backgroundColor: isUser ? "#FF6B00" : "#FFFFFF",
              borderRadius: isUser ? "28px 0px 28px 28px" : "0px 28px 28px 28px",
              textAlign: "left",
              boxShadow: isUser
                ? "0 4px 12px rgba(255, 107, 0, 0.2)"
                : "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                lineHeight: "1.4",
                fontWeight: "600",
                letterSpacing: "0.01em",
              }}
            >
              {content}
            </div>
          </div>
        )}

        {!isIntroCard && (
          <div className="mt-2 text-left w-full pl-1">
            <small className="text-gray-400 font-bold" style={{ fontSize: "10px", letterSpacing: "0.02em" }}>
              {msg.createdAt || msg.created_at
                ? new Date(msg.createdAt || msg.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

const ConsultationChatModal: React.FC<ConsultationChatModalProps> = ({
  isOpen,
  onClose,
  selectedSession,
  chatMessages,
  userAvatar,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
      setMounted(false);
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !selectedSession) return null;

  const isCall = sessionKind(selectedSession) !== "chat";

  const userDisplayAvatar =
    userAvatar ||
    selectedSession.user_image ||
    "https://avatar.iran.liara.run/public/boy?username=User";

  const sessionDate =
    selectedSession.createdAt || selectedSession.created_at
      ? new Date(selectedSession.createdAt || selectedSession.created_at).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        )
      : "N/A";

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-6"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden border-0 animate-in zoom-in-95 duration-300 w-full max-w-2xl flex flex-col relative z-[1000000]"
        style={{
          maxHeight: "90vh",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-between items-center p-4 border-b shrink-0"
          style={{ backgroundColor: "#FF6B00" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="rounded-full overflow-hidden position-relative"
              style={{ width: "48px", height: "48px", border: "3px solid white" }}
            >
              <Image
                src={selectedSession.expert_image}
                alt={selectedSession.expert_name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as any).src = "/images/dummy-expert.jpg";
                }}
              />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-white">{selectedSession.expert_name}</h5>
              <p className="text-xs mb-0 text-white opacity-75">
                <i className="fa-regular fa-calendar me-1"></i>
                {sessionDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="p-4 overflow-auto flex-1 bg-white" data-lenis-prevent>
          {isCall ? (
            <CallSessionSummary selectedSession={selectedSession} />
          ) : chatMessages.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-message fa-3x text-muted mb-3"></i>
              <p className="text-muted">No messages in this consultation</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {chatMessages.map((msg: any, index: number) => (
                <ChatMessageBubble
                  key={msg.id || index}
                  msg={msg}
                  selectedSession={selectedSession}
                  userDisplayAvatar={userDisplayAvatar}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex-none px-6">
          <div className="flex gap-4 justify-between items-center">
            <div className="flex gap-3 flex-wrap">
              <span className="px-4 py-2 rounded-xl flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <i className="fa-solid fa-clock opacity-60"></i>
                {selectedSession.durationString || "0s"}
              </span>
              {selectedSession.total_cost > 0 && (
                <span className="px-4 py-2 rounded-xl flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                  <i className="fa-solid fa-indian-rupee-sign opacity-60"></i>
                  ₹{selectedSession.total_cost}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm shadow-lg shadow-gray-200"
            >
              Close History
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConsultationChatModal;
