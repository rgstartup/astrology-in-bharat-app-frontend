"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n";
import { Package, Calendar, ChevronRight } from "@repo/design/lucide";
import { ShopOrderService } from "@/features/shop";

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    ShopOrderService.getMyOrders().then(([res, err]) => {
      if (!isMounted) return;
      if (!err && res) {
        const data = res?.data ?? res;
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e4de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
            My Orders
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track your purchases of energized gemstones, yantras, and sacred items
          </p>
        </div>
        <Link
          href="/shop"
          className="h-10 px-5 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-medium flex items-center justify-center transition-colors"
        >
          Explore Shop
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 animate-pulse space-y-3"
            >
              <div className="h-4 w-48 bg-white/60 rounded-sm"></div>
              <div className="h-3 w-32 bg-white/60 rounded-sm"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center mx-auto text-neutral-900">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            No Orders Placed Yet
          </h2>
          <p className="text-xs text-neutral-500">
            You have not placed any orders yet. Visit our shop to find energized spiritual items.
          </p>
          <Link
            href="/shop"
            className="inline-flex h-11 px-6 rounded-full bg-neutral-900 text-white text-xs font-medium items-center justify-center hover:bg-black transition-colors"
          >
            Visit Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord: any) => {
            const date = ord.created_at
              ? new Date(ord.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recent";

            return (
              <div
                key={ord.id}
                className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5 sm:p-6 hover:border-[#111111] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#e8e4de] flex items-center justify-center text-neutral-900 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-900">
                        Order #{ord.order_number || String(ord.id).slice(0, 8).toUpperCase()}
                      </h3>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-[#e8e4de] text-neutral-900 capitalize">
                        {ord.status || "Confirmed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-900" />
                        {date}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-neutral-900">
                        ₹{ord.total_amount || ord.amount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-medium text-neutral-900">
                  <span>Details</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
