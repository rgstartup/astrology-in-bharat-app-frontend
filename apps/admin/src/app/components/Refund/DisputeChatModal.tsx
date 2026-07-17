"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip, FileText, Download, AlertCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import { getDisputeMessages, sendDisputeMessage, markDisputeMessagesRead, updateDisputeStatus } from "@/services/admin.service";
import { getSupportSocket } from "@/utils/socket";

interface Message {
    id: string;
    dispute_id?: string;
    sender_type?: "user" | "admin";
    sender_name?: string;
    message?: string;
    attachment_url?: string;
    attachment_type?: "image" | "document" | "pdf";
    created_at?: string;
    is_system_note?: boolean;
}

interface DisputeChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    dispute: any;
    onStatusUpdate: (status: string, notes?: string) => void;
}

export function DisputeChatModal({ isOpen, onClose, dispute, onStatusUpdate }: DisputeChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Socket setup
    useEffect(() => {
        if (!isOpen) return;
        
        const socket = getSupportSocket();
        
        const onConnect = () => {
            socket.emit("join_dispute_room", { disputeId: String(dispute.realId) });
            socket.emit("register_admin");
        };

        if (socket.connected) {
            onConnect();
        } else {
            socket.connect();
            socket.on("connect", onConnect);
        }

        const handleNewMessage = (message: any) => {
            if (String(message.dispute_id || message.disputeId) === String(dispute.realId)) {
                setMessages((prev) => {
                    const exists = prev.some(m => m.id === message.id);
                    if (exists) return prev;
                    return [...prev, message];
                });
            }
        };

        const handleEndChatBroadcast = (data: any) => {
            if (String(data.disputeId) === String(dispute.realId)) {
                toast.warning(`User has requested to end this chat.`);
                setMessages((prev) => [
                    ...prev, 
                    {
                        id: `sys-${Date.now()}`,
                        message: "User has requested to end this chat.",
                        sender_type: "user",
                        is_system_note: true,
                        created_at: new Date().toISOString()
                    } as Message
                ]);
            }
        };

        socket.on("new_message", handleNewMessage);
        socket.on("dispute_close_requested", handleEndChatBroadcast);

        return () => {
            socket.off("connect", onConnect);
            socket.off("new_message", handleNewMessage);
            socket.off("dispute_close_requested", handleEndChatBroadcast);
        };
    }, [isOpen, dispute.realId]);

    // Initial fetch
    useEffect(() => {
        if (!isOpen) return;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const [data, error] = await getDisputeMessages(dispute.realId);
                if (error) {
                    console.error("Error fetching messages:", error);
                    return;
                }
                const msgs = Array.isArray(data) ? data : (data?.data || data?.messages || []);
                setMessages(msgs);
                
                if (msgs.length > 0) {
                    markDisputeMessagesRead(dispute.realId).catch(() => {});
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [isOpen, dispute.realId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const [, error] = await sendDisputeMessage(dispute.realId, { message: newMessage });
            if (error) {
                toast.error(getErrorMessage(error) || "Failed to send message");
                return;
            }
            setNewMessage("");
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        toast.info("File upload not fully implemented in this demo, but would use sendDisputeMessage with attachmentUrl");
    };

    const handleUpdateStatus = async (status: string) => {
        let reason = '';
        if (status === 'refunded') {
            const promptResult = window.prompt("Please enter the reason for deducting money from the merchant's wallet (e.g. 'Product damaged'):");
            if (!promptResult) {
                toast.error("Refund cancelled. Reason is required.");
                return;
            }
            reason = promptResult;
        }

        setIsProcessing(true);
        try {
            await onStatusUpdate(status, reason);
            
            // Notify user in chat about the status change
            let statusText = status === "refunded" ? "approved and marked as refunded" : status === "rejected" ? "rejected" : "marked as pending";
            let msg = `SYSTEM NOTE: Admin has ${statusText} this request.`;
            if (reason) msg += ` Reason: ${reason}`;

            await sendDisputeMessage(dispute.realId, { 
                message: msg,
            });
            
            toast.success(`User notified about status change to ${status}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-orange to-red-600 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Dispute Management</h2>
                        <p className="text-sm opacity-90">#{dispute.id} • {dispute.category}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar: Details & Actions */}
                    <div className="w-80 border-r bg-gray-50 flex flex-col p-6 overflow-y-auto">
                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Request Details</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div>
                                <span className="text-xs text-gray-500 block">User</span>
                                <p className="font-semibold text-gray-900">{dispute.user.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Expert</span>
                                <p className="font-semibold text-gray-900">{dispute.expert.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Amount</span>
                                <p className="font-bold text-emerald-600">₹{dispute.amount}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Reason</span>
                                <p className="text-sm text-gray-700">{dispute.reason}</p>
                            </div>
                        </div>

                        {dispute.orderDetails && (
                            <>
                                <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider border-t pt-4">Order Details</h3>
                                <div className="space-y-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div>
                                        <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Product Name</span>
                                        <p className="font-semibold text-gray-900 text-sm line-clamp-2" title={dispute.orderDetails.productName}>{dispute.orderDetails.productName || 'Unknown Product'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Status</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                dispute.orderDetails.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                                                dispute.orderDetails.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {dispute.orderDetails.status || 'PENDING'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Shop Name</span>
                                            <p className="font-semibold text-gray-900 text-sm line-clamp-1" title={dispute.orderDetails.merchantName}>{dispute.orderDetails.merchantName}</p>
                                        </div>
                                    </div>
                                    {dispute.orderDetails.deliveryDate && (
                                        <div>
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Updated / Delivered At</span>
                                            <p className="text-sm text-gray-700">{new Date(dispute.orderDetails.deliveryDate).toLocaleString()}</p>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-gray-50 border-dashed">
                                        <span className="text-[9px] text-gray-400 block font-mono break-all">ID: {dispute.orderDetails.productId || 'N/A'}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Update Status</h3>
                        <div className="space-y-3">
                            <button 
                                disabled={isProcessing || dispute.status === "refunded" || dispute.status === "approved"}
                                onClick={() => handleUpdateStatus("refunded")}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Mark Refunded
                            </button>
                            <button 
                                disabled={isProcessing || dispute.status === "pending"}
                                onClick={() => handleUpdateStatus("pending")}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                                Mark Pending
                            </button>
                            <button 
                                disabled={isProcessing || dispute.status === "rejected"}
                                onClick={() => handleUpdateStatus("rejected")}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject Request
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <RefreshCw className="w-8 h-8 text-orange animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No messages yet</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    if (msg.is_system_note || (msg as any).isSystemNote || msg.message?.startsWith("SYSTEM NOTE:")) {
                                        return (
                                            <div key={idx} className="flex justify-center my-2">
                                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 max-w-[80%] text-center">
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    {msg.message}
                                                </div>
                                            </div>
                                        );
                                    }

                                    const isSenderAdmin = msg.sender_type === 'admin' || (msg as any).senderType === 'admin';
                                    return (
                                        <div key={idx} className={`flex ${isSenderAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                                                isSenderAdmin 
                                                ? 'bg-orange text-white rounded-br-none' 
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <span className="text-[10px] opacity-70 mt-2 block">
                                                    {new Date(msg.created_at || (msg as any).createdAt || '').toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your reply..."
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
