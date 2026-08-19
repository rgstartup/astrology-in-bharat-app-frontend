"use client";

import React, { useState } from "react";
import { Plus, Package, Search, X } from "lucide-react";
import { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { ProductForm } from "./ProductForm";
import { ProductCard } from "./ProductCard";
import { Loading } from "@repo/ui";

export default function ProductManager() {
    const { 
        products, 
        isLoading, 
        createProduct, 
        updateProduct, 
        deleteProduct, 
        isSubmitting 
    } = useProducts();

    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await deleteProduct(id);
    };

    const onFormSubmit = async (formData: FormData) => {
        if (editingProduct) {
            const id = (editingProduct.id || editingProduct._id) as string;
            await updateProduct({ id, formData });
        } else {
            await createProduct(formData);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage and sell your astrology products.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            setEditingProduct(null);
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${showForm
                        ? "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-[#F25E0A] hover:bg-[#d94f00] text-white"
                        }`}
                >
                    {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
                </button>
            </header>

            {showForm && (
                <ProductForm
                    editingProduct={editingProduct}
                    isSubmitting={isSubmitting}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                    }}
                    onSubmit={onFormSubmit}
                />
            )}

            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 mb-6 flex items-center gap-2 shadow-sm">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products by name..."
                        className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
                    />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loading size="lg" text="Loading Repository..." />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center flex flex-col items-center shadow-sm">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-10 h-10 text-[#F25E0A]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                        <p className="text-gray-400 max-w-sm mb-6 text-sm">
                            {searchQuery ? `No products match "${searchQuery}".` : "You haven't added any products yet."}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="border-2 border-[#F25E0A] text-[#F25E0A] hover:bg-orange-50 px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm"
                            >
                                Add Your First Product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id || product._id}
                                product={product}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
