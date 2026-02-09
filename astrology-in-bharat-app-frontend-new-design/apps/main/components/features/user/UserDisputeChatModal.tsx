"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip, Image as ImageIcon, FileText, Download } from "lucide-react";
import { toast } from "react-toastify";
import { getNotificationSocket, getSupportSocket } from "@packages/ui/src/utils/socket";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { getDisputeMessages, sendDisputeMessage, markDisputeMessagesRead, uploadClientDocument } from "@/libs/api-profile";

// Define message types locally since we can't import from admin
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

interface UserDisputeChatModalProps {
    disputeId: number; // Just ID needed
    category?: string; // Optional context
    onClose: () => void;
}

export default function UserDisputeChatModal({ disputeId, category, onClose }: UserDisputeChatModalProps) {
    const { clientUser } = useClientAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll functionality
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const socket = getSupportSocket();

        if (!socket.connected) {
            socket.on('connect', () => {
                socket.emit('join_dispute_room', { disputeId });
            });
            socket.connect();
        } else {
            socket.emit('join_dispute_room', { disputeId });
        }

        const handleNewMessage = (message: any) => {
            if (Number(message.disputeId) === Number(disputeId)) {
                setMessages((prev) => {
                    if (prev.some(m => m.id === message.id)) return prev;
                    return [...prev, message];
                });
                markDisputeMessagesRead(disputeId).catch(console.error);
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [disputeId]);

    // Initial fetch
    useEffect(() => {
        fetchMessages();
    }, [disputeId]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getDisputeMessages(disputeId);
            const msgs = Array.isArray(data) ? data : (data.messages || data.data || []);
            console.log("User App Chat Messages:", msgs); // Debug: Check values
            setMessages(msgs);

            if (msgs.length > 0) {
                markDisputeMessagesRead(disputeId).catch(err => console.error("Mark read error:", err));
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            // toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            setLoading(true);
            const msgData = await sendDisputeMessage(disputeId, { message: newMessage });

            if (msgData && msgData.id) {
                setMessages((prev) => [...prev, msgData]);
            } else {
                fetchMessages();
            }
            setNewMessage("");
        } catch (error) {
            console.error("Send error:", error);
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
            const uploadRes = await uploadClientDocument(file);

            if (uploadRes && uploadRes.url) {
                const attachmentType = file.type.startsWith("image") ? "image" : "document";
                const msgData = await sendDisputeMessage(disputeId, {
                    attachmentUrl: uploadRes.url,
                    attachmentType
                });

                if (msgData && msgData.id) {
                    setMessages((prev) => [...prev, msgData]);
                } else {
                    fetchMessages();
                }
                toast.success("File sent!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col mx-4 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="px-5 py-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            Support Chat
                            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                                #{disputeId}
                            </span>
                        </h2>
                        <p className="text-xs text-white/90">{category || "General Issue"}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                    {messages.map((msg) => {
                        const isMe = msg.senderType === "user";

                        return (
                            <div key={msg.id} className={`flex flex-col !w-full mb-3 ${isMe ? "items-end" : "items-start"}`}>
                                {/* Profile Picture + Message */}
                                <div className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} items-end max-w-[85%]`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 border-2 border-white shadow-sm">
                                            <img
                                                src={isMe
                                                    ? "https://ui-avatars.com/api/?name=User&background=f97316&color=fff&size=128"
                                                    : "https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&size=128"
                                                }
                                                alt={isMe ? "You" : "Admin"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                            ? "bg-orange-500 text-white rounded-br-none"
                                            : "bg-white border text-gray-800 rounded-bl-none"
                                            }`}>
                                            {msg.attachmentUrl && (
                                                <div className="mb-2">
                                                    {msg.attachmentType === "image" ? (
                                                        <img src={msg.attachmentUrl} className="rounded-lg max-h-48 object-cover" />
                                                    ) : (
                                                        <div className="flex items-center gap-2 bg-black/10 p-2 rounded">
                                                            <FileText className="w-4 h-4" /> Document
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {msg.message}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white rounded-b-2xl">
                    <div className="flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        />

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            disabled={!newMessage.trim() || loading}
                            className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
