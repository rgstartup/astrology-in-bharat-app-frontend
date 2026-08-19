"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { api as http } from "@/lib/api";
import { getErrorMessage } from "@repo/lib";
import { getWalletTransactions } from "@/libs/api-profile";
import { loadRazorpay } from "@/libs/razorpay";

export const useProfileWalletLogic = (
    isAuthenticated: boolean,
    profileData: any,
    user: any,
    refreshBalance: () => void,
    activeTab: string,
) => {
    const [rechargeAmount, setRechargeAmount] = useState<number>(500);
    const [isProcessing, setIsProcessing] = useState(false);
    const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];
    const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [transactionsPage, setTransactionsPage] = useState(1);
    const [transactionsHasMore, setTransactionsHasMore] = useState(true);
    const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);

    const [walletView, setWalletView] = useState<"recharge" | "history">(
        "recharge",
    );
    const [walletPurpose, setWalletPurpose] = useState<string | undefined>(
        undefined,
    );

    useEffect(() => {
        const savedView = localStorage.getItem("profileWalletView");
        if (savedView === "history" || savedView === "recharge") {
            setWalletView(savedView as any);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("profileWalletView", walletView);
    }, [walletView]);

    const loadTransactions = useCallback(async (pageNumber = 1) => {
        if (isAuthenticated) {
            if (pageNumber === 1) setLoadingTransactions(true);
            else setLoadingMoreTransactions(true);

            try {
                const limit = 10;
                const offset = (pageNumber - 1) * limit;
                const params = {
                    limit,
                    offset,
                    ...(walletPurpose ? { purpose: walletPurpose } : {})
                };
                
                const [result, error] = await getWalletTransactions(params) as any;
                
                if (error) {
                    console.error("Failed to load wallet transactions:", error);
                } else {
                    const txArray = result?.data || [];
                    const totalCount = result?.meta?.totalCount || 0;

                    if (pageNumber === 1) {
                        setWalletTransactions(txArray);
                        setTransactionsHasMore(txArray.length < totalCount);
                    } else {
                        setWalletTransactions(prev => {
                            const existingIds = new Set(prev.map(t => t.id));
                            const newTxs = txArray.filter((t: any) => !existingIds.has(t.id));
                            const updatedList = [...prev, ...newTxs];
                            setTransactionsHasMore(updatedList.length < totalCount);
                            return updatedList;
                        });
                    }
                    setTransactionsPage(pageNumber);
                }
            } catch (err) {
                console.error("Wallet transaction loading error:", err);
            } finally {
                setLoadingTransactions(false);
                setLoadingMoreTransactions(false);
            }
        }
    }, [isAuthenticated, walletPurpose]);

    const loadMoreTransactions = () => {
        if (!loadingMoreTransactions && transactionsHasMore) {
            loadTransactions(transactionsPage + 1);
        }
    };

    useEffect(() => {
        if (activeTab === "wallet") {
            loadTransactions();
        }
    }, [activeTab, loadTransactions]);

    const handleRecharge = async () => {
        if (rechargeAmount < 100) {
            toast.error("Minimum recharge amount is ₹100");
            return;
        }

        setIsProcessing(true);
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            toast.error("Razorpay SDK failed to load.");
            setIsProcessing(false);
            return;
        }

        const [orderRes, orderError] = await http.post<any>("/payment/orders/create", {
            amount: rechargeAmount,
            type: "wallet_recharge",
        });

        if (orderError) {
            console.error("Order Creation Error:", orderError);
            toast.error(getErrorMessage(orderError) || "Failed to create payment order.");
            setIsProcessing(false);
            return;
        }

        const orderPayload: any = (orderRes as any)?.data ?? orderRes;
        const { id: order_id, amount, currency, key_id } = orderPayload || {};
        if (!order_id || !amount || !currency) {
            toast.error("Invalid payment order response");
            setIsProcessing(false);
            return;
        }

        const options = {
            key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amount,
            currency: currency,
            name: "Astrology in Bharat",
            description: "Wallet Recharge",
            order_id: order_id,
            handler: async (response: any) => {
                const [verifyRes, verifyError] = await http.post<any>(
                    "/payment/orders/verify",
                    {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    },
                );

                if (verifyError) {
                    console.error("Verification error:", verifyError);
                    toast.error(getErrorMessage(verifyError) || "Payment verification failed!");
                } else {
                    const verifyPayload: any = (verifyRes as any)?.data ?? verifyRes;
                    if (verifyPayload?.success) {
                        toast.success(`Successfully recharged ₹${rechargeAmount}!`);
                        refreshBalance();
                        loadTransactions();
                        setWalletView("history");
                    } else {
                        toast.error(getErrorMessage(verifyRes) || "Payment verification failed!");
                    }
                }
                setIsProcessing(false);
            },
            prefill: {
                name: profileData.full_name || user?.name || "",
                email: user?.email || "",
            },
            theme: { color: "#f25e0a" },
            modal: { ondismiss: () => setIsProcessing(false) },
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
    };

    return {
        rechargeAmount,
        setRechargeAmount,
        isProcessing,
        rechargeOptions,
        walletTransactions,
        loadingTransactions,
        transactionsHasMore,
        loadingMoreTransactions,
        loadMoreTransactions,
        walletView,
        setWalletView,
        walletPurpose,
        setWalletPurpose,
        handleRecharge,
        loadTransactions,
    };
};
