"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Card, Button, Skeleton } from "@/features/dashboard";
import { api } from "@/actions";
import { ShoppingBag, Calendar, Package, ArrowRight } from "lucide-react";

export default function MyOrdersDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setIsLoading(true);
      const [res, err] = await api.get<any>("/orders/my-orders");
      if (!isMounted) return;

      if (!err && res) {
        const data = res?.data ?? res;
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track your purchases of astrological gemstones, yantras, and puja items
          </p>
        </div>

        <Link href={PATHS.BUY_PRODUCTS} className="no-underline">
          <Button variant="default" size="sm" className="font-bold">
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            <span>Explore Astro Shop</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-5 border-orange-100 bg-white space-y-2">
              <Skeleton className="h-5 w-48 bg-orange-100" />
              <Skeleton className="h-4 w-32 bg-orange-100" />
            </Card>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <Card className="p-12 text-center border-orange-200/80 bg-white">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#ff6b00] flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-outfit mb-1">
            No Orders Placed Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Find energized rudraksha beads, yantras, certified gemstones, and puja samagri in our store.
          </p>
          <Link href={PATHS.BUY_PRODUCTS} className="no-underline">
            <Button variant="default" className="font-bold">
              <span>Visit Astrology Store</span>
            </Button>
          </Link>
        </Card>
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
              <Card
                key={ord.id}
                className="p-5 border-orange-100 bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff6b00] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-outfit">
                      Order #{ord.order_number || String(ord.id).slice(0, 8).toUpperCase()}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Total: ₹{ord.total_amount || ord.amount || 0}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{date}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-600">
                        {ord.status || "Completed"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-xs font-bold text-[#ff6b00]">
                    View Details →
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
