"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ClientWalletTransactionPurpose,
  ClientWalletTransaction,
  IPaginatedClientWalletTransaction,
} from "@repo/lib";
import { api, API_ROUTES } from "@/actions";

const PAGE_SIZE = 10;

export type TabFilterType = "all" | "recharge";

export interface TabDataState {
  items: ClientWalletTransaction[];
  page: number;
  hasMore: boolean;
  loaded: boolean;
}

interface WalletTransactionParams {
  page: number;
  limit: number;
  purpose?: ClientWalletTransactionPurpose;
}

export function useWalletTransactions() {
  const [tabFilter, setTabFilter] = useState<TabFilterType>("all");
  const [tabData, setTabData] = useState<Record<TabFilterType, TabDataState>>({
    all: { items: [], page: 1, hasMore: false, loaded: false },
    recharge: { items: [], page: 1, hasMore: false, loaded: false },
  });
  const [isFetchingTx, setIsFetchingTx] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const fetchTransactions = useCallback(
    async (
      pageNum = 1,
      currentFilter: TabFilterType = tabFilter,
      forceShowLoader = false,
    ) => {
      if (pageNum === 1) {
        setIsFetchingTx(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const params: WalletTransactionParams = {
          page: pageNum,
          limit: PAGE_SIZE,
        };

        if (currentFilter === "recharge") {
          params.purpose = ClientWalletTransactionPurpose.RECHARGE;
        }

        const [res, err] = await api.get<IPaginatedClientWalletTransaction>(
          API_ROUTES.CLIENT.WALLET.TRANSACTIONS,
          { params },
        );

        if (err || !res?.data) {
          if (pageNum === 1) {
            setTabData((prev) => ({
              ...prev,
              [currentFilter]: {
                items: [],
                page: 1,
                hasMore: false,
                loaded: true,
              },
            }));
          }
          return;
        }

        const txArray = res.data;
        const hasNext = res.meta?.hasNextPage ?? false;

        setTabData((prev) => {
          const currentTabState = prev[currentFilter];
          let updatedItems = txArray;

          if (pageNum > 1) {
            const existingIds = new Set(currentTabState.items.map((t) => t.id));
            const newTxs = txArray.filter((t) => !existingIds.has(t.id));
            updatedItems = [...currentTabState.items, ...newTxs];
          }

          return {
            ...prev,
            [currentFilter]: {
              items: updatedItems,
              page: pageNum,
              hasMore: hasNext,
              loaded: true,
            },
          };
        });
      } finally {
        setIsFetchingTx(false);
        setIsLoadingMore(false);
      }
    },
    [tabFilter],
  );

  useEffect(() => {
    if (!tabData[tabFilter].loaded) {
      fetchTransactions(1, tabFilter);
    }
  }, [tabFilter, tabData, fetchTransactions]);

  const handleFilterChange = (newFilter: TabFilterType) => {
    if (newFilter === tabFilter) return;
    setTabFilter(newFilter);
    if (!tabData[newFilter].loaded) {
      fetchTransactions(1, newFilter, true);
    }
  };

  const handleLoadMore = () => {
    const currentTabState = tabData[tabFilter];
    if (!isLoadingMore && currentTabState.hasMore) {
      fetchTransactions(currentTabState.page + 1, tabFilter);
    }
  };

  const resetAndRefresh = useCallback(() => {
    setTabData({
      all: { items: [], page: 1, hasMore: false, loaded: false },
      recharge: { items: [], page: 1, hasMore: false, loaded: false },
    });
    fetchTransactions(1, tabFilter, true);
  }, [fetchTransactions, tabFilter]);

  const currentTab = tabData[tabFilter] || {
    items: [],
    page: 1,
    hasMore: false,
    loaded: false,
  };

  return {
    tabFilter,
    currentTab,
    isFetchingTx,
    isLoadingMore,
    handleFilterChange,
    handleLoadMore,
    resetAndRefresh,
  };
}
