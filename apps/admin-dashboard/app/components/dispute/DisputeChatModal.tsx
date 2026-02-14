"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip, Image as ImageIcon, FileText, Download, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import type { Dispute } from "./dispute";
import { getDisputeMessages, sendDisputeMessage, markDisputeMessagesRead, updateDisputeStatus } from "@/src/services/admin.service";
import { getSupportSocket } from "@/src/utils/socket";

interface Message {
    id: number;
    disputeId: number;
    senderType: "user" | "admin";
    senderId: number;
    senderName: string;
    message?: string;
    attachmentUrl?: string;
    attachmentType?: "image" | "document" | "pdf";
    isRead: boolean;
    createdAt: string;
    isSystemNote?: boolean;
    is_system_note?: boolean;
}

interface DisputeChatModalProps {
    dispute: Dispute;
    onClose: () => void;
    isAdmin?: boolean;
}

const XIcon = X as any;
const SendIcon = Send as any;
const PaperclipIcon = Paperclip as any;
const FileTextIcon = FileText as any;
const AlertCircleIcon = AlertCircle as any;
const DownloadIcon = Download as any;

export function DisputeChatModal({ dispute, onClose, isAdmin = true }: DisputeChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [endRequested, setEndRequested] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync persistent request state from dispute prop
    useEffect(() => {
        if (dispute.status === "close_requested") {
            setEndRequested(true);
        }
    }, [dispute.id, dispute.status]);

    // Socket setup
    useEffect(() => {
        const socket = getSupportSocket();

        console.log("🔍 [AdminSocket] Initial State:", {
            connected: socket.connected,
            id: socket.id,
            disputeId: dispute.id
        });

        const joinRoom = () => {
            console.log("🏠 [AdminSocket] Emitting join_dispute_room for ID:", dispute.id);
            socket.emit("join_dispute_room", { disputeId: Number(dispute.id) });
        };

        const onConnect = () => {
            console.log("🔌 [AdminSocket] Connected! Socket ID:", socket.id);
            joinRoom();
        };

        const onDisconnect = (reason: string) => {
            console.log("🔌 [AdminSocket] Disconnected. Reason:", reason);
        };

        const onConnectError = (error: any) => {
            console.error("❌ [AdminSocket] Connection Error:", error);
        };

        // Event listeners
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);

        // Catch-all for debugging: THIS IS CRITICAL TO SEE WHAT BACKEND SENDS
        socket.onAny((eventName, ...args) => {
            console.log(`📡 [AdminSocket LOG-ALL] Event Name: "${eventName}"`, "Arguments:", args);
        });

        if (socket.connected) {
            onConnect();
        } else {
            console.log("🔌 [AdminSocket] Attempting manual connection...");
            socket.connect();
        }

        const handleNewMessage = (message: Message) => {
            console.log("📩 [AdminSocket] New message received:", message);
            if (Number(message.disputeId) === Number(dispute.id)) {
                setMessages((prev) => {
                    const exists = prev.some(m => m.id === message.id);
                    if (exists) return prev;
                    return [...prev, message];
                });
            }
        };

        const handleEndChatRequest = (data: any) => {
            console.log("🚨 [AdminSocket] END CHAT REQUEST RECEIVED!", data);
            // Check if the IDs match
            const incomingId = Number(data.disputeId);
            const currentId = Number(dispute.id);

            console.log("📊 [AdminSocket] ID Compare:", { incomingId, currentId, match: incomingId === currentId });

            if (incomingId === currentId) {
                setEndRequested(true);
                toast.info("User has requested to end this chat", {
                    autoClose: false,
                    toastId: `end-chat-${dispute.id}`
                });
            }
        };

        socket.on("new_message", handleNewMessage);

        // Listen to BOTH names just in case
        socket.on("dispute_close_requested", handleEndChatRequest);
        socket.on("request_end_chat", handleEndChatRequest);

        return () => {
            console.log("👋 [AdminSocket] Cleaning up listeners for dispute:", dispute.id);
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("new_message");
            socket.off("dispute_close_requested", handleEndChatRequest);
            socket.off("request_end_chat", handleEndChatRequest);
            socket.offAny();
        };
    }, [dispute.id]);

    // Initial fetch
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                console.log("🔄 [AdminAPI] Fetching messages for dispute:", dispute.id);
                const data = await getDisputeMessages(dispute.id);
                let msgs: Message[] = Array.isArray(data) ? data : (data.messages || data.data || []);

                // If dispute is in close_requested status, set top banner
                if (dispute.status === "close_requested" || dispute.status === "resolved") {
                    setEndRequested(true);
                }

                console.log("📥 [AdminAPI] Messages fetched:", msgs.length);
                setMessages(msgs);

                if (msgs.length > 0) {
                    markDisputeMessagesRead(dispute.id).catch(err => console.error("Mark read error:", err));
                }
            } catch (error) {
                console.error("❌ [AdminAPI] Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [dispute.id, dispute.status]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            setLoading(true);
            const payload = {
                message: newMessage,
            };

            await sendDisputeMessage(dispute.id, payload);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        try {
            setUploading(true);
            const mockMessage: Message = {
                id: Date.now(),
                disputeId: dispute.id,
                senderType: "admin",
                senderId: 1,
                senderName: "Admin",
                message: `Sent a ${file.type.startsWith("image") ? "photo" : "file"}`,
                attachmentUrl: URL.createObjectURL(file),
                attachmentType: file.type.startsWith("image") ? "image" : "document",
                isRead: false,
                createdAt: new Date().toISOString(),
            };

            setMessages([...messages, mockMessage]);
            toast.success("File uploaded!");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleCloseDispute = async () => {
        if (!window.confirm("Are you sure you want to mark this dispute as resolved and close the chat?")) return;

        try {
            setIsClosing(true);
            console.log("🚀 [AdminAPI] Closing dispute:", dispute.id);
            await updateDisputeStatus(dispute.id, { status: "resolved", notes: "Closed by admin upon user request." });
            toast.success("Dispute marked as resolved.");
            onClose();
        } catch (error) {
            console.error("❌ [AdminAPI] Error closing dispute:", error);
            toast.error("Failed to close dispute");
        } finally {
            setIsClosing(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Dispute Chat</h2>
                        <p className="text-sm text-white/90">
                            {dispute.disputeId || `#${dispute.id}`} • {dispute.category || "General"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleCloseDispute}
                            disabled={isClosing}
                            className="bg-white text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {isClosing ? "Closing..." : "Close Dispute"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* User End Request Banner (Sticky at top of chat area) */}
                {endRequested && (
                    <div className="sticky top-0 z-10 bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center justify-between animate-pulse shadow-sm">
                        <div className="flex items-center gap-3 text-blue-700">
                            <AlertCircleIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold italic">User has requested to end this chat.</span>
                        </div>
                        <button
                            className="text-blue-700 font-bold text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition-all"
                            onClick={handleCloseDispute}
                        >
                            Resolve Now
                        </button>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-3 relative">
                    {loading && messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => {
                                // CASE 1: System Note (End Chat Request)
                                if (msg.is_system_note || msg.isSystemNote) {
                                    return (
                                        <div key={`sys-${idx}`} className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-3 flex flex-col items-center gap-1 shadow-sm max-w-[80%]">
                                                <div className="flex items-center gap-2 text-yellow-700 font-bold text-sm uppercase tracking-wider">
                                                    <AlertCircleIcon className="w-5 h-5" />
                                                    User Requested to End Chat
                                                </div>
                                                <div className="text-xs text-yellow-600 font-medium italic text-center">
                                                    {msg.message || `This request was made at ${new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}`}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // CASE 2: Normal Message
                                return <MessageBubble key={msg.id ? `msg-${msg.id}` : `idx-${idx}`} message={msg} isAdmin={isAdmin} />;
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white rounded-b-2xl flex-shrink-0">
                    <div className="flex gap-3 items-end">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
                        >
                            {uploading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                            ) : (
                                <PaperclipIcon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your message..."
                            rows={1}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                        />

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            disabled={loading || !newMessage.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ message, isAdmin }: { message: Message; isAdmin: boolean }) {
    const isSentByMe = isAdmin
        ? message.senderType === "admin"
        : message.senderType === "user";

    return (
        <div className={`flex flex-col !w-full mb-3 ${isSentByMe ? "items-end" : "items-start"}`}>
            <div className={`flex gap-2 ${isSentByMe ? "flex-row-reverse" : "flex-row"} items-end max-w-[85%]`}>
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 border-2 border-white shadow-sm">
                        <img
                            src={isSentByMe
                                ? "https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff&size=128"
                                : "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=128"
                            }
                            alt={isSentByMe ? "Admin" : "User"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"} gap-1`}>
                    {!isSentByMe && (
                        <span className="text-xs text-gray-500 font-semibold px-2">
                            {message.senderName}
                        </span>
                    )}

                    <div
                        className={`px-4 py-3 rounded-2xl ${isSentByMe
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                            }`}
                    >
                        {message.attachmentUrl && (
                            <div className="mb-2">
                                {message.attachmentType === "image" ? (
                                    <img
                                        src={message.attachmentUrl}
                                        alt="Attachment"
                                        className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                                    />
                                ) : (
                                    <a
                                        href={message.attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 p-3 rounded-lg ${isSentByMe ? "bg-white/20" : "bg-gray-100"}`}
                                    >
                                        <FileTextIcon className="w-5 h-5" />
                                        <span className="text-sm font-medium">Document</span>
                                        <DownloadIcon className="w-4 h-4 ml-auto" />
                                    </a>
                                )}
                            </div>
                        )}

                        {message.message && (
                            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        )}
                    </div>

                    <span className="text-xs text-gray-400 px-2 mt-1">
                        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }) : ""}
                    </span>
                </div>
            </div>
        </div>
    );
}
