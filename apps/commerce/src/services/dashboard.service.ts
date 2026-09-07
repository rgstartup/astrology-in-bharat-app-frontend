import { api } from '@/lib/api';
import { 
  MerchantStats, 
  DashboardOrder, 
  MerchantActivity, 
  MerchantPerformance, 
  ApiResponse 
} from '@/types/dashboard';

export const dashboardService = {
  getStats: async () => {
    const [response, error] = await api.get<ApiResponse<MerchantStats>>('/merchant/stats');
    if (error) return [null, error] as const;
    return [response?.data ?? null, null] as const;
  },

  getRecentOrders: async () => {
    const [response, error] = await api.get<ApiResponse<DashboardOrder[]>>('/merchant/orders/recent');
    if (error) return [[], error] as const;
    return [response?.data ?? [], null] as const;
  },

  getActivity: async () => {
    const [response, error] = await api.get<ApiResponse<MerchantActivity[]>>('/merchant/activity');
    if (error) return [[], error] as const;
    return [response?.data ?? [], null] as const;
  },

  getPerformance: async () => {
    const [response, error] = await api.get<ApiResponse<MerchantPerformance>>('/merchant/performance');
    if (error) return [null, error] as const;
    return [response?.data ?? null, null] as const;
  },

  getAnalytics: async () => {
    const [response, error] = await api.get<ApiResponse<any>>('/merchant/analytics');
    if (error) return [null, error] as const;
    return [response?.data ?? null, null] as const;
  }
};
