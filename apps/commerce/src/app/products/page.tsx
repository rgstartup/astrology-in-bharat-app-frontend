"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Package,
  ArrowUpDown,
  Check,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getErrorMessage } from "@repo/lib";
import { Skeleton } from "@/components/ui/Skeleton";
import { productService } from "@/services/product.service";
import { QuickViewModal } from "@/components/QuickViewModal";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  imageUrl?: string;
  sku?: string;
  gallery?: string[];
  description?: string;
  original_price?: number;
  created_at?: string;
  is_shipping_chargeable?: boolean;
  shipping_charge?: number;
}

export default function ProductListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['merchant-products', activeTab, searchTerm],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (activeTab !== "All") {
        params.status = activeTab === "Out of Stock" ? "out_of_stock" : activeTab.toLowerCase();
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const [data, error] = await productService.getProducts(params);
      if (error) throw new Error(getErrorMessage(error) || "Failed to fetch products");
      return data;
    }
  });

  const products: Product[] = data?.products || [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const [data, error] = await productService.deleteProduct(id);
      if (error) throw new Error(getErrorMessage(error) || "Failed to delete product");
    },
    onSuccess: (_, id) => {
      queryClient.setQueriesData({ queryKey: ['merchant-products'] }, (old: any) => {
        if (!old) return old;
        return {
           ...old,
           products: old.products.filter((p: Product) => p.id !== id),
           total: Math.max(0, (old.total || 0) - 1)
        };
      });
      setSelectedIds([]);
    }
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[], status: 'active' | 'out_of_stock' }) => {
      const [data, error] = await productService.bulkUpdateStatus(ids, status);
      if (error) throw new Error(getErrorMessage(error) || "Failed to update status");
    },
    onSuccess: (_, { ids, status }) => {
      queryClient.setQueriesData({ queryKey: ['merchant-products'] }, (old: any) => {
        if (!old) return old;
        return {
           ...old,
           products: old.products.map((p: Product) => ids.includes(p.id) ? { ...p, status } : p)
        };
      });
      setSelectedIds([]);
    }
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === products.length && products.length > 0 ? [] : products.map(p => p.id));
  };

  const getFrontendStatus = (status: string) => {
    if (status === 'out_of_stock') return 'Out of Stock';
    if (status === 'active') return 'Active';
    if (status === 'draft') return 'Draft';
    return status;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-700 border-green-100 ring-green-500/20";
      case "out_of_stock": return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20";
      case "draft": return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20";
      default: return "bg-gray-50 text-gray-700 border-gray-100 ring-gray-400/20";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const tabs = ["All", "Active", "Out of Stock", "Draft"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             Product Inventory
          </h2>
          <div className="text-gray-700 text-sm mt-1.5 flex items-center">
             {isLoading ? (
               <Skeleton className="h-4 w-6 rounded mr-1" />
             ) : (
               <span className="font-bold text-[#fd6410]">{data?.total || 0}</span>
             )}
             <span className="ml-1 italic">Total Products in current catalog</span>
          </div>
        </div>
        <Link 
          href="/products/add" 
          className="flex items-center justify-center space-x-2 bg-[#fd6410] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Control Bar (Tabs & Search) */}
      <div className="space-y-4">
        {/* Bulk Action Bar (Floating) */}
        {selectedIds.length > 0 && (
          <div className="bg-gray-900 text-white rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-top-4 duration-300 ring-4 ring-gray-900/10">
             <div className="flex items-center space-x-4 pl-0 md:pl-2 w-full md:w-auto">
                <div className="w-8 h-8 bg-[#fd6410] rounded-full flex items-center justify-center shadow-inner shrink-0">
                   <Check className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight whitespace-nowrap">{selectedIds.length} Products Selected</span>
             </div>
             <div className="flex flex-wrap items-center gap-2 md:gap-3 pr-0 md:pr-2 w-full md:w-auto">
                <button 
                  onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'active' })}
                  disabled={bulkStatusMutation.isPending}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                   <CheckCircle2 className="w-3.5 h-3.5" /> Mark Active
                </button>
                <button 
                  onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'out_of_stock' })}
                  disabled={bulkStatusMutation.isPending}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                   <XCircle className="w-3.5 h-3.5" /> Out of Stock
                </button>
                <div className="hidden md:block w-[1px] h-6 bg-white/10" />
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete these products?")) {
                      selectedIds.forEach(id => deleteMutation.mutate(id));
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                   <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
             </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          {/* Tabs */}
          <div className="flex p-1.5 bg-white border border-[#fd6410] rounded-2xl shadow-sm space-x-1 overflow-x-auto max-w-full scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 capitalize whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-[#fd6410]/50",
                  activeTab === tab 
                    ? "bg-[#fd6410] text-white shadow-md" 
                    : "text-slate-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#fd6410] transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#fd6410] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fd6410]/50 focus:border-[#fd6410] transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            

          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto pb-10">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead className="text-sm font-semibold text-slate-700 capitalize">
            <tr>
              <th className="pl-8 pr-4 py-5 w-10">
                <button 
                  onClick={toggleSelectAll}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                    selectedIds.length === products.length && products.length > 0
                      ? "bg-[#fd6410] border-[#fd6410] text-white" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {selectedIds.length === products.length && products.length > 0 && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                </button>
              </th>
              <th className="px-4 py-5">Product Info</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">
                 <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-600 transition-colors">
                    Price <ArrowUpDown className="w-3 h-3" />
                 </div>
              </th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-6 py-5">Shipping</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-transparent">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="pl-8 pr-4 py-6"><Skeleton className="h-4 w-4 rounded" /></td>
                  <td className="px-4 py-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-14 h-14 rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6"><Skeleton className="h-6 w-20 rounded-lg" /></td>
                  <td className="px-6 py-6"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-6"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-6">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-1.5 w-16 rounded-full" />
                    </div>
                  </td>
                  <td className="px-6 py-6"><Skeleton className="h-6 w-24 rounded-full" /></td>
                  <td className="px-8 py-6 text-right"><Skeleton className="h-8 w-24 rounded-xl ml-auto" /></td>
                </tr>
              ))
            ) : products.map((p: Product) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <tr 
                   key={p.id} 
                   className="group transition-all duration-300"
                >
                  <td className={cn("pl-8 pr-4 py-5 rounded-l-[2rem] border-y border-l transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                    <button 
                      onClick={() => toggleSelect(p.id)}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                        isSelected 
                          ? "bg-[#fd6410] border-[#fd6410] text-white" 
                          : "border-gray-200 hover:border-gray-300 group-hover:border-orange-300"
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                    </button>
                  </td>
                  <td className={cn("px-4 py-5 border-y transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm relative">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-orange-50/50 flex items-center justify-center">
                             <Package className="w-6 h-6 text-orange-200" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#fd6410] transition-colors">{p.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">ID: {(p as any).short_id || String(p.id).slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cn("px-6 py-5 border-y transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                     <span className="inline-block whitespace-nowrap py-1.5 px-3 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100 capitalize">
                       {p.category}
                     </span>
                  </td>
                  <td className={cn("px-6 py-5 font-bold text-sm text-gray-900 tracking-tight border-y transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                    {formatPrice(p.price)}
                  </td>
                  <td className={cn("px-6 py-5 border-y transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                    <div className="flex flex-col">
                       <span className="font-bold text-xs text-gray-700">{p.stock} units</span>
                       <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div 
                             className={cn("h-full rounded-full transition-all duration-1000", p.stock > 0 ? "bg-[#fd6410]" : "bg-gray-300")} 
                             style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                          />
                       </div>
                    </div>
                  </td>
                  <td className={cn("px-6 py-5 border-y transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                     {p.is_shipping_chargeable && Number(p.shipping_charge) > 0 ? (
                       <span className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                         ₹{Number(p.shipping_charge).toFixed(0)}
                       </span>
                     ) : (
                       <span className="inline-flex items-center whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                         FREE
                       </span>
                     )}
                  </td>
                  <td className={cn("px-6 py-5 border-y transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                    <span className={cn("inline-block whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold capitalize border ring-2 ring-offset-0 transition-all", getStatusBadge(p.status))}>
                      {getFrontendStatus(p.status)}
                    </span>
                  </td>
                  <td className={cn("px-8 py-5 text-right rounded-r-[2rem] border-y border-r transition-all duration-300", isSelected ? "bg-orange-50/50 border-[#fd6410]/50" : "bg-white border-orange-200/60 group-hover:border-[#fd6410]/50 shadow-sm group-hover:shadow-md")}>
                    <div className="flex items-center justify-end space-x-1 transition-all duration-300">
                      <button 
                        onClick={() => setQuickViewProduct(p)}
                        className="p-2.5 text-gray-400 hover:text-orange-500 hover:bg-orange-100/50 rounded-xl transition-all" 
                        title="Quick View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <Link href={`/products/edit/${p.id}`}>
                        <button className="p-2.5 text-gray-400 hover:text-[#fd6410] hover:bg-orange-100/50 rounded-xl transition-all" title="Edit">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => {
                          if (window.confirm("Delete this product?")) {
                            deleteMutation.mutate(p.id);
                          }
                        }}
                        className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" 
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="bg-white py-24 px-8 flex flex-col items-center justify-center text-center rounded-[2.5rem] border border-gray-100 shadow-xl">
           <div className="p-8 bg-orange-50 rounded-full mb-8 relative">
              <Package className="w-12 h-12 text-[#fd6410]" />
              <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                 <XCircle className="w-4 h-4 text-rose-400" />
              </div>
           </div>
           <h3 className="text-xl font-bold text-gray-900">No matching products</h3>
           <p className="text-gray-500 text-sm max-w-xs mt-3 italic leading-relaxed">No results found for your search or filters. Try adjusting your criteria or add a new product.</p>
           <button 
              onClick={() => {setSearchTerm(""); setActiveTab("All");}}
              className="mt-8 text-sm font-semibold text-[#fd6410] hover:opacity-70 transition-opacity flex items-center gap-2"
            >
              Clear all filters <ChevronRight className="w-3 h-3" />
            </button>
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
}
