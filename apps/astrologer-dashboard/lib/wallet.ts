import apiClient from "./apiClient";
import { WalletStatsData, WalletTransaction } from "../components/Wallet/types";

export const getWalletBalance = async (): Promise<WalletStatsData> => {
    try {
        const response = await apiClient.get('/expert/wallet/balance');
        return response.data?.data || response.data;
    } catch (error) {
        console.error("[Wallet] Failed to fetch balance:", error);
        throw error;
    }
};

export const getWalletTransactions = async (page: number = 1, limit: number = 10): Promise<{ transactions: WalletTransaction[], total: number }> => {
    try {
        const response = await apiClient.get(`/expert/wallet/transactions?page=${page}&limit=${limit}`);
        return response.data?.data || response.data;
    } catch (error) {
        console.error("[Wallet] Failed to fetch transactions:", error);
        throw error;
    }
};

export const requestWithdrawal = async (amount: number, bankAccountId: string) => {
    try {
        const response = await apiClient.post('/expert/wallet/withdraw', { amount, bankAccountId });
        return response.data;
    } catch (error) {
        console.error("[Wallet] Withdrawal request failed:", error);
        throw error;
    }
};


