"use client";

import React from "react";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { Avatar } from "@repo/ui";

const Image = NextImage as any;
const { Paperclip, FileText, MapPin } = LucideIcons as any;

type MessageAreaProps = {
    isDarkMode: boolean;
    sessionStatus: string;
    sessionSummary: any;
    messages: ChatMessage[];
    expertData: any;
    typingStatus: { senderName: string; isTyping: boolean } | null;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    user?: any;
};

export default function MessageArea({
    isDarkMode,
    sessionStatus,
    sessionSummary,
    messages,
    expertData,
    typingStatus,
    messagesEndRef,
    user
}: MessageAreaProps) {
    const [mounted, setMounted] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div 
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative"
            data-lenis-prevent
        >
            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button 
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full"
                            onClick={() => setPreviewImage(null)}
                        >
                            <LucideIcons.X className="w-6 h-6" />
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/20"
                            onClick={(e) => e.stopPropagation()} 
                        />
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-center mb-10">
                    <div className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all border ${sessionSummary?.status === 'terminated' ? 'bg-red-500/10 text-red-500 border-red-500/20' : isDarkMode ? 'bg-white/5 opacity-30 border-white/5' : 'bg-[#fd6410]/10 text-[#fd6410] border-[#fd6410]/20'}`}>
                        {sessionStatus === 'active' ? 'Consultation in Progress' : (sessionStatus === 'completed' && sessionSummary?.status === 'terminated') ? 'Session Terminated by Admin' : sessionStatus === 'completed' ? 'Session Ended' : 'Start your celestial journey'}
                    </div>
                </div>

                {messages.map((msg: ChatMessage) => {
                    const mSenderType = msg.senderType || (msg as any).sender_type;
                    const isUser = mSenderType === "user";
                    const isAdmin = mSenderType === "admin";

                    return (
                        <div key={msg.id} className={`flex gap-3 md:gap-4 ${isUser ? "flex-row-reverse" : "flex-row"} items-start ${isAdmin ? "justify-center w-full" : ""}`}>
                            {!isAdmin && (
                                <div className="flex-shrink-0 mt-1">
                                    <div className={`w-8 h-8 rounded-full border-2 ${isUser ? 'border-[#fd6410]/30' : 'border-black/5'} overflow-hidden shadow-sm flex items-center justify-center bg-gray-100`}>
                                        {isUser ? (
                                            <Avatar
                                                src={user?.avatar || user?.profile_picture}
                                                alt={user?.name || "User"}
                                                size="sm"
                                                fallback="/images/default-avatar.svg"
                                                className="border-gray-200"
                                            />
                                        ) : (
                                            <Avatar
                                                src={expertData?.image}
                                                alt={expertData?.name || "Expert"}
                                                size="sm"
                                                fallback="/images/dummy-expert.jpg"
                                                className="border-gray-200"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className={`flex flex-col gap-1.5 max-w-[75%] md:max-w-[70%] ${isAdmin ? "items-center w-full" : ""}`}>
                                <div className={`${msg.content.startsWith('[INTRO_CARD]') ? '' : `px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                    isAdmin 
                                        ? "bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-center w-full shadow-red-100" 
                                        : isUser 
                                            ? 'bg-[#fd6410] text-white rounded-tr-none' 
                                            : isDarkMode 
                                                ? 'bg-white/10 text-white rounded-tl-none' 
                                                : 'bg-white text-gray-800 border border-black/5 rounded-tl-none font-medium'
                                }`}`}>
                                    {isAdmin && (
                                        <div className="flex items-center justify-center gap-2 mb-1 text-[10px] font-black uppercase tracking-tighter">
                                            <LucideIcons.AlertCircle className="w-3 h-3" /> System Intervention
                                        </div>
                                    )}
                                    {msg.content.startsWith('[INTRO_CARD]') ? (
                                        <div className="bg-gradient-to-br from-[#FFD700] via-[#FFEA00] to-[#FFD700] p-0.5 rounded-2xl shadow-lg border border-black/10 w-full min-w-[240px]">
                                            <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                                                    <LucideIcons.User className="w-16 h-16 text-black" />
                                                </div>
                                                <div className="flex items-center gap-2 mb-4 border-b border-black/10 pb-3 relative z-10">
                                                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                                                        <LucideIcons.User className="w-4 h-4 text-black" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-black font-black text-xs uppercase tracking-widest">Birth Details</h3>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                                    {(() => {
                                                        try {
                                                            const data = JSON.parse(msg.content.replace('[INTRO_CARD]', ''));
                                                            
                                                            const formatDate = (dateStr: string) => {
                                                                if (!dateStr) return "N/A";
                                                                try {
                                                                    // Check if it's already a formatted string like DD/MM/YYYY or YYYY-MM-DD
                                                                    if (dateStr.includes('/') || dateStr.includes('-')) {
                                                                        const parsedDate = new Date(dateStr);
                                                                        if (!isNaN(parsedDate.getTime())) {
                                                                            return parsedDate.toLocaleDateString();
                                                                        }
                                                                        return dateStr;
                                                                    }
                                                                    return dateStr;
                                                                } catch (e) {
                                                                    return dateStr;
                                                                }
                                                            };

                                                            return (
                                                                <>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Name</span>
                                                                        <p className="text-sm font-black text-black truncate">{data.name || "N/A"}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Gender</span>
                                                                        <p className="text-sm font-black text-black capitalize">{data.gender || "N/A"}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">DOB</span>
                                                                        <p className="text-sm font-black text-black">{formatDate(data.dob || data.dateOfBirth)}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Time</span>
                                                                        <p className="text-sm font-black text-black">{data.tob || data.timeOfBirth || "N/A"}</p>
                                                                    </div>
                                                                    <div className="space-y-1 col-span-2">
                                                                        <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Place</span>
                                                                        <p className="text-sm font-black text-black truncate">{data.pob || data.placeOfBirth || "N/A"}</p>
                                                                    </div>
                                                                </>
                                                            );
                                                        } catch (e) {
                                                            return <p className="text-xs text-black/50">Error parsing details</p>;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {(msg.attachmentUrl || (msg as any).attachment_url) && (
                                                <div className="mb-2 max-w-sm rounded-xl overflow-hidden border border-black/5 shadow-sm">
                                                    {(msg.attachmentType === 'image' || (msg as any).attachment_type === 'image' || 
                                                      (msg.attachmentUrl || (msg as any).attachment_url)?.match(/\.(jpg|jpeg|png|gif|webp)$|images/i)
                                                    ) ? (
                                                        <div 
                                                            className="block w-full cursor-pointer"
                                                            onClick={() => setPreviewImage(msg.attachmentUrl || (msg as any).attachment_url)}
                                                        >
                                                            <img 
                                                                src={msg.attachmentUrl || (msg as any).attachment_url} 
                                                                alt="attachment" 
                                                                className="w-full max-h-60 object-cover hover:opacity-90 transition-opacity" 
                                                                onError={(e) => {
                                                                    (e.target as any).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <a href={msg.attachmentUrl || (msg as any).attachment_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg ${isUser ? 'bg-white/10' : 'bg-black/5'} transition-colors`}>
                                                            <div className="p-1.5 bg-orange-500 rounded flex-shrink-0">
                                                                <FileText className="w-3.5 h-3.5 text-white" />
                                                            </div>
                                                            <span className="text-xs truncate font-bold">Document Attachment</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            <p className={`text-sm leading-relaxed ${isAdmin ? "font-black" : ""}`}>{msg.content}</p>
                                        </>
                                    )}
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-tighter opacity-40 px-1 ${isUser ? 'text-right' : isAdmin ? 'text-center' : 'text-left'} ${isAdmin ? 'text-red-400' : ''}`}>
                                    {mounted ? new Date(msg.createdAt || (msg as any).created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--'}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="!mt-4">
                    {typingStatus?.isTyping && (
                        <div className="flex gap-3 items-center animate-pulse py-1">
                            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s] mx-0.5"></div>
                                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">{typingStatus.senderName} is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-1" />
                </div>
            </div>
        </div>
    );
}
