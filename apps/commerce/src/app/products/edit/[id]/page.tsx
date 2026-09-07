"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, X, Plus, Tag, IndianRupee, Package, FileText, Save, Image as ImageIcon, Loader2, GripVertical
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { productService } from "@/services/product.service";
import { getErrorMessage } from "@repo/lib";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const queryClient = useQueryClient();
  
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isShippingChargeable, setIsShippingChargeable] = useState(false);
  const [shippingCharge, setShippingCharge] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setGalleryImages((items) => {
        const oldIndex = items.findIndex((_, i) => `img-${i}` === active.id);
        const newIndex = items.findIndex((_, i) => `img-${i}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Fetch product data
  const { data: product, isLoading: isFetching } = useQuery({
    queryKey: ['merchant-product', productId],
    queryFn: async () => {
      const [data, error] = await productService.getProduct(productId);
      if (error) throw new Error(getErrorMessage(error) || "Failed to fetch product");
      return data;
    },
    enabled: !!productId
  });

  // Sync state with fetched data
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "");
      setDescription(product.description || "");
      setPrice(String(product.price || ""));
      setStock(String(product.stock || ""));
      setIsShippingChargeable(Boolean(product.is_shipping_chargeable));
      setShippingCharge(product.shipping_charge ? String(product.shipping_charge) : "");
      
      const gallery = Array.isArray(product.gallery) ? product.gallery : [];
      const imgUrl = product.imageUrl || "";
      const allImages = [...new Set([imgUrl, ...gallery].filter(Boolean))];
      setGalleryImages(allImages);
    }
  }, [product]);

  // Mutation to update product
  const updateMutation = useMutation({
    mutationFn: async (status: 'active' | 'draft') => {
      const payload = {
        name,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl: galleryImages[0] || "",
        gallery: galleryImages,
        status,
        is_shipping_chargeable: isShippingChargeable,
        shipping_charge: Number(shippingCharge) || 0
      };

      const [data, error] = await productService.updateProduct(productId, payload);
      if (error) {
        throw new Error(getErrorMessage(error) || "Failed to update product");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-products'] });
      queryClient.invalidateQueries({ queryKey: ['merchant-product', productId] });
      toast.success("Product updated successfully!");
      router.push("/products");
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err));
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    if (!name || !price || !category) {
      toast.error("Please fill in the required fields: Title, Category, and Price.");
      return;
    }
    updateMutation.mutate("active");
  };

  const handleSaveDraft = () => {
    if (!name) {
      toast.error("Title is required even for drafts.");
      return;
    }
    updateMutation.mutate("draft");
  };

  if (isFetching) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex gap-3">
             <Skeleton className="h-12 w-32 rounded-2xl" />
             <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-96 rounded-[2.5rem]" />
            <Skeleton className="h-64 rounded-[2.5rem]" />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <Skeleton className="h-96 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 font-outfit">
      {/* Back & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <Link href="/products" className="flex items-center text-xs font-bold text-gray-400 hover:text-[#fd6410] transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Product</h1>
          <p className="text-gray-500 text-sm italic">Modifying <span className="text-[#fd6410] font-bold">"{product?.name}"</span></p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <button 
            onClick={handleSaveDraft}
            disabled={updateMutation.isPending}
            className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {updateMutation.isPending && updateMutation.variables === "draft" ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
            Save as Draft
          </button>
          <button 
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#fd6410] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending && updateMutation.variables === "active" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 group-hover:animate-pulse" />
            )}
            <span>Update Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Information Card */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl -mr-12 -mt-12 transition-opacity group-hover:opacity-100 opacity-0" />
            
            <h3 className="text-[10px] font-bold text-gray-900 px-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#fd6410]" />
              General Information
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 pl-1">Product Title <span className="text-red-500 ml-0.5">*</span></label>
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
                <label className="text-xs font-bold text-gray-400 pl-1">Category <span className="text-red-500 ml-0.5">*</span></label>
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
                <label className="text-xs font-bold text-gray-400 pl-1">Description</label>
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
            <h3 className="text-[10px] font-bold text-gray-900 px-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#fd6410]" />
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-bold text-gray-400 pl-1">Base Price <span className="text-red-500 ml-0.5">*</span></label>
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
                <label className="text-xs font-bold text-gray-400 pl-1">Current Stock <span className="text-red-500 ml-0.5">*</span></label>
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
                  <h3 className="text-sm font-bold text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-[#fd6410]" /> Shipping Settings
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure shipping options for this product.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShippingChargeable(!isShippingChargeable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ isShippingChargeable ? "bg-[#fd6410]" : "bg-gray-200" }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ isShippingChargeable ? "translate-x-6" : "translate-x-1" }`} />
                </button>
              </div>

              {isShippingChargeable && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1">
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
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-gray-900 px-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#fd6410]" />
                  Media Gallery
                </h3>
                {galleryImages.length > 0 && (
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <GripVertical className="w-3 h-3" /> Drag to reorder
                  </span>
                )}
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={galleryImages.map((_, i) => `img-${i}`)} strategy={rectSortingStrategy}>
                  <div className="space-y-4">
                    {/* Fixed 4 Slots Grid */}
                     <div className="grid grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((index) => {
                          const labels = ["Front", "Back", "Left Side", "Right Side"];
                          const label = labels[index];
                          const img = galleryImages[index];

                          if (img) {
                            return (
                              <SortableImageItem
                                key={`img-${index}-${img.slice(-10)}`}
                                id={`img-${index}`}
                                src={img}
                                label={label}
                                onRemove={() => removeImage(index)}
                              />
                            );
                          } else {
                            return (
                              <label key={`placeholder-${index}`} className="relative group h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-[#fd6410]/40 transition-all overflow-hidden">
                                <Plus className="w-6 h-6 text-gray-300 group-hover:text-[#fd6410] transition-colors" />
                                <span className="text-[9px] font-bold text-gray-400 mt-1 text-center leading-tight z-10 relative">{label}</span>
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" multiple />
                              </label>
                            );
                          }
                        })}
                     </div>
                     
                     {/* Additional Images */}
                     <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-[10px] font-bold text-gray-500 mb-3">Additional Images</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {galleryImages.slice(4).map((img, sliceIdx) => {
                            const index = sliceIdx + 4;
                            return (
                              <SortableImageItem
                                key={`img-${index}-${img.slice(-10)}`}
                                id={`img-${index}`}
                                src={img}
                                onRemove={() => removeImage(index)}
                              />
                            );
                          })}
                          <label className="h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-[#fd6410]/40 transition-all group overflow-hidden">
                             <Plus className="w-6 h-6 text-gray-300 group-hover:text-[#fd6410] transition-colors" />
                             <span className="text-[9px] font-bold text-gray-400 mt-1 relative z-10">Add More</span>
                             <input type="file" className="hidden" multiple onChange={handleImageUpload} accept="image/*" />
                          </label>
                        </div>
                     </div>
                  </div>
                </SortableContext>
              </DndContext>
           </div>

           {/* Tags & Visibility */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-[10px] font-bold text-gray-900 px-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#fd6410]" />
                Store Visibility
              </h3>
              <div className="flex items-center justify-between py-4 px-5 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                <span className="text-xs font-bold text-gray-600">Mark as Featured</span>
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

function SortableImageItem({ id, src, label, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group h-24 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm bg-white cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-xl ring-2 ring-[#fd6410] scale-105' : ''}`}
      {...attributes}
      {...listeners}
    >
      <img src={src} alt={label || "Image"} className="w-full h-full object-cover" />
      {label && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6 pointer-events-none">
          <p className="text-[9px] font-bold text-white text-center drop-shadow-md">{label}</p>
        </div>
      )}
      <button 
         onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
         onPointerDown={(e) => e.stopPropagation()}
         className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 z-10 cursor-pointer"
      >
         <X className="w-3 h-3" />
      </button>
    </div>
  );
}
