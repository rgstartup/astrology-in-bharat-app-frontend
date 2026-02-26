"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Link as LinkIcon, Image as ImageIcon, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@repo/ui";
import { SearchInput } from "@repo/ui";
import { Product, ProductService } from "../../../src/services/products.service";

// Cast icons to any to avoid React 19 type errors
const PlusIcon = Plus as any;
const XIcon = X as any;
const UploadIcon = Upload as any;
const LinkIconComponent = LinkIcon as any;
const ImageIconComponent = ImageIcon as any;
const PencilIcon = Pencil as any;
const Trash2Icon = Trash2 as any;

// Helper to safely parse numbers
const parsePrice = (value: any) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Form & Edit State
    const [formData, setFormData] = useState<Product>({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        imageUrl: "",
        isActive: true,
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const [imageMode, setImageMode] = useState<"url" | "file">("file");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await ProductService.getProducts();
            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.data && Array.isArray(data.data)) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtered Products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            originalPrice: 0,
            imageUrl: "",
            isActive: true,
        });
        setEditingId(null);
        setSelectedFile(null);
        setImageMode("file");
        setShowForm(false);
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            imageUrl: product.imageUrl,
            isActive: product.isActive !== undefined ? product.isActive : true,
        });
        setEditingId(product.id || product._id || null);

        // Auto-detect image mode
        if (product.imageUrl && product.imageUrl.startsWith("http") && !product.imageUrl.includes("localhost")) {
            setImageMode("url");
        } else {
            setImageMode("file"); // Assume local or uploaded file relative path
        }

        setShowForm(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await ProductService.deleteProduct(id);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            // Construct FormData for multipart/form-data request
            const submissionData = new FormData();
            submissionData.append("name", formData.name);
            submissionData.append("description", formData.description);
            submissionData.append("price", String(formData.price));
            submissionData.append("originalPrice", String(formData.originalPrice));

            // Only append active status if explicitly set (backend might default)
            if (formData.isActive !== undefined) {
                submissionData.append("isActive", String(formData.isActive));
            }

            // Handle Image
            if (imageMode === "file" && selectedFile) {
                // Backend requires the file key to be 'file'
                submissionData.append("file", selectedFile);
            } else if (imageMode === "url" && formData.imageUrl) {
                submissionData.append("imageUrl", formData.imageUrl);
            } else if (editingId && formData.imageUrl) {
                // Retain existing image if editing and no new file
                submissionData.append("imageUrl", formData.imageUrl);
            } else if (!editingId && !selectedFile && !formData.imageUrl) {
                toast.error("Please provide an image URL or upload a file.");
                setSubmitting(false);
                return;
            }

            if (editingId) {
                await ProductService.updateProduct(editingId, submissionData);
                toast.success("Product updated successfully");
            } else {
                // Create Product using FormData
                await ProductService.createProduct(submissionData);
                toast.success("Product added successfully");
            }

            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error(error.message || "Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "originalPrice" ? Number(value) : value
        }));
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-full md:w-64">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search products..."
                        />
                    </div>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        variant={showForm ? "outline" : "primary"}
                        icon={showForm ? XIcon : PlusIcon}
                    >
                        {showForm ? "Cancel" : "Add Product"}
                    </Button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {editingId ? "Edit Product" : "Add New Product"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                placeholder="e.g. Rudraksha Mala"
                            />
                        </div>

                        {/* Image Input Section */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>

                            {/* Toggles */}
                            <div className="flex space-x-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setImageMode("file")}
                                    className={`text-xs px-2 py-1 rounded border transition-colors ${imageMode === "file" ? "bg-yellow-50 border-yellow-500 text-yellow-700" : "bg-white border-gray-200 text-gray-600"}`}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode("url")}
                                    className={`text-xs px-2 py-1 rounded border transition-colors ${imageMode === "url" ? "bg-yellow-50 border-yellow-500 text-yellow-700" : "bg-white border-gray-200 text-gray-600"}`}
                                >
                                    Image URL
                                </button>
                            </div>

                            {/* Discount Preview */}
                            {parsePrice(formData.originalPrice) > parsePrice(formData.price) && parsePrice(formData.originalPrice) > 0 && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                                        <span>🎉</span>
                                        {Math.round(((parsePrice(formData.originalPrice) - parsePrice(formData.price)) / parsePrice(formData.originalPrice)) * 100)}% OFF will be shown to users
                                    </p>
                                </div>
                            )}

                            {imageMode === "file" ? (
                                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 relative h-[42px] flex items-center justify-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        {selectedFile ? (
                                            <><ImageIconComponent size={16} /> {selectedFile.name}</>
                                        ) : (
                                            <><UploadIcon size={16} /> Choose File</>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    required={imageMode === "url"}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            )}
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                placeholder="Product description..."
                            />
                        </div>

                        {/* Prices */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price / MRP (₹)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            />
                        </div>

                        {/* Active Status */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive !== false}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active Status</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-7">Inactive products will be hidden from the public shop.</p>
                        </div>

                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                disabled={uploading || submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={uploading || submitting}
                            >
                                {editingId ? "Update Product" : "Save Product"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-full text-center py-8">Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-8">No products found.</p>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id || product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                            <div className="h-48 overflow-hidden bg-gray-100 relative">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image')}
                                />
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        icon={PencilIcon}
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        icon={Trash2Icon}
                                        onClick={() => handleDelete(product.id || product._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-bold text-yellow-600">₹{product.price}</span>
                                        {product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}




