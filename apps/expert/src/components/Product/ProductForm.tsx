"use client";

import React, { FC, useState } from "react";
import { X, Upload, Link as LinkIcon, Image as ImageIcon, ToggleLeft, ToggleRight } from "lucide-react";
import { Product } from "@/types/product";
import { Loading } from "@repo/ui";
import { toast } from "react-toastify";

interface ProductFormProps {
    editingProduct: Product | null;
    isSubmitting: boolean;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
}

export const ProductForm: FC<ProductFormProps> = ({ 
    editingProduct, 
    isSubmitting, 
    onSubmit, 
    onCancel 
}) => {
    const [formData, setFormData] = useState<Product>(
        editingProduct || {
            name: "",
            shortDescription: "",
            description: "",
            price: 0,
            originalPrice: 0,
            stock: 0,
            imageUrl: "",
            isActive: true,
        }
    );

    const [imageMode, setImageMode] = useState<"file" | "url">(
        editingProduct?.imageUrl?.startsWith("http") ? "url" : "file"
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "originalPrice" || name === "stock" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.description) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("shortDescription", formData.shortDescription || "");
        fd.append("description", formData.description);
        fd.append("price", String(formData.price));
        fd.append("originalPrice", String(formData.originalPrice));
        fd.append("stock", String(formData.stock || 0));
        fd.append("isActive", String(formData.isActive));

        if (imageMode === "file" && selectedFile) {
            fd.append("file", selectedFile);
        } else if (imageMode === "url" && formData.imageUrl) {
            fd.append("imageUrl", formData.imageUrl);
        } else if (editingProduct && formData.imageUrl) {
            // Keep existing image if no new file is selected
            fd.append("imageUrl", formData.imageUrl);
        } else if (!editingProduct && !selectedFile && !formData.imageUrl) {
            toast.error("Please provide an image URL or upload a file.");
            return;
        }

        await onSubmit(fd);
    };

    const parsePrice = (val: any) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));
    
    const discount =
        parsePrice(formData.originalPrice) > parsePrice(formData.price)
            ? Math.round(
                ((parsePrice(formData.originalPrice) - parsePrice(formData.price)) /
                    parsePrice(formData.originalPrice)) *
                100
            )
            : 0;

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all"
                        placeholder="e.g. Rudraksha Mala"
                    />
                </div>

                {/* Image Mode Toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image <span className="text-red-500">*</span></label>
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-2 w-fit">
                        <button
                            type="button"
                            onClick={() => setImageMode("file")}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${imageMode === "file" ? "bg-[#F25E0A] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <Upload className="w-3.5 h-3.5" /> Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageMode("url")}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${imageMode === "url" ? "bg-[#F25E0A] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <LinkIcon className="w-3.5 h-3.5" /> Image URL
                        </button>
                    </div>

                    {imageMode === "file" ? (
                        <div className="relative border-2 border-dashed border-gray-200 rounded-lg h-[46px] flex items-center justify-center cursor-pointer hover:bg-orange-50/40 hover:border-[#F25E0A]/50 transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-2 text-gray-400 text-xs pointer-events-none px-4 overflow-hidden truncate">
                                {selectedFile ? (
                                    <><ImageIcon className="w-4 h-4 text-emerald-500" /> <span className="truncate">{selectedFile.name}</span></>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Choose File</>
                                )}
                            </div>
                        </div>
                    ) : (
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                    )}
                </div>

                {/* Short Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Short Description (Subtitle) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all"
                        placeholder="e.g. Natural crystal stones for energy balance"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all resize-none"
                        placeholder="Detailed product information..."
                    />
                </div>

                {/* Prices */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Market Price / MRP (₹)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <input
                            type="number"
                            name="originalPrice"
                            value={formData.originalPrice}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Stock & Discount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Initial Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#F25E0A]/30 focus:border-[#F25E0A] outline-none transition-all"
                        placeholder="10"
                    />
                </div>

                {discount > 0 && (
                    <div className="flex items-center p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 text-emerald-600 font-bold">
                            {discount}%
                        </div>
                        <p className="text-emerald-700 text-xs font-bold leading-tight">
                            Discount Label: Customers will see a {discount}% OFF badge!
                        </p>
                    </div>
                )}

                {/* Active Toggle */}
                <div className="md:col-span-2 py-2 border-t border-gray-100 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className="shrink-0 transition-transform group-hover:scale-105"
                        >
                            {formData.isActive
                                ? <ToggleRight className="w-9 h-9 text-[#F25E0A]" />
                                : <ToggleLeft className="w-9 h-9 text-gray-300" />
                            }
                        </button>
                        <div>
                            <span className="text-sm font-bold text-gray-800">Show in Shop</span>
                            <p className="text-[10px] text-gray-400 font-medium">Inactive products are hidden from the user storefront.</p>
                        </div>
                    </label>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 text-sm font-bold text-white bg-[#F25E0A] hover:bg-[#d94f00] rounded-xl shadow-lg shadow-orange/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : (editingProduct ? "Update Product" : "Publish Product")}
                    </button>
                </div>
            </form>
            {isSubmitting && <Loading fullScreen />}
        </div>
    );
};
