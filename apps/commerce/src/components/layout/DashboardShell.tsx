"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/features/shop-dashboard/components/Sidebar";
import { Menu } from "lucide-react";
import { SearchInput, Avatar, NotificationBell } from "@repo/ui";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

import { useMerchantProfile, useUpdateOnlineStatus } from "@/hooks/useSettings";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { connectNotificationSocket, getNotificationSocket } from "@repo/ui";
import { toast } from "react-toastify";

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, isAuthenticated } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
    const isAuthPage = pathname === "/" || authRoutes.some(route => pathname?.startsWith(route));

    // Fetch real profile data - only if NOT on an auth page and IS authenticated
    const { data: profileData, isLoading: isProfileLoading } = useMerchantProfile({ 
        enabled: !isAuthPage && isAuthenticated 
    });
    const updateOnlineStatus = useUpdateOnlineStatus();
    
    // Use local state for optimistic UI updates
    const [localOnlineStatus, setLocalOnlineStatus] = useState<boolean | null>(null);
    
    // Sync local state with profile data when it loads
    React.useEffect(() => {
        if (profileData?.profile) {
            setLocalOnlineStatus(!!profileData.profile.isOnline);
        }
    }, [profileData]);

    const isOnline = localOnlineStatus ?? !!(profileData?.profile?.isOnline);
    
    // Check if merchant is approved/active by admin
    const merchantStatus = profileData?.profile?.status;
    const isApproved = merchantStatus === 'active';

    const handleToggle = () => {
        if (!isApproved) {
            toast.warning(
                merchantStatus === 'pending_verification'
                    ? '⏳ Aapka account abhi admin approval ka wait kar raha hai. Approved hone ke baad hi Online ho sakte hain.'
                    : '🚫 Aapka account suspended hai. Online hone ke liye admin se contact karein.',
                { autoClose: 5000 }
            );
            return;
        }
        const newStatus = !isOnline;
        setLocalOnlineStatus(newStatus);
        updateOnlineStatus.mutate(newStatus, {
            onError: () => {
                // Revert on error
                setLocalOnlineStatus(isOnline);
            }
        });
    };
    
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = React.useCallback(async () => {
        try {
            const [res, error] = await api.get<any>("/notifications", { params: { limit: 5 } });
            if (!error && res) {
                setNotifications(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    }, []);

    const fetchUnreadCount = React.useCallback(async () => {
        try {
            const [res, error] = await api.get<any>("/notifications/unread-count");
            if (!error && res) {
                setUnreadCount(res.count || 0);
            }
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    }, []);

    React.useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            fetchUnreadCount();
            connectNotificationSocket(user.id);
            const socket = getNotificationSocket();

            const handleNewNotification = (data: any) => {
                toast.info(data.message || "New notification!", {
                    icon: <NotificationBell count={0} className="w-4 h-4" />
                });
                fetchUnreadCount();
                fetchNotifications();
            };

            socket.on("new_notification", handleNewNotification);
            socket.on("notification", handleNewNotification);

            return () => {
                socket.off("new_notification", handleNewNotification);
                socket.off("notification", handleNewNotification);
            };
        }
    }, [user?.id, fetchNotifications, fetchUnreadCount]);

    // Route Protection Logic
    React.useEffect(() => {
        if (!loading && !isAuthenticated && !isAuthPage) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, isAuthPage, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-outfit">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated && !isAuthPage) {
        return null;
    }

    // If it's an auth page, just render the content without sidebar/header
    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-white font-outfit">
                {children}
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 h-screen w-full overflow-hidden text-gray-900 font-outfit">
            {/* Sidebar (Responsive) */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col h-screen min-w-0 overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40 shadow-sm shrink-0">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left Section */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 shrink-0 text-gray-600"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 tracking-tight truncate max-w-[120px] sm:max-w-none">
                                {pathname === '/dashboard' ? 'Overview' : pathname?.split('/').pop()?.replace('-', ' ')}
                            </h1>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3 sm:gap-6">
                            <div className="hidden md:block w-40 sm:w-64">
                                <SearchInput
                                    value={searchQuery}
                                    onChange={(e: any) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center space-x-2 relative group">
                                <span className={`text-sm font-medium hidden sm:inline ${isApproved ? 'text-gray-700' : 'text-yellow-600'}`}>
                                    {!isApproved ? '⏳ Pending' : isOnline ? "Online" : "Offline"}
                                </span>
                                <button
                                    onClick={handleToggle}
                                    disabled={updateOnlineStatus.isPending || isProfileLoading}
                                    title={!isApproved ? 'Admin approval ke baad hi Online ho sakte hain' : ''}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-500 ease-in-out ${ !isApproved ? 'bg-gray-300 cursor-not-allowed' : isOnline ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-red-500 shadow-lg shadow-red-200' } ${(updateOnlineStatus.isPending || isProfileLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className={`inline-block w-4 h-4 transform transition-transform duration-300 bg-white rounded-full shadow-md ${isOnline && isApproved ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                {/* Tooltip for non-approved merchants */}
                                {!isApproved && (
                                    <div className="absolute right-0 top-8 hidden group-hover:block z-50 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg px-3 py-2 w-56 shadow-lg">
                                        ⏳ Admin approval ka wait karein. Approved hone ke baad Online ho sakte hain.
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsNotificationOpen(true)}
                                    onMouseLeave={() => setIsNotificationOpen(false)}
                                >
                                    <NotificationBell count={unreadCount} className="bg-transparent hover:bg-gray-100" />
                                    {isNotificationOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                                </div>
                                                <ul className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                                                    {notifications.map((n) => (
                                                        <li key={n.id} className="text-sm text-gray-700 border-b border-gray-50 pb-3 last:border-0">
                                                            <p className="font-medium">{n.message}</p>
                                                            <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link href="/settings" className="shrink-0">
                                <Avatar 
                                    src={profileData?.profile?.image || "/images/web-logo.png"} 
                                    alt="Merchant Profile" 
                                    className="border-2 border-[#fd6410] shadow-md hover:scale-105 transition-transform duration-200 w-10 h-10 object-cover" 
                                />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto w-full bg-gray-50/50 no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};
