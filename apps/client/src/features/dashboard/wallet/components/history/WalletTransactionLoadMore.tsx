import React from "react";
import { Button } from "@/features/dashboard";
import { RefreshCw } from "lucide-react";

interface WalletTransactionLoadMoreProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function WalletTransactionLoadMore({
  hasMore,
  isLoadingMore,
  onLoadMore,
}: WalletTransactionLoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className="pt-2 text-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onLoadMore}
        disabled={isLoadingMore}
        className="rounded-full font-bold text-xs h-8 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 cursor-pointer"
      >
        {isLoadingMore ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <span>Load More Transactions</span>
        )}
      </Button>
    </div>
  );
}
