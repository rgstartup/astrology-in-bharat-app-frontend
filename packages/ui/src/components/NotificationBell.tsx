
import React from 'react';
import { Bell } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NotificationBellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    count?: number;
    isActive?: boolean; // If true, bell might show distinct styling or animation
    className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
    count = 0,
    isActive = false,
    className,
    ...props
}) => {
    return (
        <button
            className={twMerge(
                clsx(
                    'relative p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-100',
                    isActive
                        ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                        : 'text-gray-600 hover:bg-gray-100',
                    className
                )
            )}
            aria-label="Notifications"
            {...props}
        >
            <Bell className={clsx("w-5 h-5", isActive && "fill-current")} />

            {count > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold animate-pulse transform -translate-y-1 translate-x-1 shadow-sm border border-white">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    );
};



