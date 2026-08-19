"use client";

import { useProfileBaseLogic } from "./hooks/useProfileBaseLogic";
import { useProfileWalletLogic } from "./hooks/useProfileWalletLogic";
import { useProfileOrdersHistoryLogic } from "./hooks/useProfileOrdersHistoryLogic";
import { useProfileOtherLogic } from "./hooks/useProfileOtherLogic";
import { useProfilePujaLogic } from "./hooks/useProfilePujaLogic";

export const useProfileLogic = () => {
    const base = useProfileBaseLogic();
    const wallet = useProfileWalletLogic(
        base.isAuthenticated,
        base.profileData,
        base.user,
        base.refreshBalance,
        base.activeTab,
    );
    const orderHistory = useProfileOrdersHistoryLogic(
        base.isAuthenticated,
        base.activeTab,
    );
    const other = useProfileOtherLogic(
        base.isAuthenticated,
        base.user,
        base.activeTab,
        orderHistory.setOrders,
    );
    const puja = useProfilePujaLogic(
        base.isAuthenticated,
        base.activeTab
    );

    return {
        ...base,
        ...wallet,
        ...orderHistory,
        ...other,
        ...puja,
    };
};
