"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip, Image as ImageIcon, FileText, Download } from "lucide-react";
import { toast } from "react-toastify";
import type { Dispute } from "./dispute";
import { getDisputeMessages, sendDisputeMessage, markDisputeMessagesRead } from "@/src/services/admin.service";
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
}

interface DisputeChatModalProps {
    dispute: Dispute;
    onClose: () => void;
    isAdmin?: boolean;
}

export function DisputeChatModal({ dispute, onClose, isAdmin = true }: DisputeChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Socket setup
    useEffect(() => {
        const socket = getSupportSocket();

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join_dispute_room", { disputeId: dispute.id });

        const handleNewMessage = (message: Message) => {
            if (message.disputeId === dispute.id) {
                setMessages((prev) => {
                    const exists = prev.some(m => m.id === message.id);
                    if (exists) return prev;
                    return [...prev, message];
                });
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message");
        };
    }, [dispute.id]);

    // Initial fetch
    useEffect(() => {
        fetchMessages();
    }, [dispute.id]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getDisputeMessages(dispute.id);
            const msgs = Array.isArray(data) ? data : (data.messages || data.data || []);
            console.log("Chat Messages Received:", msgs); // Debug: Check senderType values
            setMessages(msgs);

            if (msgs.length > 0) {
                markDisputeMessagesRead(dispute.id).catch(err => console.error("Mark read error:", err));
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            // toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await markDisputeMessagesRead(dispute.id);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

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

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        try {
            setUploading(true);

            // TODO: Upload to Cloudinary or backend
            // const formData = new FormData();
            // formData.append("file", file);
            // const response = await api.post(`/support/disputes/upload`, formData);

            // Mock: Create message with attachment
            const mockMessage: Message = {
                id: Date.now(),
                disputeId: dispute.id,
                senderType: isAdmin ? "admin" : "user",
                senderId: 1,
                senderName: isAdmin ? "Admin" : "User",
                message: `Sent a ${file.type.startsWith("image") ? "photo" : "file"}`,
                attachmentUrl: URL.createObjectURL(file), // Mock URL
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

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Dispute Chat</h2>
                        <p className="text-sm text-white/90">
                            {dispute.disputeId || `#${dispute.id}`} • {dispute.category || "General"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-3">
                    {loading && messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} isAdmin={isAdmin} />
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white rounded-b-2xl">
                    <div className="flex gap-3 items-end">
                        {/* File Upload */}
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
                            title="Attach file"
                        >
                            {uploading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                            ) : (
                                <Paperclip className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {/* Message Input */}
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your message..."
                            rows={1}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                        />

                        {/* Send Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            disabled={loading || !newMessage.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Message Bubble Component
function MessageBubble({ message, isAdmin }: { message: Message; isAdmin: boolean }) {
    const isSentByMe = isAdmin
        ? message.senderType === "admin"
        : message.senderType === "user";

    return (
        <div className={`flex flex-col !w-full mb-3 ${isSentByMe ? "items-end" : "items-start"}`}>
            {/* Profile Picture + Message Container */}
            <div className={`flex gap-2 ${isSentByMe ? "flex-row-reverse" : "flex-row"} items-end max-w-[85%]`}>
                {/* Avatar */}
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

                {/* Message Bubble */}
                <div className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"} gap-1`}>
                    {/* Sender Name */}
                    {!isSentByMe && (
                        <span className="text-xs text-gray-500 font-semibold px-2">
                            {message.senderName}
                        </span>
                    )}

                    {/* Message Content */}
                    <div
                        className={`px-4 py-3 rounded-2xl ${isSentByMe
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                            }`}
                    >
                        {/* Attachment */}
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
                                        className={`flex items-center gap-2 p-3 rounded-lg ${isSentByMe ? "bg-white/20" : "bg-gray-100"
                                            }`}
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span className="text-sm font-medium">Document</span>
                                        <Download className="w-4 h-4 ml-auto" />
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Text Message */}
                        {message.message && (
                            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-gray-400 px-2 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}
