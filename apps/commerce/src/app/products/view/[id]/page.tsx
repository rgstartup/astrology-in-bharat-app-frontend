"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Edit2, 
  Package, 
  Tag, 
  Layers, 
  IndianRupee, 
  Calendar,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";
import { productService } from "@/services/product.service";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  imageUrl: string;
  sku?: string;
  description: string;
  created_at: string;
}

export default function ProductViewPage() {
  const params = useParams();
  const id = params.id;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['merchant-product', id],
    queryFn: async () => {
      const [data, err] = await productService.getProduct(String(id));
      if (err) throw err;
      return data;
    }
  });

  // Effect to set the initial selected image when product loads
  React.useEffect(() => {
    if (product && product.imageUrl && !selectedImage) {
      setSelectedImage(product.imageUrl);
    }
  }, [product, selectedImage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-700 border-green-100 ring-green-500/10";
      case "out_of_stock": return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10";
      case "draft": return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <div className="flex gap-3">
             <Skeleton className="h-12 w-32 rounded-2xl" />
             <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <Skeleton className="aspect-square rounded-[3rem]" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-16 w-3/4 rounded-2xl" />
              </div>
              <Skeleton className="h-12 w-48 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500">
           <AlertCircle className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <p className="text-gray-500 mt-2">The product you are looking for might have been deleted or moved.</p>
        </div>
        <Link href="/products" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const displayImage = selectedImage || product.imageUrl;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/products" 
          className="flex items-center space-x-2 text-gray-500 hover:text-[#fd6410] transition-colors group px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-[10px]">Back to Catalog</span>
        </Link>

        <div className="flex items-center gap-3">
           <Link href={`/products/edit/${product.id}`}>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
                <Edit2 className="w-4 h-4" />
                <span>Edit Details</span>
              </button>
           </Link>
           <button className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg">
             <ExternalLink className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image & Quick Stats */}
        <div className="lg:col-span-5 space-y-8">
           <div className="aspect-square bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden group relative">
             {displayImage ? (
               <img 
                 src={displayImage} 
                 alt={product.name} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-gray-50 to-orange-50/50 flex flex-col items-center justify-center text-gray-200">
                  <Package className="w-20 h-20" />
                  <span className="text-xs font-bold mt-4">No Image Available</span>
               </div>
             )}
             
             <div className="absolute top-6 right-6">
                <span className={cn(
                  "px-5 py-2 rounded-2xl text-[10px] font-bold  border shadow-lg backdrop-blur-md",
                  getStatusBadge(product.status)
                )}>
                  {product.status?.replace('_', ' ') || 'N/A'}
                </span>
             </div>
           </div>
           
           {(product as any).gallery && (product as any).gallery.length > 1 && (
             <div className="grid grid-cols-4 gap-3">
               {(product as any).gallery.map((img: string, idx: number) => (
                 <div 
                   key={idx} 
                   onClick={() => setSelectedImage(img)}
                   className={cn(
                     "aspect-square bg-white rounded-2xl border-2 shadow-sm overflow-hidden group cursor-pointer transition-all duration-300",
                     displayImage === img ? "border-[#fd6410] opacity-100" : "border-transparent hover:border-orange-200 opacity-70 hover:opacity-100"
                   )}
                 >
                   <img src={img} alt="Gallery image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
               ))}
             </div>
           )}

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
                 <p className="text-[10px] font-bold text-gray-400">Inventory Status</p>
                 <div className="flex items-center gap-2 mt-1">
                    {product.stock > 0 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-gray-900">{product.stock} In Stock</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span className="font-bold text-gray-900">Out of Stock</span>
                      </>
                    )}
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
                 <p className="text-[10px] font-bold text-gray-400">Pricing Model</p>
                 <div className="flex items-center gap-2 mt-1">
                    <IndianRupee className="w-4 h-4 text-[#fd6410]" />
                    <span className="font-bold text-gray-900">Standard Rate</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Details & Description */}
        <div className="lg:col-span-7 space-y-10">
           <div className="space-y-6">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-orange-50 text-[#fd6410] rounded-full text-[10px] font-bold border border-orange-100">
                   {product.category}
                 </span>
                 <h1 className="text-5xl font-bold text-gray-900 tracking-tighter leading-tight italic decoration-[#fd6410] underline decoration-8 underline-offset-8">
                    {product.name}
                 </h1>
              </div>

              <div className="flex items-baseline gap-4">
                 <span className="text-5xl font-bold text-[#fd6410] tracking-tighter">
                    {formatPrice(product.price)}
                 </span>
                 {product.original_price && product.original_price > product.price && (
                   <span className="text-2xl font-bold text-gray-300 line-through">
                      {formatPrice(product.original_price)}
                   </span>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-y border-gray-100 py-10">

              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <Calendar className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400">Added Date</p>
                    <p className="font-bold text-gray-900 mt-1 italic">
                       {new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-50 rounded-xl">
                    <Layers className="w-5 h-5 text-purple-600" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 tracking-tight italic">Product Intelligence</h3>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Package className="w-32 h-32" />
                 </div>
                 <div className="relative">
                    <p className="text-[10px] font-bold text-gray-400 mb-4">Description</p>
                    <p className="text-gray-600 leading-relaxed font-medium italic">
                       {product.description || "No detailed description provided for this product. Add one to help customers understand the spiritual and physical benefits better."}
                    </p>
                 </div>
                 
                 <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
                       <Clock className="w-3.5 h-3.5" /> Fast Processing
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
                       <CheckCircle2 className="w-3.5 h-3.5" /> Quality Checked
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
