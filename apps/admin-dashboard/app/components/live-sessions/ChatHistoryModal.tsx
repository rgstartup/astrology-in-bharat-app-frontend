"use client";

import React, { useEffect, useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { chatSocket } from "@/src/lib/socket";
import { toast } from "react-toastify";

const { X, AlertTriangle, ShieldAlert, MessageSquare } = LucideIcons as any;

interface Message {
    id: number;
    senderType: 'user' | 'expert' | 'admin';
    content: string;
    createdAt: string;
}

interface ChatHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    session: any;
}

export function ChatHistoryModal({ isOpen, onClose, messages: initialMessages, session }: ChatHistoryModalProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isTerminating, setIsTerminating] = useState(false);
    const [showTerminator, setShowTerminator] = useState(false);

    const [userTerminationMsg, setUserTerminationMsg] = useState("Your session has been terminated by the administrator due to a violation of platform policies.");
    const [expertTerminationMsg, setExpertTerminationMsg] = useState("This session has been terminated by the administrator. Please ensure all consultations follow legal and platform guidelines.");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get Admin ID from cookie
    const getAdminId = () => {
        try {
            const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
            if (userCookie) {
                const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
                return userData.id;
            }
        } catch (e) {
            console.error("Failed to parse user cookie", e);
        }
        return 0;
    };

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        if (isOpen && session) {
            console.log("[AdminChat] Joining room:", session.id);
            chatSocket.connect();
            chatSocket.emit('join_room', { sessionId: parseInt(session.id) });

            const handleNewMsg = (msg: Message) => {
                console.log("[AdminChat] New real-time message received:", msg);
                setMessages(prev => {
                    const exists = prev.some(m => m.id === msg.id);
                    if (exists) return prev;
                    return [...prev, msg];
                });
            };

            const handleSessionEnded = (data: any) => {
                toast.info(`Session ${session.id} has ended.`);
            };

            chatSocket.on('new_message', handleNewMsg);
            chatSocket.on('session_ended', handleSessionEnded);

            return () => {
                chatSocket.off('new_message', handleNewMsg);
                chatSocket.off('session_ended', handleSessionEnded);
            };
        }
    }, [isOpen, session]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleTerminate = () => {
        if (!window.confirm("ARE YOU ABSOLUTELY SURE? This will immediately stop the chat for both user and astrologer.")) return;

        setIsTerminating(true);
        const adminId = getAdminId();

        chatSocket.emit('admin_terminate_session', {
            sessionId: parseInt(session.id),
            adminId: adminId,
            userMessage: userTerminationMsg,
            expertMessage: expertTerminationMsg
        }, (res: any) => {
            setIsTerminating(false);
            if (res.status === 'success') {
                toast.success("Session terminated successfully.");
                setShowTerminator(false);
            } else {
                toast.error("Failed to terminate session");
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-white/20">
                {/* Header */}
                <div className="p-5 border-b flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">Live Chat Monitor</h2>
                            <p className="text-sm text-gray-500 font-medium">
                                Session #{session?.id} • <span className="text-blue-600 font-semibold">{session?.user?.name}</span> & <span className="text-purple-600 font-semibold">{session?.astrologer?.name}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowTerminator(!showTerminator)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showTerminator ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                        >
                            <ShieldAlert className="w-4 h-4" />
                            {showTerminator ? "Close Controls" : "Action Center"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Messages List */}
                    <div className={`flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 transition-all duration-300`}>
                        {messages && messages.length > 0 ? (
                            messages.map((msg: any) => {
                                const isUser = msg.senderType === 'user';
                                const isExpert = msg.senderType === 'expert';
                                const isAdmin = msg.senderType === 'admin';

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isUser ? 'items-end' : isExpert ? 'items-start' : 'items-center'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm relative ${isUser
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : isExpert
                                                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                                    : 'bg-red-50 text-red-700 border border-red-100 rounded-lg text-center font-bold italic'
                                            }`}>
                                            {!isAdmin && (
                                                <p className="text-[10px] font-black mb-1 opacity-60 uppercase tracking-widest">
                                                    {isUser ? session?.user?.name : session?.astrologer?.name}
                                                </p>
                                            )}
                                            {isAdmin && (
                                                <p className="text-[10px] font-black mb-1 text-red-600 uppercase tracking-widest flex items-center justify-center gap-1">
                                                    <ShieldAlert className="w-3 h-3" /> ADMIN INTERVENTION
                                                </p>
                                            )}
                                            <p className="text-[15px] leading-relaxed font-medium">{msg.content}</p>
                                            <p className={`text-[9px] mt-1.5 font-bold ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-300">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <p className="font-semibold italic">Waiting for participants to chat...</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Terminator Panel */}
                    {showTerminator && (
                        <div className="w-[400px] border-l bg-white p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-2 text-red-600 mb-6">
                                <ShieldAlert className="w-6 h-6" />
                                <h3 className="font-black uppercase tracking-tight text-lg">Protective Intervene</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex gap-3">
                                    <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
                                    <p className="text-[11px] text-red-700 font-medium">
                                        Use this to enforce platform security. Terminating will send the following messages and immediately close the session.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">Final Message to User</label>
                                    <textarea
                                        className="w-full h-24 p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                                        value={userTerminationMsg}
                                        onChange={(e) => setUserTerminationMsg(e.target.value)}
                                        placeholder="Reason for termination..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">Final Message to Expert</label>
                                    <textarea
                                        className="w-full h-24 p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                                        value={expertTerminationMsg}
                                        onChange={(e) => setExpertTerminationMsg(e.target.value)}
                                        placeholder="Instruction to expert..."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleTerminate}
                                        disabled={isTerminating}
                                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                                    >
                                        {isTerminating ? "Stopping Session..." : (
                                            <>
                                                <ShieldAlert className="w-5 h-5" /> Terminate Immediately
                                            </>
                                        )}
                                    </button>
                                </div>

                                <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-tighter mt-4">
                                    This action is irreversible and recorded.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}




