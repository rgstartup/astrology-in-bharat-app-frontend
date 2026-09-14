"use client";

import { useEffect } from "react";
import { merchantSocket } from "@/lib/socket";
import { useMerchantStore } from "@/store/useMerchantStore";

export default function MerchantStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleStatusUpdate = (data: {
      merchant_id?: string | number;
      merchantId?: string | number;
      id?: string | number;
      is_online?: boolean;
      isOnline?: boolean;
      status?: string;
    }) => {
      const merchantId = data.merchant_id ?? data.merchantId ?? data.id;
      if (merchantId === undefined || merchantId === null) return;

      const isOnline =
        data.is_online !== undefined
          ? data.is_online
          : data.isOnline !== undefined
            ? data.isOnline
            : data.status === "online";

      useMerchantStore.getState().updateMerchantStatus(merchantId, isOnline);
    };

    if (!merchantSocket.connected) merchantSocket.connect();
    merchantSocket.on("merchant_status_changed", handleStatusUpdate);

    return () => {
      merchantSocket.off("merchant_status_changed", handleStatusUpdate);
    };
  }, []);

  return <>{children}</>;
}
