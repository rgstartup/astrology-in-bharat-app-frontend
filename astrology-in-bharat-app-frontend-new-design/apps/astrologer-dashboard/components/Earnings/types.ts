export interface EarningsStatsData {
    totalRevenue: number;
    walletBalance: number;
    totalWithdrawn: number;
    revenueGrowth?: number;
    balanceGrowth?: number;
    withdrawalGrowth?: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
    projected?: number;
}

export interface RevenueBreakdown {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    type: 'credit' | 'debit';
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'received';
}

export interface TopUser {
    id: string;
    name: string;
    avatar?: string;
    totalSpent: number;
    sessions: number;
}

export interface TopService {
    id: string;
    name: string;
    revenue: number;
    usageCount: number;
    color: string;
}

export interface EarningsDashboardData {
    stats: EarningsStatsData;
    incomeTrends: ChartDataPoint[];
    revenueBreakdown: RevenueBreakdown[];
    recentTransactions: Transaction[];
    topUsers: TopUser[];
    topServices: TopService[];
}
