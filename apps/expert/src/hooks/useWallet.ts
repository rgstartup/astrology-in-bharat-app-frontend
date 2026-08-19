import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWalletBalance, getWalletTransactions, requestWithdrawal } from "@/lib/wallet";
import { getBankAccounts } from "@/lib/profile";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

// Helper to handle [data, error] pattern and throw for React Query
const wrapApi = async <T>(apiCall: Promise<[T | null, any | null]>): Promise<T> => {
  const [data, error] = await apiCall;
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (data === null) throw new Error("No data returned");
  return data;
};

export const useWallet = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Balance
  const balanceQuery = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => wrapApi(getWalletBalance()),
    staleTime: 30 * 1000, // 30 seconds for balance
  });

  // 2. Fetch Transactions
  const transactionsQuery = useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: () => wrapApi(getWalletTransactions()),
  });

  // 3. Fetch Bank Accounts
  const bankAccountsQuery = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: async () => {
      const [accounts, error] = await getBankAccounts();
      if (error) throw new Error(getErrorMessage(error));
      const accountsData = (accounts as any)?.data || accounts;
      return Array.isArray(accountsData) ? accountsData : [];
    },
  });

  // 4. Withdrawal Mutation
  const withdrawMutation = useMutation({
    mutationFn: ({ amount, bankAccountId }: { amount: number; bankAccountId: string }) =>
      wrapApi(requestWithdrawal(amount, bankAccountId)),
    onSuccess: () => {
      // Invalidate queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Withdrawal request submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || "Failed to submit withdrawal request");
    },
  });

  return {
    stats: balanceQuery.data,
    transactions: transactionsQuery.data?.transactions || [],
    bankAccounts: bankAccountsQuery.data || [],
    isLoading: balanceQuery.isLoading || transactionsQuery.isLoading || bankAccountsQuery.isLoading,
    isRefetching: balanceQuery.isRefetching || transactionsQuery.isRefetching,
    error: balanceQuery.error || transactionsQuery.error || bankAccountsQuery.error,
    handleWithdraw: (amount: number, bankAccountId: string) => 
      withdrawMutation.mutate({ amount, bankAccountId }),
    isWithdrawing: withdrawMutation.isPending,
    refreshData: () => queryClient.invalidateQueries({ queryKey: ["wallet"] }),
  };
};
