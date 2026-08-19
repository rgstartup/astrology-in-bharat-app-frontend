"use client";

import React, { useState, useEffect } from "react";
import { getMerchantSalesOverview, getMerchantSalesDetails } from "@/services/admin.service";
import { 
  Store, 
  IndianRupee, 
  Package, 
  ArrowLeft, 
  Search, 
  User, 
  Calendar,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  MapPin,
  Star,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
  Clock
} from "lucide-react";

interface MerchantCard {
  id: string;
  userId: string;
  shopName: string;
  managerName: string;
  phone: string;
  city: string;
  image: string | null;
  rating: number;
  reviewCount: number;
  isTrusted: boolean;
  totalRevenue: number;
  totalOrders: number;
  status: string;
}

interface SaleDetail {
  id: string;
  orderId: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  status: string;
  date: string;
}

const MerchantOrders = () => {
  const [merchants, setMerchants] = useState<MerchantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<number | null>(null);
  const [merchantDetails, setMerchantDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setLoading(true);
    const [data, error] = await getMerchantSalesOverview();
    if (data) setMerchants(data);
    setLoading(false);
  };

  const handleMerchantClick = async (id: string) => {
    setSelectedMerchant(id);
    setDetailsLoading(true);
    const [data, error] = await getMerchantSalesDetails(id);
    if (data) setMerchantDetails(data);
    setDetailsLoading(false);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const filteredMerchants = merchants.filter(m => 
    m.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group sales by Order ID
  const groupedOrders = merchantDetails?.sales ? merchantDetails.sales.reduce((acc: any, item: SaleDetail) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = {
        orderId: item.orderId,
        customer: item.customer,
        date: item.date,
        status: item.status,
        totalAmount: 0,
        items: []
      };
    }
    acc[item.orderId].items.push(item);
    acc[item.orderId].totalAmount += item.totalPrice;
    return acc;
  }, {}) : {};

  const orderList = Object.values(groupedOrders).sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedMerchant && merchantDetails) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => {
            setSelectedMerchant(null);
            setMerchantDetails(null);
            setExpandedOrders({});
          }}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <div className="p-2 rounded-full bg-secondary group-hover:bg-primary/10 mr-2 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Overview
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-card border rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Store className="w-32 h-32" />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 p-1 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                  {merchantDetails.merchant.image ? (
                    <img src={merchantDetails.merchant.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-10 h-10 text-orange-500" />
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h2 className="text-3xl font-black tracking-tight">{merchantDetails.merchant.shopName}</h2>
                  {merchants.find(m => m.id === selectedMerchant)?.isTrusted && (
                    <ShieldCheck className="w-6 h-6 text-blue-500 fill-blue-50" />
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start text-muted-foreground gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full"><User className="w-4 h-4" /> {merchantDetails.merchant.managerName}</span>
                  <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full"><MapPin className="w-4 h-4" /> {merchantDetails.merchant.city}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= (merchants.find(m => m.id === selectedMerchant)?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                  <span className="text-sm font-bold ml-2">{(merchants.find(m => m.id === selectedMerchant)?.rating || 0).toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground ml-1">({merchants.find(m => m.id === selectedMerchant)?.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-2">Merchant Revenue</p>
              <h3 className="text-4xl font-black flex items-baseline gap-1">
                <IndianRupee className="w-6 h-6" />
                {merchants.find(m => m.id === selectedMerchant)?.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="mt-8 flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-indigo-200 text-xs font-medium">Total Orders</span>
                <span className="text-xl font-bold">{merchants.find(m => m.id === selectedMerchant)?.totalOrders}</span>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b flex items-center justify-between bg-muted/20">
            <h3 className="font-bold text-xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Package className="w-5 h-5" />
              </div>
              Grouped Order History
            </h3>
            <div className="text-sm font-bold text-muted-foreground bg-white px-4 py-1 rounded-full border">
              {orderList.length} Unique Orders
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/10 text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer Info</th>
                  <th className="px-8 py-5">Total Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orderList.length > 0 ? (
                  orderList.map((order: any) => (
                    <React.Fragment key={order.orderId}>
                      <tr 
                        onClick={() => toggleOrderExpand(order.orderId)}
                        className={`hover:bg-muted/30 transition-all cursor-pointer ${expandedOrders[order.orderId] ? "bg-primary/5" : ""}`}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                               <ShoppingBag className="w-4 h-4" />
                             </div>
                             <span className="font-bold font-mono">#{String(order.orderId).padStart(5, '0')}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{order.customer.name}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                               <Smartphone className="w-3 h-3" /> {order.customer.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center font-black text-primary text-lg">
                            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                            {order.totalAmount}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold">{order.items.length} Items in this order</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit border ${
                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                            order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-sky-50 text-sky-600 border-sky-200'
                          }`}>
                            {order.status}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center text-xs font-semibold text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-2" />
                            {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex justify-center">
                            {expandedOrders[order.orderId] ? (
                              <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedOrders[order.orderId] && (
                        <tr className="bg-primary/[0.02] animate-in slide-in-from-top-2 duration-300">
                          <td colSpan={6} className="px-12 py-6 border-l-4 border-primary">
                             <div className="bg-white rounded-2xl border p-4 shadow-inner">
                               <div className="grid grid-cols-1 gap-4">
                                 {order.items.map((item: SaleDetail) => (
                                   <div key={item.id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-xl transition-colors border-b last:border-0 border-dashed">
                                     <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                                         <Package className="w-6 h-6" />
                                       </div>
                                       <div>
                                         <p className="font-bold text-sm">{item.product.name}</p>
                                         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">SKU: {item.product.sku || 'N/A'}</p>
                                       </div>
                                     </div>
                                     <div className="flex items-center gap-8">
                                       <div className="text-center">
                                         <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">Quantity</p>
                                         <p className="font-bold text-sm">x {item.quantity}</p>
                                       </div>
                                       <div className="text-center">
                                         <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">Item Price</p>
                                         <p className="font-bold text-sm">₹{item.product.price}</p>
                                       </div>
                                       <div className="text-right min-w-[100px]">
                                         <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">Subtotal</p>
                                         <p className="font-black text-primary">₹{item.totalPrice}</p>
                                       </div>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No sales records found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-1 bg-primary rounded-full"></div>
             <span className="text-primary font-black uppercase tracking-widest text-[10px]">Merchant Analytics</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Shop Performance</h2>
          <p className="text-muted-foreground font-medium mt-1">Track growth, revenue and order volume per merchant.</p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by shop, manager or city..." 
            className="w-full pl-12 pr-6 py-4 rounded-2xl border bg-card/50 backdrop-blur-sm focus:ring-4 focus:ring-primary/10 border-border/50 outline-none transition-all font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredMerchants.map((merchant) => (
          <div 
            key={merchant.id}
            onClick={() => handleMerchantClick(merchant.id)}
            className="group bg-card border rounded-[32px] p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col border-border/60 hover:border-primary/50 hover:-translate-y-2"
          >
            {/* Colorful Header Background */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-orange-400/10 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                  {merchant.image ? (
                    <img src={merchant.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-orange-500" />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2.5 py-1 rounded-xl text-[10px] font-black border border-yellow-400/20">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {Number(merchant.rating).toFixed(1)}
                </div>
                {merchant.isTrusted && (
                  <div className="bg-blue-500/10 text-blue-600 p-1.5 rounded-xl border border-blue-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative z-10 mb-6">
              <h3 className="font-black text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">{merchant.shopName}</h3>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary/60" /> {merchant.managerName}
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500/60" /> {merchant.city}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto border-t pt-6 relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Revenue</span>
                <span className="font-black flex items-center text-foreground text-lg">
                  <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-primary" />
                  {merchant.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Orders</span>
                <span className="font-black text-foreground text-lg bg-secondary/50 px-3 rounded-xl">
                  {merchant.totalOrders}
                </span>
              </div>
            </div>

            {/* Hover Action Indicator */}
            <div className="absolute right-6 top-[110px] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
               <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                  <ChevronRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMerchants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-card/30 rounded-[40px] border-4 border-dashed border-muted/50">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-muted" />
          </div>
          <p className="text-muted-foreground text-xl font-bold">No shops found matching your search</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 text-primary font-black uppercase text-xs tracking-widest hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MerchantOrders;
