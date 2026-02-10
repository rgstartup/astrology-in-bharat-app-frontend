import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import apiClient, {
    getClientProfile, updateClientProfile, uploadClientDocument,
    ClientProfileData, AddressDto, getAllChatSessions, getChatHistory, getMyOrders,
    getWalletTransactions, getNotifications, markNotificationAsRead, deleteNotification,
    clearAllNotifications, getMyRewards, getSupportSettings, SupportSettings, getMyDisputes
} from "@/libs/api-profile";
import { loadRazorpay } from "@/libs/razorpay";
import { getNotificationSocket, connectNotificationSocket } from "@packages/ui/src/utils/socket";

// Types
type ProfileData = ClientProfileData;

export const useProfileLogic = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clientUser, isClientAuthenticated, clientLoading, clientBalance, refreshBalance, refreshAuth } = useClientAuth();

    const [profileData, setProfileData] = useState<ProfileData>({});
    const [loading, setLoading] = useState(false);

    // Section-based editing/saving states
    const [editingSections, setEditingSections] = useState({
        personal: false,
        address: false,
        astro: false,
        settings: false
    });
    const [savingSections, setSavingSections] = useState({
        personal: false,
        address: false,
        astro: false,
        settings: false
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("/images/aa.webp");

    // Wallet
    const [rechargeAmount, setRechargeAmount] = useState<number>(500);
    const [isProcessing, setIsProcessing] = useState(false);
    const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];
    const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [walletView, setWalletView] = useState<'recharge' | 'history'>('recharge');
    const [walletPurpose, setWalletPurpose] = useState<string | undefined>(undefined);

    // History
    const [consultationHistory, setConsultationHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [showChatModal, setShowChatModal] = useState(false);

    // Orders
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});
    const [orderDisputes, setOrderDisputes] = useState<Record<number, any>>({});
    const [allDisputes, setAllDisputes] = useState<any[]>([]);
    const [selectedDispute, setSelectedDispute] = useState<any>(null);
    const [showDisputeChat, setShowDisputeChat] = useState(false);

    // Notifications
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    // Rewards
    const [rewards, setRewards] = useState<any[]>([]);
    const [loadingRewards, setLoadingRewards] = useState(false);

    // Support
    const [supportSettings, setSupportSettings] = useState<SupportSettings>({
        email: 'support@astrologyinbharat.com',
        phone: '+919876543210',
        whatsapp: '+919876543210'
    });
    const [loadingSupportSettings, setLoadingSupportSettings] = useState(false);

    // Report Modal
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportItemType, setReportItemType] = useState<'order' | 'consultation'>('order');
    const [reportItemDetails, setReportItemDetails] = useState<any>(null);

    const [activeTab, setActiveTab] = useState("profile");

    // --- Effects ---

    // Auth Redirection
    useEffect(() => {
        if (!clientLoading && !isClientAuthenticated) {
            router.push("/sign-in?callbackUrl=/profile");
        }
    }, [clientLoading, isClientAuthenticated, router]);

    // Tab Initialization
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        } else {
            const savedTab = localStorage.getItem("profileActiveTab");
            if (savedTab) {
                setActiveTab(savedTab);
            }
        }

        const savedView = localStorage.getItem("profileWalletView");
        if (savedView === 'history' || savedView === 'recharge') {
            setWalletView(savedView as any);
        }
    }, [searchParams]);

    useEffect(() => {
        localStorage.setItem("profileActiveTab", activeTab);
        localStorage.setItem("profileWalletView", walletView);
    }, [activeTab, walletView]);

    // Load Profile
    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getClientProfile();
            if (data) {
                setProfileData(data);
                if (data.profile_picture) {
                    setImagePreview(data.profile_picture);
                }
            }
        } catch (error: any) {
            console.error("❌ Error loading profile:", error);
            if (error.response?.status !== 404) {
                toast.error("Failed to load profile data");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isClientAuthenticated) {
            loadProfile();
        }
    }, [isClientAuthenticated, loadProfile]);

    // Load History
    useEffect(() => {
        const loadConsultationHistory = async () => {
            if (activeTab === "history" && isClientAuthenticated) {
                setLoadingHistory(true);
                try {
                    const sessions = await getAllChatSessions();
                    setConsultationHistory(sessions);
                } catch (error) {
                    console.error("Failed to load consultation history:", error);
                    toast.error("Failed to load consultation history");
                } finally {
                    setLoadingHistory(false);
                }
            }
        };
        loadConsultationHistory();
    }, [activeTab, isClientAuthenticated]);

    // Load Orders & Disputes
    const loadOrdersAndDisputes = useCallback(async () => {
        if (isClientAuthenticated) {
            setLoadingOrders(true);
            try {
                // Fetch orders and disputes in parallel using Promise.allSettled to allow partial success
                const [ordersResult, disputesResult] = await Promise.allSettled([
                    getMyOrders(),
                    getMyDisputes()
                ]);

                // Handle Orders
                if (ordersResult.status === 'fulfilled') {
                    const myOrders = ordersResult.value;
                    const orderArray = Array.isArray(myOrders)
                        ? myOrders
                        : (myOrders?.items || myOrders?.data || myOrders?.orders || []);
                    setOrders(orderArray);
                } else {
                    // Only throw if orders failed, as that's the primary data for this tab
                    throw ordersResult.reason;
                }

                // Handle Disputes (fail silently if this endpoint errors)
                if (disputesResult.status === 'fulfilled') {
                    const myDisputes = disputesResult.value;
                    const disputes = Array.isArray(myDisputes) ? myDisputes : (myDisputes?.data || myDisputes?.items || []);
                    const disputeMap: Record<number, any> = {};
                    disputes.forEach((d: any) => {
                        const oId = d.orderId || d.order_id || d.order?.id;
                        if (oId) {
                            disputeMap[oId] = d;
                        }
                    });
                    setOrderDisputes(disputeMap);
                    setAllDisputes(disputes);
                } else {
                    console.warn("Failed to load disputes (non-critical):", disputesResult.reason);
                }

            } catch (error: any) {
                console.error("Failed to load orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoadingOrders(false);
            }
        }
    }, [isClientAuthenticated]);

    useEffect(() => {
        if ((activeTab === "orders" || activeTab === "disputes") && isClientAuthenticated) {
            loadOrdersAndDisputes();
        }
    }, [activeTab, isClientAuthenticated, loadOrdersAndDisputes]);

    // Load Transactions
    const loadTransactions = useCallback(async () => {
        if (isClientAuthenticated) {
            setLoadingTransactions(true);
            try {
                const params = walletPurpose ? { purpose: walletPurpose } : {};
                const transactions = await getWalletTransactions(params);
                const txArray = Array.isArray(transactions)
                    ? transactions
                    : (transactions?.items || transactions?.transactions || transactions?.data || []);

                setWalletTransactions(txArray);
            } catch (error) {
                console.error("Failed to load wallet transactions:", error);
            } finally {
                setLoadingTransactions(false);
            }
        }
    }, [isClientAuthenticated, walletPurpose]);

    useEffect(() => {
        if (activeTab === "wallet") {
            loadTransactions();
        }
    }, [activeTab, loadTransactions]);

    // Load Notifications
    const loadNotifications = useCallback(async () => {
        if (activeTab === "notifications" && isClientAuthenticated) {
            setLoadingNotifications(true);
            try {
                const data = await getNotifications();
                setNotifications(Array.isArray(data) ? data : (data.data || []));
            } catch (error) {
                console.error("Failed to load notifications:", error);
            } finally {
                setLoadingNotifications(false);
            }
        }
    }, [activeTab, isClientAuthenticated]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Load Rewards
    const loadRewards = useCallback(async () => {
        if (activeTab === "rewards" && isClientAuthenticated) {
            setLoadingRewards(true);
            try {
                const data = await getMyRewards();
                setRewards(Array.isArray(data) ? data : (data.data || []));
            } catch (error) {
                console.error("Failed to load rewards:", error);
            } finally {
                setLoadingRewards(false);
            }
        }
    }, [activeTab, isClientAuthenticated]);

    useEffect(() => {
        loadRewards();
    }, [loadRewards]);

    // Load Support
    useEffect(() => {
        const loadSupport = async () => {
            if (activeTab === "support") {
                setLoadingSupportSettings(true);
                try {
                    const data = await getSupportSettings();
                    if (data) {
                        setSupportSettings(data);
                    }
                } catch (error) {
                    console.error("Failed to load support:", error);
                } finally {
                    setLoadingSupportSettings(false);
                }
            }
        };
        loadSupport();
    }, [activeTab]);

    // Socket
    useEffect(() => {
        if (!isClientAuthenticated || !clientUser?.id) return;

        connectNotificationSocket(clientUser.id);
        const socket = getNotificationSocket();

        const handleOrderUpdate = (data: any) => {
            toast.success(data.message || 'Order status updated');
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === data.orderId
                        ? { ...order, status: data.status, cancellationReason: data.cancellationReason }
                        : order
                )
            );
        };

        socket.on('order_status_updated', handleOrderUpdate);
        socket.on('notification', (data) => {
            if (activeTab === 'notifications') {
                loadNotifications();
            }
        });

        return () => {
            socket.off('order_status_updated', handleOrderUpdate);
            socket.off('notification');
        };
    }, [isClientAuthenticated, clientUser?.id, activeTab, loadNotifications]);


    // --- Handlers ---

    const handleRecharge = async () => {
        if (rechargeAmount < 100) {
            toast.error("Minimum recharge amount is ₹100");
            return;
        }

        setIsProcessing(true);
        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Razorpay SDK failed to load.");
                return;
            }

            const orderRes = await apiClient.post("/payment/orders/create", {
                amount: rechargeAmount,
                type: 'wallet_recharge'
            });

            const { id: order_id, amount, currency, key_id } = orderRes.data;

            const options = {
                key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "Astrology in Bharat",
                description: "Wallet Recharge",
                order_id: order_id,
                handler: async (response: any) => {
                    try {
                        const verifyRes = await apiClient.post("/payment/orders/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            toast.success(`Successfully recharged ₹${rechargeAmount}!`);
                            refreshBalance();
                            loadTransactions();
                            setWalletView('history');
                        } else {
                            toast.error("Payment verification failed!");
                        }
                    } catch (err: any) {
                        console.error("Verification error:", err);
                        toast.error("Error verifying payment.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: profileData.full_name || clientUser?.name || "",
                    email: clientUser?.email || "",
                },
                theme: { color: "#fd6410" },
                modal: { ondismiss: () => setIsProcessing(false) }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (err: any) {
            console.error("Recharge error:", err);
            toast.error(err.response?.data?.message || "Recharge failed. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleImageChange = async (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        try {
            setSavingSections(prev => ({ ...prev, personal: true }));
            const uploadResult = await uploadClientDocument(file);

            if (uploadResult && uploadResult.url) {
                const imageUrl = uploadResult.url;
                setProfileData(prev => ({ ...prev, profile_picture: imageUrl }));
                setImagePreview(imageUrl);

                await updateClientProfile({ profile_picture: imageUrl });
                await refreshAuth(); // Refresh global auth state to update header
                setSuccessMessage("Profile picture updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setErrorMessage("Upload succeeded but no URL returned");
            }
        } catch (error: any) {
            const errorDetail = error.response?.data?.message || error.message || "Unknown error";
            setErrorMessage(`Failed to upload profile picture: ${errorDetail}`);
            setTimeout(() => setErrorMessage(""), 8000);
        } finally {
            setSavingSections(prev => ({ ...prev, personal: false }));
        }
    };

    const handleInputChange = (key: keyof ProfileData, value: any) => {
        setProfileData(prev => ({ ...prev, [key]: value }));
    };

    const handleAddressChange = (index: number, key: keyof AddressDto, value: string) => {
        setProfileData(prev => {
            const addresses = [...(prev.addresses || [])];
            if (!addresses[index]) {
                addresses[index] = { line1: '', city: '', state: '', country: '', zipCode: '' };
            }
            addresses[index] = { ...addresses[index], [key]: value };
            return { ...prev, addresses };
        });
    };

    const handleSaveSection = async (section: keyof typeof editingSections) => {
        setSavingSections(prev => ({ ...prev, [section]: true }));
        setSuccessMessage("");
        setErrorMessage("");

        try {
            let sectionFields: string[] = [];
            switch (section) {
                case 'personal':
                    sectionFields = ['full_name', 'username', 'phone', 'gender', 'marital_status', 'occupation', 'about_me'];
                    break;
                case 'address':
                    sectionFields = ['addresses'];
                    break;
                case 'astro':
                    sectionFields = ['date_of_birth', 'time_of_birth', 'place_of_birth'];
                    break;
                case 'settings':
                    sectionFields = ['language_preference'];
                    break;
            }

            const payload: any = {};
            sectionFields.forEach(field => {
                if (profileData[field as keyof ProfileData] !== undefined) {
                    payload[field] = profileData[field as keyof ProfileData];
                }
            });

            if (section === 'personal' && (!payload.gender || payload.gender.trim() === '')) {
                payload.gender = 'other';
            }

            if (section === 'address' && payload.addresses && Array.isArray(payload.addresses)) {
                payload.addresses = payload.addresses.map((addr: any) => {
                    const { createdAt, updatedAt, user, profile_client, ...cleanAddr } = addr;
                    return cleanAddr;
                });
            }

            const savedData = await updateClientProfile(payload);
            toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);

            if (savedData) {
                setProfileData(prev => ({ ...prev, ...savedData }));
            }
            await refreshAuth(); // Refresh global auth state to update header
            setEditingSections(prev => ({ ...prev, [section]: false }));
        } catch (error: any) {
            console.error(`❌ Error updating ${section}:`, error);
            const errMsg = error.response?.data?.message || error.message || 'Unknown error';
            toast.error(`Failed to update ${section}: ${errMsg}`);
        } finally {
            setSavingSections(prev => ({ ...prev, [section]: false }));
        }
    };

    const handleViewChat = async (session: any) => {
        try {
            setSelectedSession(session);
            setShowChatModal(true);
            const messages = await getChatHistory(session.id);
            setChatMessages(messages);
        } catch (error) {
            console.error("Failed to load chat messages:", error);
            toast.error("Failed to load chat messages");
        }
    };

    const toggleOrder = (orderId: number) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleClearAllNotifs = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await clearAllNotifications();
            setNotifications([]);
            toast.success("All notifications cleared");
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        }
    };

    return {
        clientUser, isClientAuthenticated, clientLoading, clientBalance,
        profileData, loading,
        editingSections, setEditingSections,
        savingSections, setSavingSections,
        successMessage, setSuccessMessage,
        errorMessage, setErrorMessage,
        imagePreview, setImagePreview,

        // Wallet
        rechargeAmount, setRechargeAmount,
        isProcessing, rechargeOptions,
        walletTransactions, loadingTransactions,
        walletView, setWalletView,
        walletPurpose, setWalletPurpose,
        handleRecharge,

        // History
        consultationHistory, loadingHistory,
        selectedSession, chatMessages, showChatModal, setShowChatModal,
        handleViewChat,

        // Orders
        orders, loadingOrders, expandedOrders, toggleOrder,
        orderDisputes, allDisputes, selectedDispute, setSelectedDispute, showDisputeChat, setShowDisputeChat,

        // Notifications
        notifications, loadingNotifications,
        handleMarkAsRead, handleClearAllNotifs,

        // Rewards
        rewards, loadingRewards,

        // Support
        supportSettings, loadingSupportSettings,

        // Modals
        reportModalOpen, setReportModalOpen,
        reportItemType, setReportItemType,
        reportItemDetails, setReportItemDetails,

        // Tab
        activeTab, setActiveTab,

        // Handlers
        handleImageChange, handleInputChange, handleAddressChange, handleSaveSection, loadOrdersAndDisputes
    };
};
