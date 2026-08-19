"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

const { Paperclip, Send, X } = LucideIcons as any;

type ChatFooterProps = {
    isDarkMode: boolean;
    sessionStatus: string;
    pendingAttachment: any;
    setPendingAttachment: (val: any) => void;
    handleFileUpload: (e: any) => void;
    fileInputRef: any;
    uploading: boolean;
    inputValue: string;
    setInputValue: (val: string) => void;
    handleSendMessage: () => void;
    handleInputTyping?: () => void;
};

export default function ChatFooter({
    isDarkMode,
    sessionStatus,
    pendingAttachment,
    setPendingAttachment,
    handleFileUpload,
    fileInputRef,
    uploading,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleInputTyping
}: ChatFooterProps) {
    return (
        <footer className={`flex-shrink-0 transition-all duration-300 ${isDarkMode ? 'bg-[#1a0c0c]/80 border-white/5' : 'bg-white/90 border-black/5'} backdrop-blur-xl border-t px-3 md:px-12 py-3 md:py-6 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] overflow-visible`}>
            <div className={`relative flex items-center gap-2 md:gap-5 max-w-6xl mx-auto overflow-visible ${sessionStatus !== 'active' ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                <div className="flex-1 relative group overflow-visible">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#fd6410]/20 to-orange-500/20 rounded-[34px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className={`relative flex flex-col ${isDarkMode ? 'bg-[#1A1A1A]/5' : 'bg-white'} border-2 border-[#fd6410] rounded-[20px] md:rounded-[34px] p-1 md:p-1.5 overflow-visible transition-all duration-300 shadow-[0_0_0_4px_rgba(253,100,16,0.1)]`}>
                        {pendingAttachment && (
                            <div className="mx-2 mb-2 p-2 bg-[#fd6410]/10 rounded-2xl border border-[#fd6410]/20 flex items-center justify-between animate-in slide-in-from-bottom-2">
                                <span className="text-[10px] font-black uppercase text-[#fd6410] truncate max-w-[180px]">📎 {pendingAttachment.name}</span>
                                <button onClick={() => setPendingAttachment(null)} className="p-1 hover:bg-red-500/10 rounded-lg text-red-500 transition-all active:scale-95"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 md:gap-4 overflow-visible px-1 md:px-2">
                            <button onClick={() => fileInputRef.current?.click()} className={`shrink-0 p-1.5 md:p-2.5 rounded-full ${isDarkMode ? 'bg-[#1A1A1A]/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-[#fd6410]'} transition-all hover:scale-110 active:scale-95 shadow-sm group relative overflow-visible`}>
                                <Paperclip className={`w-4 h-4 md:w-6 md:h-6 ${uploading ? 'animate-pulse' : ''}`} />
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap uppercase tracking-widest shadow-xl border border-white/10 z-[100]">Attach File</div>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                            <textarea
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    if (handleInputTyping) handleInputTyping();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                rows={1}
                                style={{ minHeight: '36px' }}
                                placeholder="Consult with intention..."
                                className={`flex-1 bg-transparent py-1.5 md:py-2.5 text-sm md:text-base ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'} outline-none border-none resize-none max-h-28 custom-scrollbar font-medium leading-relaxed m-0`}
                            />
                            <div className="items-center gap-2 pr-1 hidden md:flex">
                                <span className="text-[9px] font-black tracking-widest uppercase opacity-30 whitespace-nowrap">Shift + Enter for new line</span>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={(!inputValue.trim() && !pendingAttachment) || uploading}
                                className={`flex-shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-[14px] md:rounded-[20px] flex items-center justify-center transition-all shadow-md active:scale-90 group relative overflow-hidden ${inputValue.trim() || pendingAttachment ? "bg-[#fd6410] text-white hover:shadow-[#fd6410]/40 hover:-translate-y-1 hover:scale-105" : isDarkMode ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#fd6410] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Send className={`w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform ${inputValue.trim() || pendingAttachment ? "group-hover:-translate-y-1 group-hover:translate-x-1" : ""}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
}
