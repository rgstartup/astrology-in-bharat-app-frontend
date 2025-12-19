"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Mic, Video, Headphones, Menu, Paperclip, Send } from "lucide-react";
import { cn } from "@/utils/cn";

interface Message {
  id: number;
  sender: "user" | "astrologer";
  text: string;
  time: string;
  avatar?: string;
}

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "user",
      text: "Namaste Guruji 🙏 I’ve been feeling very confused about my career lately. Could you please guide me?",
      time: "10:48 AM",
      avatar: "/images/user-avatar.jpg",
    },
    {
      id: 2,
      sender: "astrologer",
      text: "Namaste 🙏 Don’t worry, I’m here to help. Please share your date of birth, time, and place of birth.",
      time: "10:49 AM",
      avatar: "/images/astrologer-avatar.jpg",
    },
    {
      id: 3,
      sender: "user",
      text: "Sure Guruji. My date of birth is 20 August 1995.",
      time: "10:50 AM",
      avatar: "/images/user-avatar.jpg",
    },
    {
      id: 4,
      sender: "user",
      text: "Time of birth is 3:45 PM and place is Mumbai.",
      time: "10:51 AM",
      avatar: "/images/user-avatar.jpg",
    },
    {
      id: 5,
      sender: "astrologer",
      text: "Thank you. Please give me a moment while I analyze your birth chart and planetary positions.",
      time: "10:52 AM",
      avatar: "/images/astrologer-avatar.jpg",
    },
    {
      id: 6,
      sender: "astrologer",
      text: "I see strong Mars and Saturn influence. This indicates delays, but also long-term stability and success after effort.",
      time: "10:53 AM",
      avatar: "/images/astrologer-avatar.jpg",
    },
    {
      id: 7,
      sender: "user",
      text: "Guruji, marriage ka yog kab tak ban raha hai? Family thoda pressure daal rahi hai.",
      time: "10:54 AM",
      avatar: "/images/user-avatar.jpg",
    },
    {
      id: 8,
      sender: "astrologer",
      text: "Aap chinta na karein. 2026 ke mid tak shaadi ka strong yog ban raha hai. Sahi samay par sab achha hoga.",
      time: "10:55 AM",
      avatar: "/images/astrologer-avatar.jpg",
    },
    {
      id: 9,
      sender: "user",
      text: "Thank you so much Guruji 🙏 Aapki guidance se kaafi relief mila.",
      time: "10:56 AM",
      avatar: "/images/user-avatar.jpg",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "astrologer",
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "/images/user-avatar.jpg",
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col  bg-transparent font-poppins relative">
      {/* Header */}
      <div className="bg-white rounded-t-2xl shadow-sm p-8 flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 z-10 sticky top-0">
        <div className="flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Live Chat with Avni Pandit
            </h2>
            <div className="text-lg font-mono font-medium text-gray-600 block sm:hidden mt-1">
              01:23:45
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden sm:block text-xl font-mono text-gray-700 font-medium">
            01:23:45
          </div>

          <div className="flex items-center gap-2">
            {[Mic, Video, Headphones, Menu].map((Icon, idx) => (
              <button
                key={idx}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                aria-label="Control"
              >
                <Icon size={20} />
              </button>
            ))}
            <button
              className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors ml-1"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 sm:px-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.sender === "user" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "flex max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] gap-3",
                msg.sender === "user" ? "flex-row" : "flex-row-reverse"
              )}
            >
              {/* Avatar Placeholder */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 overflow-hidden relative border border-gray-200">
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-500 font-bold">
                    {msg.sender === "user" ? "U" : "A"}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "p-3 sm:p-4 rounded-2xl text-sm sm:text-base shadow-sm relative",
                  msg.sender === "user"
                    ? "bg-blue-100 text-gray-800 rounded-tl-none border border-blue-200"
                    : "bg-yellow-100 text-gray-800 rounded-tr-none border border-yellow-600"
                )}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Area */}
      <div className="bg-white p-4 border-t border-gray-100 rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-3 bg-white p-1">
          <button
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Attach"
          >
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full pl-4 pr-4 py-3 bg-gray-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all text-gray-700 placeholder-gray-400"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="Message Input"
            />
          </div>

          <button
            onClick={handleSendMessage}
            className="p-3 bg-yellow-600 text-white rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            aria-label="Send"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
