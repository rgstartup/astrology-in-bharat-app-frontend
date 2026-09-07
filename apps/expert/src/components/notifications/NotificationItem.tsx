"use client";

import React, { FC } from "react";
import { Clock, Mail, MailOpen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { AppNotification } from "@/types/notification";

interface NotificationItemProps {
    notification: AppNotification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({ 
    notification, 
    onMarkRead, 
    onDelete 
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={() => !notification.read && onMarkRead(notification.id)}
            className={cn(
                "p-5 rounded-2xl border transition-all duration-300 cursor-pointer group flex justify-between items-start gap-4",
                notification.read
                    ? "bg-white border-gray-100 opacity-70 hover:opacity-100"
                    : "bg-orange/5 border-orange/10 shadow-sm hover:shadow-md hover:bg-orange/10"
            )}
        >
            <div className="flex gap-4 flex-1 min-w-0">
                <div
                    className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 shrink-0",
                        notification.read
                            ? "bg-gray-100 text-gray-400"
                            : "bg-orange text-white"
                    )}
                >
                    {notification.read ? (
                        <MailOpen className="w-5 h-5" />
                    ) : (
                        <Mail className="w-5 h-5" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h6
                        className={cn(
                            "text-base mb-1 truncate",
                            notification.read ? "text-gray-600" : "text-gray-900 font-bold"
                        )}
                    >
                        {notification.title}
                    </h6>
                    <p
                        className="text-gray-500 text-sm mb-3 leading-relaxed line-clamp-2"
                        style={{ lineHeight: "1.5" }}
                    >
                        {notification.description}
                    </p>
                    <span className="flex items-center gap-2 text-[10px] text-orange font-bold uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(notification.createdAt || Date.now()).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
                {!notification.read && (
                    <div className="relative flex items-center justify-center w-6 h-6">
                        <span className="absolute w-3 h-3 rounded-full bg-orange animate-ping opacity-75"></span>
                        <span className="relative w-2.5 h-2.5 rounded-full bg-orange shadow-lg shadow-orange/50"></span>
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};
