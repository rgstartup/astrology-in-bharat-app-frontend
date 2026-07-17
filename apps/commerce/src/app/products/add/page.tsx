"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Upload, X, Plus, Tag, IndianRupee, Package, FileText, Save, Image as ImageIcon, Loader2
} from "lucide-react";
import { productService } from "@/services/product.service";
import { getErrorMessage } from "@repo/lib";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");
  const [leftImage, setLeftImage] = useState<string>("");
  const [rightImage, setRightImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isShippingChargeable, setIsShippingChargeable] = useState(false);
  const [shippingCharge, setShippingCharge] = useState("");

  // Mutation to create product
  const createMutation = useMutation({
    mutationFn: async (status: 'active' | 'draft') => {
      const payload = {
        name,
        category,

        description,
        price: Number(price),
        stock: Number(stock),
        // Combine images
        gallery: [frontImage, backImage, leftImage, rightImage, ...additionalImages].filter(Boolean),
        imageUrl: frontImage || backImage || leftImage || rightImage || additionalImages[0] || "",
        status,
        is_shipping_chargeable: isShippingChargeable,
        shipping_charge: Number(shippingCharge) || 0
      };

      const [data, error] = await productService.createProduct(payload);

      if (error) {
        throw new Error(getErrorMessage(error) || "Failed to create product");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-products'] });
      router.push("/products");
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err));
    }
  });

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setAdditionalImages(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderImageBox = (label: string, image: string, setter: (val: string) => void) => (
    <div className="relative group h-24 rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 bg-gray-50/50 hover:border-[#fd6410]/30 transition-all flex flex-col items-center justify-center">
      {image ? (
        <>
          <img src={image} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <button 
             onClick={(e) => { e.preventDefault(); setter(""); }}
             className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 z-10"
          >
             <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
           <Plus className="w-6 h-6 text-gray-300 group-hover:text-[#fd6410] transition-colors" />
           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 text-center leading-tight">{label}</span>
           <input type="file" className="hidden" onChange={(e) => handleSingleImageUpload(e, setter)} accept="image/*" />
        </label>
      )}
    </div>
  );

  const handlePublish = () => {
    if (!name || !price || !category) {
      alert("Please fill in the required fields: Title, Category, and Price.");
      return;
    }
    createMutation.mutate("active");
  };

  const handleSaveDraft = () => {
    if (!name) {
      alert("Title is required even for drafts.");
      return;
    }
    createMutation.mutate("draft");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Back & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <Link href="/products" className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#fd6410] transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Product</h1>
          <p className="text-gray-500 text-sm italic">Add details about your divine product to attract more customers.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <button 
            onClick={handleSaveDraft}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {createMutation.isPending && createMutation.variables === "draft" ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
            Save as Draft
          </button>
          <button 
            onClick={handlePublish}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#fd6410] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {createMutation.isPending && createMutation.variables === "active" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 group-hover:animate-pulse" />
            )}
            <span>Publish Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Information Card */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl -mr-12 -mt-12 transition-opacity group-hover:opacity-100 opacity-0" />
            
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#fd6410]" />
              General Information
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Product Title *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Rudraksha Mala" 
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#fd6410]/20 focus:border-[#fd6410] transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Category *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#fd6410]/20 focus:border-[#fd6410] appearance-none transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Spiritual Items">Spiritual Items</option>
                  <option value="Puja Samagri">Puja Samagri</option>
                  <option value="Vedic Clothing">Vedic Clothing</option>
                  <option value="Books">Books & Literature</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Description</label>
                <textarea 
                  rows={5} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product's spiritual significance, materials, and benefits..." 
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-[2rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#fd6410]/20 focus:border-[#fd6410] transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Stock Information */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#fd6410]" />
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Base Price *</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold">₹</div>
                   <input 
                     type="number" 
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     placeholder="2500" 
                     className="w-full pl-10 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#fd6410]/20 focus:border-[#fd6410] transition-all" 
                   />
                </div>
              </div>
              
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Current Stock *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-4 w-4 text-gray-400 group-focus-within:text-[#fd6410] transition-colors" />
                  </div>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:border-[#fd6410] focus:ring-0 transition-all font-medium"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center">
                    <Package className="w-4 h-4 mr-2 text-[#fd6410]" /> Shipping Settings
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure shipping options for this product.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShippingChargeable(!isShippingChargeable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isShippingChargeable ? "bg-[#fd6410]" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isShippingChargeable ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>

              {isShippingChargeable && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Shipping Charge (₹)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-gray-400 group-focus-within:text-[#fd6410] transition-colors" />
                    </div>
                    <input
                      type="number"
                      value={shippingCharge}
                      onChange={(e) => setShippingCharge(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:border-[#fd6410] focus:ring-0 transition-all font-medium"
                      placeholder="e.g. 50"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Media Upload (4/12) */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#fd6410]" />
                Media Gallery
              </h3>

              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    {renderImageBox("Front", frontImage, setFrontImage)}
                    {renderImageBox("Back", backImage, setBackImage)}
                    {renderImageBox("Left Side", leftImage, setLeftImage)}
                    {renderImageBox("Right Side", rightImage, setRightImage)}
                 </div>
                 
                 <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Additional Images</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {additionalImages.map((img, idx) => (
                        <div key={idx} className="relative group h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-in zoom-in-50 duration-300">
                           <img src={img} alt="Additional" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           <button 
                              onClick={() => removeAdditionalImage(idx)}
                              className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500"
                           >
                              <X className="w-3 h-3" />
                           </button>
                        </div>
                      ))}
                      <label className="h-24 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-[#fd6410]/30 transition-all group">
                         <Plus className="w-6 h-6 text-gray-300 group-hover:text-[#fd6410] transition-colors" />
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Add More</span>
                         <input type="file" className="hidden" multiple onChange={handleAdditionalImageUpload} accept="image/*" />
                      </label>
                    </div>
                 </div>
              </div>
           </div>

           {/* Tags & Visibility */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#fd6410]" />
                Store Visibility
              </h3>
              <div className="flex items-center justify-between py-4 px-5 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Mark as Featured</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#fd6410]"></div>
                </label>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
