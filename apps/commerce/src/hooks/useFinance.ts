import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/services/finance.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

/**
 * Hook to fetch merchant financial stats
 */
export const useMerchantFinanceStats = () => {
  return useQuery({
    queryKey: ['merchant-finance-stats'],
    queryFn: async () => {
      const [data, error] = await financeService.getStats();
      if (error) {
        throw new Error("Failed to fetch finance stats");
      }
      return data;
    },
  });
};

/**
 * Hook to fetch merchant transactions
 */
export const useMerchantTransactions = (params: any) => {
  return useQuery({
    queryKey: ['merchant-transactions', params],
    queryFn: async () => {
      const [data, error] = await financeService.getTransactions(params);
      if (error) {
        throw new Error("Failed to fetch transactions");
      }
      return data;
    },
  });
};

/**
 * Hook to request a withdrawal
 */
export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, bankAccountId }: { amount: number, bankAccountId?: string }) => {
      const [data, error] = await financeService.requestWithdrawal(amount, bankAccountId);
      if (error) {
        throw new Error(getErrorMessage(error) || "Withdrawal request failed");
      }
      return data;
    },
    onSuccess: (_, { amount }) => {
      toast.success("Withdrawal request submitted successfully!");
      queryClient.setQueriesData({ queryKey: ['merchant-finance-stats'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          availableBalance: Math.max(0, old.availableBalance - amount),
          pendingPayout: old.pendingPayout + amount
        };
      });
      queryClient.setQueriesData({ queryKey: ['merchant-transactions'] }, (old: any) => {
        if (!old || !old.transactions) return old;
        const newTx = {
            id: "REQ" + Date.now().toString().slice(-6),
            amount: amount,
            amountLabel: `₹${amount.toLocaleString('en-IN')}`,
            status: "pending",
            date: new Date().toISOString(),
            type: "withdrawal",
            typeLabel: "Withdrawal Request",
            color: "text-orange-500",
            icon: "clock",
            info: "Withdrawal Request",
            remark: ""
        };
        return {
            ...old,
            transactions: [newTx, ...old.transactions]
        };
      });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    }
  });
};
