"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";

const Image = NextImage as any;
const {
    ChevronLeft, Paperclip, Send, Clock, Star, Phone, MoreVertical, Wallet, X, Home, User: UserIcon, Sun, Moon
} = LucideIcons as any;

import AstrologerCard from "@/components/features/astrologers/AstrologerCard";

interface Message {
    id: number;
    sender: "astrologer" | "user";
    text?: string;
    image?: string;
    type?: "status";
}

export default function ChatRoom() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [timeLeft, setTimeLeft] = useState(299); // 4:59
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "astrologer", text: "Namaste! I am analyzing your birth chart. Please share your birth details or a clear photo of your palm/horoscope." },
        { id: 2, sender: "user", text: "Here is my horoscope image from the local priest." },
        { id: 3, sender: "user", image: "https://res.cloudinary.com/deoakjlkh/image/upload/v1737372252/d3o5zjgj5i8jn3tqseby.jpg" },
        { id: 4, sender: "astrologer", text: "I see a strong Jupiter influence in your house of career. You will likely see a major shift in the coming 3 months." },
    ]);

    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setShowModal(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { id: Date.now(), sender: "user", text: inputValue }]);
        setInputValue("");
    };

    const mockExpertData = {
        id: id,
        userId: id,
        image: "/images/astro-img1.png",
        name: "Pandit Ravi",
        expertise: "Vedic Astrology Expert",
        experience: 12,
        language: "Hindi, English",
        price: 20,
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        ratings: 4.9,
        is_available: true,
        total_likes: 156
    };

    return (
        <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#1a0c0c] text-white' : 'bg-[#FFF9F5] text-[#2A0A0A]'} overflow-hidden font-outfit transition-colors duration-500`}>
            {/* Header */}
            <header className="bg-[#fd6410] px-4 md:px-8 py-1.5 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-black/10">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1.5 hover:bg-black/10 rounded-xl transition-all active:scale-90 flex flex-col items-center">
                        <ChevronLeft className="w-5 h-5 text-white" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-white">Back</span>
                    </button>
                    <div className="w-px h-6 bg-black/10 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/20 overflow-hidden relative shadow-sm">
                            <Image src="/images/astro-img1.png" alt="Pandit" width={40} height={40} className="object-cover" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-sm leading-none text-white">Pandit Ravi</h1>
                            <p className="text-[9px] text-white/80 flex items-center gap-1 mt-0.5">
                                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span> Secure Session
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Timer */}
                    <div className="bg-black/20 px-3 py-1 rounded-xl flex items-center gap-3 border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-white opacity-60" />
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 text-white">Time Left</span>
                            <span className="text-xs md:text-sm font-black tabular-nums text-white">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-black/10 mx-1 hidden md:block"></div>

                    {/* Nav Buttons & Toggle */}
                    <div className="flex items-center gap-1">
                        <button onClick={() => router.push('/')} className="p-2 hover:bg-black/10 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-0.5 text-white">
                            <Home className="w-4 h-4" />
                            <span className="text-[8px] font-bold uppercase">Home</span>
                        </button>
                        <button onClick={() => router.push('/profile')} className="p-2 hover:bg-black/10 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-0.5 text-white">
                            <UserIcon className="w-4 h-4" />
                            <span className="text-[8px] font-bold uppercase">Profile</span>
                        </button>
                        <div className="w-px h-5 bg-black/10 mx-1"></div>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-inner"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Chat Section */}
                <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-[#2A0A0A]' : 'bg-[#FFF9F5]'} relative transition-colors duration-500`}>

                    {/* Welcome Banner */}
                    <div className={`md:hidden ${isDarkMode ? 'bg-[#3D1414]' : 'bg-[#FFF1E6]'} py-2 px-4 flex justify-between items-center border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#fd6410]'}`}>Free Session Active</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] opacity-50">Secure Connection</span>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="flex justify-center mb-10">
                                <div className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all border ${isDarkMode ? 'bg-white/5 opacity-30 border-white/5' : 'bg-[#fd6410]/10 text-[#fd6410] border-[#fd6410]/20'}`}>
                                    Chat Session Started
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 ${msg.sender === "user" ? "border-white/10" : "border-[#fd6410]/30"} overflow-hidden shadow-lg`}>
                                            <Image
                                                src={msg.sender === "user" ? "https://avatar.iran.liara.run/public/boy?username=Ravi" : "/images/astro-img1.png"}
                                                alt={msg.sender}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Message Bubble Container */}
                                    <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%]`}>
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-30 mb-1 px-2">
                                            {msg.sender === "user" ? "You" : "Pandit Ravi"}
                                        </span>
                                        <div className={`w-full ${msg.sender === "user"
                                            ? "bg-gradient-to-br from-[#fff9f2] to-[#fff3e6] text-[#2A0A0A] rounded-2xl rounded-br-none px-5 py-3 md:px-6 md:py-4"
                                            : "bg-white text-[#2A0A0A] rounded-2xl rounded-bl-none px-5 py-3 md:px-6 md:py-4"
                                            } shadow-xl relative transition-all hover:scale-[1.01]`}>
                                            {msg.text && <p className="text-[14px] md:text-base leading-relaxed">{msg.text}</p>}
                                            {msg.image && (
                                                <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 shadow-md">
                                                    <img src={msg.image} alt="Attachment" className="max-w-full" />
                                                </div>
                                            )}
                                            <div className={`mt-1 flex ${msg.sender === "user" ? "justify-end" : "justify-start"} text-black font-medium text-[10px] opacity-40`}>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            <div className="flex items-center gap-3 animate-pulse pl-4 py-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-[#fd6410] rounded-full drop-shadow-[0_0_8px_rgba(253,100,16,0.6)]"></div>
                                    <div className="w-2 h-2 bg-[#fd6410] rounded-full delay-100"></div>
                                    <div className="w-2 h-2 bg-[#fd6410] rounded-full delay-200"></div>
                                </div>
                                <span className={`text-xs font-bold italic ${isDarkMode ? 'text-[#fd6410]/80' : 'text-[#fd6410]'}`}>Pandit Ravi is reflecting on your stars...</span>
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Footer / Input Area */}
                    <div className={`p-4 md:p-6 ${isDarkMode ? 'bg-[#1a0c0c]' : 'bg-white'} border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'} transition-colors duration-500`}>
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-end gap-3 md:gap-4">
                                <button className={`w-12 h-12 md:w-14 md:h-14 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} rounded-2xl flex items-center justify-center transition-all active:scale-95 border ${isDarkMode ? 'border-white/5' : 'border-black/5'} group`}>
                                    <Paperclip className="w-5 h-5 md:w-6 md:h-6 text-[#fd6410] group-hover:scale-110 transition" />
                                </button>
                                <div className={`flex-1 ${isDarkMode ? 'bg-white/5 focus-within:bg-black/20 border-white/5 focus-within:border-[#fd6410]/50' : 'bg-gray-100 focus-within:bg-white border-transparent focus-within:border-[#fd6410]/30'} rounded-[24px] px-6 py-3 md:py-4 flex items-center border transition-all shadow-2xl`}>
                                    <textarea
                                        rows={1}
                                        placeholder="Ask about your future, career, or love life..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        className={`bg-transparent border-none outline-none ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'} text-[15px] md:text-base w-full placeholder:text-gray-500 resize-none max-h-32`}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-[#fd6410] to-[#ff914d] rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 active:scale-90 hover:brightness-110 transition-all"
                                >
                                    <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-2 opacity-20 pt-4">
                                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-white' : 'text-black'}`}>Encrypted & Confidential</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <aside className={`hidden lg:flex flex-col w-[380px] ${isDarkMode ? 'bg-[#1a0c0c] border-white/5' : 'bg-[#FFF1E6] border-black/5'} border-l p-6 space-y-6 overflow-y-auto transition-colors duration-500`}>
                    <div className="scale-90 origin-top">
                        <AstrologerCard astrologerData={mockExpertData as any} />
                    </div>

                    <div className="space-y-4">
                        <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'opacity-40 text-white' : 'opacity-60 text-[#2A0A0A]'} ml-2`}>Quick Actions</h3>
                        <button className={`w-full py-4 ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-orange-50'} rounded-2xl border flex items-center justify-between px-6 transition group`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg"><Wallet className="w-4 h-4 text-[#fd6410]" /></div>
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'}`}>Check Balance</span>
                            </div>
                            <ChevronLeft className={`w-4 h-4 rotate-180 ${isDarkMode ? 'opacity-30' : 'opacity-40'} group-hover:opacity-100 transition`} />
                        </button>
                        <button className={`w-full py-4 ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-orange-50'} rounded-2xl border flex items-center justify-between px-6 transition group`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Star className="w-4 h-4 text-blue-400" /></div>
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'}`}>Rate Astrologer</span>
                            </div>
                            <ChevronLeft className={`w-4 h-4 rotate-180 ${isDarkMode ? 'opacity-30' : 'opacity-40'} group-hover:opacity-100 transition`} />
                        </button>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className={`bg-gradient-to-br ${isDarkMode ? 'from-[#fd641011] border-[#fd641022]' : 'from-[#fd641011] border-[#fd641011]'} to-transparent p-6 rounded-[24px] border`}>
                            <p className="text-xs font-bold text-orange-400 mb-2 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Promotion Active
                            </p>
                            <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your first 5 minutes are free! Recharge now to get <span className={`${isDarkMode ? 'text-white' : 'text-[#fd6410]'} font-black`}>20% extra</span> balance.</p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Expiration Modal */}
            {showModal && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 ${isDarkMode ? 'bg-[#0a0505]/95' : 'bg-black/60'} backdrop-blur-xl animate-in fade-in duration-500`}>
                    <div className={`${isDarkMode ? 'bg-[#1a0c0c]' : 'bg-white'} w-full max-w-md rounded-[40px] overflow-hidden border ${isDarkMode ? 'border-white/10' : 'border-[#fd6410]/20'} shadow-[0_0_50px_rgba(253,100,16,0.15)] animate-in zoom-in-95 duration-300 relative`}>

                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#fd6410] opacity-10 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#800000] opacity-20 blur-[80px] rounded-full"></div>

                        {/* Modal Content */}
                        <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
                            {/* Icon & Badge */}
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-tr from-[#fd641022] to-transparent rounded-[32px] flex items-center justify-center border border-[#fd641044] rotate-12 relative overflow-hidden group">
                                    <Clock className="w-12 h-12 text-[#fd6410] animate-pulse -rotate-12" />
                                </div>
                                <div className="absolute -bottom-2 -right-4 bg-[#fd6410] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-[#1a0c0c] uppercase tracking-tighter">
                                    Session Expired
                                </div>
                            </div>

                            <h2 className={`text-3xl font-black mb-3 ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'} tracking-tight`}>Time's Up!</h2>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[14px] leading-relaxed mb-10 max-w-[280px] mx-auto`}>
                                Your 5-min free consultation with <span className="text-[#fd6410] font-bold">Pandit Ravi</span> has ended. Recharge to unlock deep cosmic insights.
                            </p>

                            {/* Status Card */}
                            <div className={`w-full ${isDarkMode ? 'bg-white/[0.03]' : 'bg-gray-50'} rounded-[32px] p-6 border ${isDarkMode ? 'border-white/5' : 'border-black/5'} mb-8 backdrop-blur-md`}>
                                <div className={`flex justify-between items-center mb-5 border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'} pb-5`}>
                                    <div className="text-left">
                                        <p className={`text-[10px] font-black ${isDarkMode ? 'text-white/30' : 'text-black/30'} uppercase tracking-widest mb-1`}>Expert Rate</p>
                                        <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'}`}>₹20<span className="text-sm opacity-50 font-normal"> / min</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[10px] font-black ${isDarkMode ? 'text-white/30' : 'text-black/30'} uppercase tracking-widest mb-1`}>In Wallet</p>
                                        <p className="text-xl font-bold text-red-500">₹0.00</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-[#fd6410] uppercase tracking-[0.2em]">Select Top-up Amount</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[100, 250, 500].map(amt => (
                                            <button key={amt} className={`py-4 rounded-2xl border text-sm font-black transition-all active:scale-95 ${amt === 250 ? 'border-[#fd6410] bg-[#fd6410] text-white shadow-[0_0_20px_rgba(253,100,16,0.3)]' : `border-${isDarkMode ? 'white/10' : 'black/5'} ${isDarkMode ? 'text-white/40' : 'text-gray-400'} hover:border-[#fd6410]/30`}`}>
                                                ₹{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full space-y-4">
                                <button className="w-full py-5 bg-[#fd6410] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(253,100,16,0.3)] hover:brightness-110 active:scale-[0.98] transition-all">
                                    <Wallet className="w-6 h-6" />
                                    Recharge & Continue
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className={`w-full py-4 rounded-[24px] border ${isDarkMode ? 'border-white/5' : 'border-black/5'} ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-[#2A0A0A] hover:bg-black/5'} font-bold transition-all text-sm`}
                                >
                                    No thanks, End Session
                                </button>
                            </div>
                        </div>

                        {/* Security Footer */}
                        <div className={`${isDarkMode ? 'bg-black/20' : 'bg-gray-100'} py-4 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'} flex items-center justify-center gap-2`}>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <p className={`text-[10px] font-black ${isDarkMode ? 'text-white/20' : 'text-black/20'} uppercase tracking-[0.3em]`}>Secure SSL Encrypted Checkout</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
