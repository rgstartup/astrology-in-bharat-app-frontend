"use client"
import React, { useState, useEffect, useRef } from "react";

interface Message {
    id: number;
    text: string;
    sender: "user" | "astrologer";
    time: string;
}

const ChatPage = () => {
    const astrologerName = "Astrologer";

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: `Hello! I am ${astrologerName}. How can I help you today?`, sender: "astrologer", time: "10:00 AM" }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: "user",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText("");

        setTimeout(() => {
            const responseMessage: Message = {
                id: Date.now() + 1,
                text: "Let me check your charts. Please give me a moment.",
                sender: "astrologer",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, responseMessage]);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="d-flex flex-column" style={{ height: "85vh", background: "#ffe3b852", marginBottom: "100px" }}>

            {/* Chat Header */}
            <div className="chat-header p-3 text-white d-flex align-items-center justify-content-between"
                style={{
                    background: "linear-gradient(135deg, #732882 0%, #8e3a9e 100%)",
                    boxShadow: "0 4px 20px rgba(115, 40, 130, 0.25)",
                    backdropFilter: "blur(10px)"
                }}>
                <div className="d-flex align-items-center">
                    <a href="/" className="text-white me-3 d-flex align-items-center justify-content-center text-decoration-none"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.15)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </a>
                    <div className="position-relative">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Astro"
                            className="rounded-circle"
                            width="50"
                            height="50"
                            style={{
                                border: "3px solid #ffc107",
                                boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)"
                            }}
                        />
                        <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                            style={{
                                width: "14px",
                                height: "14px",
                                boxShadow: "0 2px 8px rgba(40, 167, 69, 0.5)"
                            }}></span>
                    </div>
                    <div className="ms-3">
                        <h6 className="mb-0 fw-bold" style={{ letterSpacing: "0.3px" }}>{astrologerName}</h6>
                        <small className="text-warning d-flex align-items-center" style={{ fontSize: "12px", fontWeight: "500" }}>
                            <i className="fa-solid fa-clock me-1"></i>00:15:00 Remaining
                        </small>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-light rounded-pill px-3"
                        style={{
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            transition: "all 0.3s ease",
                            fontWeight: "500"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                        }}>
                        <i className="fa-solid fa-phone me-1"></i>
                    </button>
                    <button className="btn btn-sm btn-danger rounded-pill px-3"
                        style={{
                            fontWeight: "500",
                            boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                        End Session
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow-1 overflow-auto p-3 p-md-4"
                style={{
                    background: "transparent",
                }}>
                <style>{`
                    @keyframes messageSlideIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">

                            {messages.map((msg, index) => (
                                <div key={msg.id}
                                    className={`d-flex mb-4 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                                    style={{
                                        animation: "messageSlideIn 0.4s ease",
                                        animationDelay: `${index * 0.05}s`,
                                        animationFillMode: "both"
                                    }}>
                                    {msg.sender === 'astrologer' && (
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                            width="38"
                                            height="38"
                                            className="rounded-circle me-2 align-self-end"
                                            alt="Astro"
                                            style={{
                                                border: "2px solid #ffc107",
                                                boxShadow: "0 2px 10px rgba(255, 193, 7, 0.2)"
                                            }}
                                        />
                                    )}

                                    <div className="d-flex flex-column" style={{ maxWidth: "70%" }}>
                                        <div
                                            className={`p-3 position-relative ${msg.sender === 'user' ? 'text-white' : 'text-dark bg-white'}`}
                                            style={{
                                                background: msg.sender === 'user'
                                                    ? 'linear-gradient(135deg, #732882 0%, #8e3a9e 100%)'
                                                    : '#ffffff',
                                                borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                                boxShadow: msg.sender === 'user'
                                                    ? '0 8px 24px rgba(115, 40, 130, 0.25)'
                                                    : '0 8px 24px rgba(0, 0, 0, 0.08)',
                                                transition: "all 0.3s ease",
                                                fontSize: "15px",
                                                lineHeight: "1.6"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = msg.sender === 'user'
                                                    ? '0 12px 32px rgba(115, 40, 130, 0.35)'
                                                    : '0 12px 32px rgba(0, 0, 0, 0.12)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = msg.sender === 'user'
                                                    ? '0 8px 24px rgba(115, 40, 130, 0.25)'
                                                    : '0 8px 24px rgba(0, 0, 0, 0.08)';
                                            }}>
                                            <p className="mb-0">{msg.text}</p>
                                        </div>
                                        <small
                                            className={`text-muted mt-1 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: "500",
                                                opacity: "0.7"
                                            }}>
                                            {msg.time}
                                        </small>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />

                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Input */}
            <div className="chat-footer p-3 bg-white"
                style={{
                    boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.08)",
                    borderTop: "1px solid rgba(115, 40, 130, 0.1)"
                }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    type="button"
                                    className="btn text-secondary rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        background: "linear-gradient(135deg, #f8f4fc 0%, #fef9f3 100%)",
                                        border: "2px solid rgba(115, 40, 130, 0.1)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#732882";
                                        e.currentTarget.style.borderColor = "#732882";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        const icon = e.currentTarget.querySelector('i');
                                        if (icon) (icon as HTMLElement).style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(135deg, #f8f4fc 0%, #fef9f3 100%)";
                                        e.currentTarget.style.borderColor = "rgba(115, 40, 130, 0.1)";
                                        e.currentTarget.style.transform = "scale(1)";
                                        const icon = e.currentTarget.querySelector('i');
                                        if (icon) (icon as HTMLElement).style.color = "";
                                    }}>
                                    <i className="fa-solid fa-paperclip"></i>
                                </button>
                                <div className="flex-grow-1 position-relative">
                                    <input
                                        type="text"
                                        className="form-control rounded-pill border-0 py-3 px-4"
                                        placeholder="Type your message..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        style={{
                                            paddingRight: "50px",
                                            background: "linear-gradient(135deg, #f8f4fc 0%, #fef9f3 100%)",
                                            fontSize: "15px",
                                            boxShadow: "inset 0 2px 8px rgba(115, 40, 130, 0.05)",
                                            transition: "all 0.3s ease"
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.boxShadow = "inset 0 2px 12px rgba(115, 40, 130, 0.1), 0 0 0 3px rgba(115, 40, 130, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.boxShadow = "inset 0 2px 8px rgba(115, 40, 130, 0.05)";
                                        }}
                                    />
                                    <i className="fa-regular fa-face-smile position-absolute text-warning"
                                        style={{
                                            right: "20px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-50%) scale(1.2)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                                        }}></i>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    className={`btn rounded-circle d-flex align-items-center justify-content-center ${inputText.trim() ? '' : 'disabled'}`}
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        background: inputText.trim()
                                            ? "linear-gradient(135deg, #732882 0%, #8e3a9e 100%)"
                                            : "#e0e0e0",
                                        border: "none",
                                        boxShadow: inputText.trim()
                                            ? "0 6px 20px rgba(115, 40, 130, 0.35)"
                                            : "none",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (inputText.trim()) {
                                            e.currentTarget.style.transform = "scale(1.08)";
                                            e.currentTarget.style.boxShadow = "0 8px 28px rgba(115, 40, 130, 0.45)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = inputText.trim()
                                            ? "0 6px 20px rgba(115, 40, 130, 0.35)"
                                            : "none";
                                    }}>
                                    <i className="fa-solid fa-paper-plane text-white"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ChatPage;

