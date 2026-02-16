import React from "react";

interface ConsultationChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSession: any;
    chatMessages: any[];
    userAvatar?: string;
}

const ConsultationChatModal: React.FC<ConsultationChatModalProps> = ({
    isOpen,
    onClose,
    selectedSession,
    chatMessages,
    userAvatar
}) => {
    if (!isOpen || !selectedSession) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 9999,
                backdropFilter: "blur(8px)"
            }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-4 shadow-lg overflow-hidden"
                style={{ maxWidth: "800px", width: "90%", maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ backgroundColor: "var(--primary)" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-circle overflow-hidden"
                            style={{ width: "48px", height: "48px", border: "3px solid white" }}
                        >
                            <img
                                src={selectedSession.expert?.user?.avatar || "/images/dummy-astrologer.jpg"}
                                alt={selectedSession.expert?.user?.name || "Expert"}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0 text-white">
                                {selectedSession.expert?.user?.name || "Expert Consultation"}
                            </h5>
                            <p className="small mb-0 text-white opacity-75">
                                <i className="fa-regular fa-calendar me-1"></i>
                                {new Date(selectedSession.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-light rounded-circle p-2"
                        style={{ width: "40px", height: "40px" }}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="p-4 overflow-auto" style={{ maxHeight: "60vh" }}>
                    {chatMessages.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fa-solid fa-message fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No messages in this consultation</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {chatMessages.map((msg: any, index: number) => (
                                <div
                                    key={msg.id || index}
                                    className={`d-flex gap-3 ${msg.senderType === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div
                                        className="rounded-circle overflow-hidden flex-shrink-0"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            border: `2px solid ${msg.senderType === 'user' ? 'var(--primary)' : '#e0e0e0'}`
                                        }}
                                    >
                                        <img
                                            src={msg.senderType === 'user'
                                                ? (userAvatar || "https://avatar.iran.liara.run/public/boy?username=User")
                                                : (selectedSession.expert?.user?.avatar || "/images/dummy-astrologer.jpg")
                                            }
                                            alt={msg.senderType}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={`flex-grow-1 ${msg.senderType === 'user' ? 'text-end' : 'text-start'}`} style={{ maxWidth: "70%" }}>
                                        <div
                                            className={`p-3 rounded-3 ${msg.senderType === 'user'
                                                ? 'bg-primary bg-opacity-10 text-dark'
                                                : 'bg-light text-dark'
                                                }`}
                                            style={{
                                                borderRadius: msg.senderType === 'user' ? "20px 20px 5px 20px" : "20px 20px 20px 5px"
                                            }}
                                        >
                                            <p className="mb-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                                {msg.content}
                                            </p>
                                            <small className="text-muted" style={{ fontSize: "11px" }}>
                                                {msg.createdAt
                                                    ? new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : ''
                                                }
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-top bg-light">
                    <div className="d-flex gap-2 justify-content-between align-items-center">
                        <div className="d-flex gap-2 flex-wrap">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                                <i className="fa-solid fa-clock me-1"></i>
                                Duration: {selectedSession.durationMins || 0} mins
                            </span>
                            {selectedSession.totalCost > 0 && (
                                <span className="badge bg-dark bg-opacity-10 text-dark px-3 py-2">
                                    <i className="fa-solid fa-indian-rupee-sign me-1"></i>
                                    Cost: ₹{selectedSession.totalCost}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-secondary px-4 py-2 rounded-3"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationChatModal;
