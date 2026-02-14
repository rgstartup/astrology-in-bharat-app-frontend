export interface WalletStatsData {
    availableBalance: number;
    totalWithdrawn: number;
    pendingWithdrawals: number;
    balanceTrend?: number;
}

export interface WalletTransaction {
    id: string;
    date: string;
    description: string;
    type: 'credit' | 'debit';
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'processing';
    bankAccount?: string;
}

export interface BankAccount {
    id: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    is_primary: boolean;
}
