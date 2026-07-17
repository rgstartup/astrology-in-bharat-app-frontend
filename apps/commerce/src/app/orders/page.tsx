"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XSquare,
  User,
  Calendar,
  Download,
  AlertCircle,
  Loader2,
  ShieldCheck,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Phone
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils/cn";
import { getErrorMessage } from "@repo/lib";
import { StatsCards } from "@repo/ui";
import { Skeleton } from "@/components/ui/Skeleton";

import { orderService, Order } from "@/services/order.service";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const toggleRow = (orderId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };
  const queryClient = useQueryClient();

  // Queries
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['merchant-orders', activeTab, searchTerm],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (activeTab !== "All") params.status = activeTab.toLowerCase();
      if (searchTerm) params.search = searchTerm;
      
      const [data, error] = await orderService.getOrders(params);
      if (error) throw error;
      return data;
    }
  });

  const orders: Order[] = orderData?.orders || [];
  const statistics = orderData?.stats || {
    total: 0,
    pending: 0,
    shipped: 0,
    revenue: 0,
  };

  // Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, cancellationReason }: { id: string, status: string, cancellationReason?: string }) => {
      const [data, error] = await orderService.updateStatus(id, status, cancellationReason);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id, status }) => {
      queryClient.setQueriesData({ queryKey: ['merchant-orders'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((o: Order) => o.id === id || o.orderId === id ? { ...o, status } : o)
        };
      });
      toast.success("Status updated successfully");
      setCancelModalOpen(false);
      setCancellationReason("");
      setCancellingOrderId(null);
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error) || "Failed to update status");
    }
  });

  // OTP Verification Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ id, otp }: { id: string, otp: string }) => {
      const [data, error] = await orderService.verifyOtp(id, otp);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      toast.success("Delivery verified and payment released!");
      setOtpModalOpen(false);
      setOtpValue("");
      setVerifyingOrderId(null);
      queryClient.setQueriesData({ queryKey: ['merchant-orders'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((o: Order) => o.id === id || o.orderId === id ? { ...o, status: "delivered" } : o)
        };
      });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error) || "Invalid OTP. Please try again.");
    }
  });

  // OTP Sending Mutation
  const sendOtpMutation = useMutation({
    mutationFn: async (id: string) => {
      const [data, error] = await orderService.sendOtp(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Verification OTP sent to customer");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error) || "Failed to send OTP");
    }
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "delivered") {
      setVerifyingOrderId(orderId);
      setOtpModalOpen(true);
      // Trigger OTP send when modal opens
      sendOtpMutation.mutate(orderId);
    } else if (newStatus === "cancelled") {
      setCancellingOrderId(orderId);
      setCancelModalOpen(true);
    } else {
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-50 text-amber-700 border-amber-100";
      case "paid":
      case "packed":
      case "processing": return "bg-orange-50 text-orange-700 border-orange-100";
      case "shipped": return "bg-blue-50 text-blue-700 border-blue-100";
      case "delivered": return "bg-green-50 text-green-700 border-green-100";
      case "cancelled": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock className="w-3.5 h-3.5" />;
      case "paid":
      case "packed":
      case "processing": return <Clock className="w-3.5 h-3.5" />;
      case "shipped": return <Truck className="w-3.5 h-3.5" />;
      case "delivered": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "cancelled": return <XSquare className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const stats = [
    { label: "Total Orders", value: `${statistics.total}`, icon: ShoppingBag, color: "text-[#fd6410]", trend: "+12%" },
    { label: "Pending", value: `${statistics.pending}`, icon: Clock, color: "text-amber-500", trend: null },
    { label: "Shipped", value: `${statistics.shipped}`, icon: Truck, color: "text-blue-500", trend: null },
    { label: "Revenue", value: formatPrice(statistics.revenue), icon: CheckCircle2, color: "text-green-500", trend: "+5%" },
  ];

  const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <ShoppingBag className="w-8 h-8 text-[#fd6410]" />
             <span>Orders Management</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Track and fulfillment customer orders from here.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
          <Download className="w-4 h-4" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Stats Section - Using Shared Premium Component */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <StatsCards 
          stats={[
            {
              title: "Total Orders",
              value: statistics.total,
              icon: ShoppingBag,
              iconColor: "text-[#fd6410]",
              iconBgColor: "bg-orange-50",
              trend: { value: "+12%", isPositive: true, period: "this month" }
            },
            {
              title: "Pending Orders",
              value: statistics.pending,
              icon: Clock,
              iconColor: "text-amber-600",
              iconBgColor: "bg-amber-50",
            },
            {
              title: "Shipped Orders",
              value: statistics.shipped,
              icon: Truck,
              iconColor: "text-blue-600",
              iconBgColor: "bg-blue-50",
            },
            {
              title: "Total Revenue",
              value: formatPrice(statistics.revenue),
              icon: CheckCircle2,
              iconColor: "text-green-600",
              iconBgColor: "bg-green-50",
              trend: { value: "+5%", isPositive: true }
            }
          ]}
          columns={4}
        />
      </div>

      {/* Logic Tabs & Search */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          <div className="bg-white border-2 border-orange-600 rounded-2xl shadow-sm p-1.5 overflow-hidden max-w-full">
            <div className="flex space-x-1 overflow-x-auto max-w-full scrollbar-thin-orange pb-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 uppercase tracking-widest text-[10px] whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-[#fd6410] text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto text">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#fd6410] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by Order ID or Name..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-orange-600 rounded-2xl text-sm text-gray-800 placeholder:text-gray-500 font-medium focus:outline-none focus:ring-0 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_1.2fr] gap-4 px-8 py-5 bg-white rounded-3xl border border-gray-100 shadow-sm text-[10px] uppercase font-black text-gray-900 tracking-[0.2em]">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Total</div>
          <div>Status</div>
          <div className="text-right">Update Status</div>
        </div>
        
        <div className="space-y-4">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 px-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_1.2fr] gap-4 items-center">
                  <div><Skeleton className="h-4 w-20" /></div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                  <div><Skeleton className="h-4 w-32" /></div>
                  <div><Skeleton className="h-4 w-16" /></div>
                  <div><Skeleton className="h-6 w-24 rounded-full" /></div>
                  <div className="lg:text-right"><Skeleton className="h-8 w-24 rounded-xl lg:ml-auto" /></div>
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                  <ShoppingBag className="w-16 h-16 text-gray-300" />
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-gray-900">No Orders Yet</p>
                    <p className="text-sm font-medium text-gray-500">When customers buy your products, they will appear here.</p>
                  </div>
                </div>
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-orange-200 shadow-sm hover:shadow-md hover:border-orange transition-all duration-300 overflow-hidden group">
              <div 
                className="grid grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_1.2fr] gap-4 lg:gap-4 items-center px-6 py-6 lg:px-8 cursor-pointer relative"
                onClick={() => toggleRow(order.id)}
              >
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-orange-500 transition-colors">
                      {expandedRows.has(order.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block lg:hidden">Order ID</span>
                      <span className="text-sm font-bold text-gray-900 tracking-tight uppercase block">{(order as any).tracking_id || (order as any).trackingId || order.orderNumber || order.short_id || String(order.id).slice(-8)}</span>
                      {order.productName && <span className="text-[11px] font-semibold text-gray-700 mt-1 block truncate max-w-[180px]">{order.productName}</span>}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3">
                    {order.customerImage ? (
                      <img src={order.customerImage} alt={order.customerName} className="w-10 h-10 rounded-full object-cover border border-orange-200" />
                    ) : (
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                         <User className="w-5 h-5 text-[#fd6410]" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{order.customerName}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.itemsCount} Items</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block lg:hidden">Date</span>
                  <div className="flex items-center gap-2 text-gray-800 text-sm font-bold">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(order.date)}
                  </div>
                </div>
                <div className="col-span-1 text-right lg:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block lg:hidden">Total</span>
                  <div className="font-black text-sm text-gray-900">
                    {formatPrice(order.amount)}
                    {(order as any).shippingCharge > 0 && (
                      <span className="text-[11px] text-gray-500 font-bold ml-1.5">+ {formatPrice((order as any).shippingCharge)} <span className="font-medium text-gray-400">Shipping</span></span>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block lg:hidden">Status</span>
                  <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 w-max", getStatusStyle(order.status))}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end lg:block mt-0 lg:mt-0">
                  <div className="flex items-center justify-end w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
                    <select 
                       className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer w-full lg:w-auto"
                       value={order.status.toLowerCase()}
                       onChange={(e) => handleStatusChange(order.orderId || order.id, e.target.value)}
                       disabled={updateStatusMutation.isPending || verifyOtpMutation.isPending}
                    >
                       <option value="pending">Pending</option>
                       <option value="processing">Processing</option>
                       <option value="shipped">Shipped</option>
                       <option value="delivered">Delivered</option>
                       <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              {expandedRows.has(order.id) && order.items && order.items.length > 0 && (
                <div className="border-t border-orange-100 bg-orange-50/30">
                  <div className="py-6 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-inner">
                    <div className="lg:col-span-2 space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Order Items</h5>
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-gray-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">PID: {item.shortProductId || String(item.productId).slice(-8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-700">{item.quantity} x {formatPrice(item.price)}</p>
                            <p className="text-sm font-black text-[#fd6410]">{formatPrice(item.quantity * item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 h-full">
                      <div className="bg-white rounded-[1.5rem] border border-[#fd6410] shadow-sm flex flex-col overflow-hidden h-full">
                         <div className="bg-orange-50/50 p-4 border-b border-orange-100 flex items-center gap-3">
                           <Truck className="w-5 h-5 text-[#fd6410]" />
                           <span className="text-[11px] font-black uppercase tracking-widest text-[#fd6410]">Shipping Address</span>
                         </div>
                         <div className="p-5 flex-1 flex flex-col">
                           {order.shippingAddress ? (
                             <div className="space-y-1 text-sm text-gray-500 font-medium">
                               <p className="font-black text-gray-900 mb-3 text-[17px]">{order.shippingAddress.fullName || (order.shippingAddress as any).full_name || order.customerName}</p>
                               <p>{order.shippingAddress.addressLine1 || (order.shippingAddress as any).line1}</p>
                               {(order.shippingAddress.addressLine2 || (order.shippingAddress as any).line2) && <p>{order.shippingAddress.addressLine2 || (order.shippingAddress as any).line2}</p>}
                               <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode || (order.shippingAddress as any).zip_code || (order.shippingAddress as any).zipCode}</p>
                               <div className="pt-4 border-t border-orange-200/60 mt-4 space-y-2">
                                 <div className="flex items-center gap-2">
                                   <Phone className="w-3.5 h-3.5 text-gray-400" />
                                   <span className="text-gray-600">{order.shippingAddress.phone}</span>
                                 </div>
                                 {((order.shippingAddress as any).alternatePhone || (order.shippingAddress as any).alternate_phone) && (
                                   <div className="flex items-center gap-2">
                                     <Phone className="w-3.5 h-3.5 text-gray-400" />
                                     <span className="text-gray-600">{(order.shippingAddress as any).alternatePhone || (order.shippingAddress as any).alternate_phone}</span>
                                     <span className="text-[9px] text-gray-400 font-bold uppercase">(Alt)</span>
                                   </div>
                                 )}
                               </div>
                             </div>
                           ) : (
                             <div className="text-sm text-gray-400 italic text-center py-6 flex-1 flex flex-col items-center justify-center gap-2">
                               <Truck className="w-8 h-8 text-gray-200" />
                               <span>Shipping details not provided</span>
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            ))}
          </div>
      </div>



      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !verifyOtpMutation.isPending && setOtpModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-6 right-6">
               <button 
                onClick={() => setOtpModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={verifyOtpMutation.isPending}
               >
                 <X className="w-5 h-5 text-gray-400" />
               </button>
            </div>

            <div className="p-8 sm:p-10">
              <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                 <ShieldCheck className="w-8 h-8 text-[#fd6410]" />
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Verify Delivery</h3>
                <p className="text-gray-500 text-sm">Please enter the 6-digit OTP provided by the customer to complete the delivery.</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#fd6410] transition-all"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    disabled={verifyOtpMutation.isPending}
                  />
                  {!otpValue && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-gray-300 text-sm font-bold uppercase tracking-widest">000000</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => verifyingOrderId && verifyOtpMutation.mutate({ id: verifyingOrderId, otp: otpValue })}
                    disabled={otpValue.length !== 6 || verifyOtpMutation.isPending}
                    className="w-full py-4 bg-[#fd6410] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e85a0e] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 active:scale-95"
                  >
                    {verifyOtpMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify & Complete</span>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-2">
                     <span className="text-xs text-gray-400">Didn't get the code?</span>
                     <button 
                        onClick={() => verifyingOrderId && sendOtpMutation.mutate(verifyingOrderId)}
                        disabled={sendOtpMutation.isPending}
                        className="text-xs font-bold text-[#fd6410] hover:underline disabled:opacity-50"
                     >
                        {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                     </button>
                  </div>
                  <button 
                    onClick={() => setOtpModalOpen(false)}
                    className="w-full py-4 bg-white text-gray-400 font-bold rounded-2xl hover:text-gray-600 transition-colors"
                    disabled={verifyOtpMutation.isPending}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 text-center">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center justify-center gap-2">
                 <AlertCircle className="w-3 h-3" />
                 Payment will be released after verification
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !updateStatusMutation.isPending && setCancelModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10">
              <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                 <XSquare className="w-8 h-8 text-red-600" />
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Cancel Order</h3>
                <p className="text-gray-500 text-sm">Please provide a reason for cancelling this order. This will be sent to the customer.</p>
              </div>

              <div className="space-y-6">
                <textarea 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[120px] resize-none"
                  placeholder="e.g. Out of stock, Delivery area unavailable..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => cancellingOrderId && updateStatusMutation.mutate({ id: cancellingOrderId, status: "cancelled", cancellationReason })}
                    disabled={!cancellationReason.trim() || updateStatusMutation.isPending}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 active:scale-95"
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Cancel Order</span>
                    )}
                  </button>
                  <button 
                    onClick={() => setCancelModalOpen(false)}
                    className="w-full py-4 bg-white text-gray-400 font-bold rounded-2xl hover:text-gray-600 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
