import React from "react";
import LiveChat from "@/app/components/LiveChat";

const JoinLiveSessionPage = () => {
    return (
        <div className="w-full h-full max-w-5xl mx-auto">
            {/* Page Title (Optional, as the chat has its own header) */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-astro-primary">Live Session</h1>
                    <p className="text-sm text-gray-500 mt-1">Connect instantly with your client</p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <LiveChat />
            </div>
        </div>
    );
};

export default JoinLiveSessionPage;
