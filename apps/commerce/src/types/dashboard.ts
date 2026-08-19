export interface StatValue {
  value: number | string;
  trend: string;
}

export interface MerchantStats {
  totalOrders: StatValue;
  todayOrders: StatValue;
  totalProducts: StatValue;
  totalEarnings: StatValue;
  monthlyEarnings: StatValue;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
  product?: {
    id: string;
    name: string;
    image_url: string;
  };
}

export interface DashboardOrder {
  id: string;
  user_id?: string;
  customerName?: string;
  total_amount?: string;
  amount?: number | string;
  status: string;
  created_at?: string;
  date?: string;
  items?: OrderItem[];
}

export interface MerchantActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface MerchantPerformance {
  weeklyTargetProgress: number;
  currentTier: string;
  rating: number;
  reviewCount: number;
  growthRate?: string;
  salesData?: {
    date: string;
    sales: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
