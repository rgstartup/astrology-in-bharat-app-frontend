"use client";

import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

const { Clock } = LucideIcons as any;

export default function WaitingCountdown({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) {
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const calculateSeconds = () => {
            const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
            if (diff <= 0) {
                setSecondsLeft(0);
                setTimeout(onExpire, 1000); // Small buffer before showing ended state
                return true; // Finished
            } else {
                setSecondsLeft(diff);
                return false;
            }
        };

        const finished = calculateSeconds();
        if (finished) return;

        const interval = setInterval(() => {
            if (calculateSeconds()) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 bg-black/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-orange-500 font-black tabular-nums text-xs">
                    Auto-Expires in: {mounted ? `${mins}:${secs.toString().padStart(2, '0')}` : '--:--'}
                </span>
            </div>
        </div>
    );
}
