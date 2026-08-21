"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import { getSupportSocket } from "@repo/ui/sockets";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import
import {
  getDisputeMessages,
  sendDisputeMessage,
  markDisputeMessagesRead,
  uploadClientDocument,
  getDisputeById,
} from "@/libs/api-profile";

import { DisputeMessage as Message } from "@/lib/types";

interface UserDisputeChatModalProps {
  disputeId: string; // Just ID needed
  category?: string; // Optional context
  onClose: () => void;
}

const XIcon = X as any;
const SendIcon = Send as any;
const PaperclipIcon = Paperclip as any;
const FileTextIcon = FileText as any;
const AlertCircleIcon = AlertCircle as any;

export default function UserDisputeChatModal({
  disputeId,
  category,
  onClose,
}: UserDisputeChatModalProps) {
  const { user } = useAuthStore(); // Changed usage
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userEndRequestedAt, setUserEndRequestedAt] = useState<string | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Auto-scroll functionality
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const socket = getSupportSocket();

    const joinRoom = () => {
      socket.emit("join_dispute_room", { disputeId });
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
      socket.connect();
    }

    const handleNewMessage = (message: any) => {
      const mId = message.disputeId || message.dispute_id;
      if (String(mId) === String(disputeId)) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        markDisputeMessagesRead(disputeId).catch(console.error);
      }
    };

    const handleEndChatBroadcast = (data: any) => {
      if (String(data.disputeId) === String(disputeId)) {
        setUserEndRequestedAt(new Date().toISOString());
        // No longer injecting manually - backend will send a 'new_message'
        // for the system note or it will appear on next refresh
        fetchMessages();
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("dispute_close_requested", handleEndChatBroadcast);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("new_message", handleNewMessage);
      socket.off("dispute_close_requested", handleEndChatBroadcast);
    };
  }, [disputeId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      // 1. Fetch Dispute Status for persistent banner after refresh
      const [response, disputeErr] = await getDisputeById(disputeId);
      const disputeData =
        (response as any)?.data || (response as any)?.dispute || response;

      // 2. Fetch Messages
      const [data, msgsErr] = await getDisputeMessages(disputeId);
      let msgs: Message[] = Array.isArray(data)
        ? data
        : (data as any)?.messages || (data as any)?.data || [];

      if (
        disputeData?.status === "close_requested" ||
        disputeData?.status === "resolved"
      ) {
        setUserEndRequestedAt(
          disputeData.updatedAt || new Date().toISOString(),
        );
      }

      setMessages(msgs);

      if (msgs.length > 0) {
        markDisputeMessagesRead(disputeId).catch((err) =>
          console.error("Mark read error:", err),
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [disputeId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const [msgData, sendErr] = await sendDisputeMessage(disputeId, {
        message: newMessage,
      });

      if (msgData && (msgData as any).id) {
        setMessages((prev) => [...prev, msgData as Message]);
      } else {
        fetchMessages();
      }
      setNewMessage("");
    } catch (error) {
      console.error("Send error:", error);
      toast.error(getErrorMessage(error) || "Failed to send message");
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
      const [uploadRes, uploadErr] = await uploadClientDocument(file);

      if (uploadRes && (uploadRes as any).url) {
        const attachmentType = file.type.startsWith("image")
          ? "image"
          : "document";
        const [msgData, sendErr] = await sendDisputeMessage(disputeId, {
          attachmentUrl: (uploadRes as any).url,
          attachmentType,
        });

        if (msgData && (msgData as any).id) {
          setMessages((prev) => [...prev, msgData as Message]);
        } else {
          fetchMessages();
        }
        toast.success("File sent!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(getErrorMessage(error) || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRequestEndChat = () => {
    if (window.confirm("Are you sure you want to request to end this chat?")) {
      const socket = getSupportSocket();
      socket.emit("request_end_chat", {
        disputeId,
        userId: user?.profile || user?.id,
      });
      toast.info("End chat request sent to admin");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999999] flex items-center justify-center p-4"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] md:h-[75vh] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden relative z-[10000000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b bg-linear-to-r from-orange-500 to-red-500 text-white rounded-t-2xl flex justify-between items-center shrink-0">
          <div className="flex-1 min-w-0 mr-2">
            <h2 className="text-lg font-bold flex flex-wrap items-center gap-2">
              Support Chat
              <span
                className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full truncate max-w-[120px] sm:max-w-[200px]"
                title={`#${disputeId}`}
              >
                #{disputeId}
              </span>
            </h2>
            <p className="text-xs text-white/90">
              {category || "General Issue"}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRequestEndChat}
              className="text-[10px] sm:text-xs bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 text-white whitespace-nowrap"
            >
              <AlertCircleIcon className="w-3 h-3" />
              End Chat
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 flex flex-col gap-4 relative custom-scrollbar"
          data-lenis-prevent
        >
          {/* Persistent sticky status banner if request already exists (e.g. after refresh) */}
          {userEndRequestedAt && (
            <div className="sticky top-0 z-20 flex justify-center mb-4 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-start gap-3 shadow-lg backdrop-blur-sm max-w-[95%]">
                <div className="bg-orange p-2 rounded-xl shadow-md shrink-0">
                  <AlertCircleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-orange-900 font-bold uppercase tracking-wider mb-0.5">
                    End Chat Requested
                  </span>
                  <p className="text-[11px] text-orange-800/80 font-medium leading-relaxed">
                    Your request to end this chat is being reviewed by our
                    support team. Sent at{" "}
                    {new Date(userEndRequestedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => {
            // CASE 1: System Note (End Chat Request)
            if (msg.isSystemNote || msg.is_system_note) {
              return (
                <div
                  key={`sys-${idx}`}
                  className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex flex-col items-center gap-1 shadow-sm max-w-[90%]">
                    <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                      <AlertCircleIcon className="w-4 h-4" />
                      End Chat Requested
                    </div>
                    <div className="text-[10px] text-yellow-600 font-medium italic text-center">
                      {msg.message ||
                        `End chat requested at ${new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                    </div>
                  </div>
                </div>
              );
            }

            // CASE 1.5: Automated Issue Summary (rendered as yellow card)
            if (msg.message?.includes("📋 ISSUE SUMMARY 📋")) {
              const isMe = msg.senderType === "user" || !msg.senderType; // Automated is usually user
              return (
                <div
                  key={`summary-${idx}`}
                  className={`flex flex-col w-full mb-3 ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} items-end max-w-[92%]`}
                  >
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 border-2 border-white shadow-sm relative">
                        <Image
                          src={
                            isMe
                              ? user?.profile_picture ||
                                user?.avatar ||
                                `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=f97316&color=fff&size=128`
                              : "https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&size=128"
                          }
                          alt={isMe ? "You" : "Admin"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src =
                              "https://ui-avatars.com/api/?name=User&background=f97316&color=fff&size=128";
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex flex-col items-start gap-2 shadow-sm w-full">
                        <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wider border-b border-yellow-200 pb-2 w-full">
                          <FileTextIcon className="w-4 h-4" />
                          Issue Report Details
                        </div>
                        <div className="text-[11px] text-yellow-800 font-medium whitespace-pre-wrap leading-relaxed w-full">
                          {msg.message}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {(msg as any).createdAt || (msg as any).created_at
                          ? new Date(
                              (msg as any).createdAt || (msg as any).created_at,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // CASE 2: Normal Message
            const isMe =
              msg.senderType === "user" ||
              (msg as any).sender_type === "user" ||
              (msg as any).sender_id === user?.id;
            const msgKey = msg.id ? `msg-${msg.id}-${idx}` : `idx-${idx}`;

            return (
              <div
                key={msgKey}
                className={`flex flex-col w-full mb-3 ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} items-end max-w-[90%]`}
                >
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 border-2 border-white shadow-sm relative">
                      <Image
                        src={
                          isMe
                            ? user?.profile_picture ||
                              user?.avatar ||
                              `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=f97316&color=fff&size=128`
                            : "https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&size=128"
                        }
                        alt={isMe ? "You" : "Admin"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src =
                            "https://ui-avatars.com/api/?name=User&background=f97316&color=fff&size=128";
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-orange text-white rounded-br-none"
                          : "bg-white border text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.attachmentUrl && (
                        <div className="mb-2">
                          {msg.attachmentType === "image" ? (
                            <Image
                              src={msg.attachmentUrl}
                              width={400}
                              height={300}
                              className="rounded-lg max-h-48 object-cover"
                              alt="Attachment"
                            />
                          ) : (
                            <div className="flex items-center gap-2 bg-black/10 p-2 rounded">
                              <FileTextIcon className="w-4 h-4" /> Document
                            </div>
                          )}
                        </div>
                      )}
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white rounded-b-2xl shrink-0">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              className="p-2 sm:p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-all shrink-0"
            >
              <PaperclipIcon className="w-5 h-5" />
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
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 min-w-0 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-orange outline-none text-sm"
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              disabled={!newMessage.trim() || loading}
              className="p-3 bg-orange text-white rounded-full hover:bg-orange/90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg shrink-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
