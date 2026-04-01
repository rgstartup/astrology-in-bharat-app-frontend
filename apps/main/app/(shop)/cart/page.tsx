"use client";
import React from "react";
import Image from "next/image";
import { getProductImageUrl } from "@/utils/image-utils";
import ProductCarousel from "@/components/features/shop/ProductCarousel";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";

const CartPage: React.FC = () => {
  const router = useRouter();
  const { isClientAuthenticated, clientLoading } = useAuthStore();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isLoading: cartLoading
  } = useCartStore();

  const [suggestedProducts, setSuggestedProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Only redirect if we ARE NOT loading anymore and we ARE NOT authenticated
    if (!clientLoading && !isClientAuthenticated) {
      router.push("/sign-in");
    }

    const fetchProducts = async () => {
        const [data, fetchError] = await api.get<any>(`/products`);
        
        if (!fetchError && data) {
          const products = Array.isArray(data) ? data : data.data || [];
          setSuggestedProducts(products);
        }
      };
  
      fetchProducts();
  }, [isClientAuthenticated, clientLoading, router]);

  if (clientLoading || (!isClientAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange/20 border-t-orange rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // Combined Loading state
  const isDataLoading = cartLoading && cartItems.length === 0;

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange/20 border-t-orange rounded-full animate-spin"></div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (id: number, delta: number) => {
    const item = cartItems.find((i: any) => i.productId === id);
    if (item) {
      await updateQuantity(id, item.quantity + delta);
    }
  };

  const handleRemoveItem = async (id: number) => {
    await removeFromCart(id);
  };

  const subtotal = cartTotal;
  const shipping = 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 text-orange rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <i className="fa-solid fa-shopping-bag text-[10px]"></i>
              Checkout Securely
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-none">
              Your Shopping Bag
            </h1>
          </div>
          <div className="text-gray-400 font-bold text-sm tracking-wide bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            {cartItems.length} Items in Cart
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-premium border border-gray-100">
            <div className="w-24 h-24 bg-orange/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-orange">
              <i className="fa-solid fa-cart-shopping-slash text-4xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Your bag is empty</h2>
            <p className="text-gray-500 font-bold mb-10 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
            <button 
              onClick={() => router.push("/product")}
              className="px-10 py-4 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium hover:shadow-2xl hover:bg-orange/90 transition-all font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-8 md:p-10 divide-y divide-gray-100">
                {cartItems.map((item: any) => {
                  const imageUrl = getProductImageUrl(item.product);

                  return (
                    <div
                      key={item.productId || item.product?.id}
                      className="flex flex-col md:flex-row items-center gap-8 py-8 first:pt-0 last:pb-0 group"
                    >
                      {/* Image & Title */}
                      <div className="flex flex-col md:flex-row items-center gap-8 flex-grow w-full">
                        <div className="relative w-32 h-32 shrink-0 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 p-4 transition-transform group-hover:scale-105 duration-500">
                          <Image
                            src={imageUrl}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                          <h3 className="text-xl font-black text-gray-900 leading-tight">
                            {item.product?.name || "Product Name"}
                          </h3>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            ₹{item.product?.sale_price || item.product?.price} per unit
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto gap-8">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-orange transition-all active:scale-90 shadow-sm disabled:opacity-50"
                            onClick={() => handleQuantityChange(item.productId || item.product?.id || 0, -1)}
                            disabled={cartLoading || item.quantity <= 1}
                          >
                            <i className="fa-solid fa-minus text-xs" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center font-black text-gray-900 bg-transparent border-0 outline-none"
                          />
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-orange transition-all active:scale-90 shadow-sm disabled:opacity-50"
                            onClick={() => handleQuantityChange(item.productId || item.product?.id || 0, 1)}
                            disabled={cartLoading}
                          >
                            <i className="fa-solid fa-plus text-xs" />
                          </button>
                        </div>
 
                        {/* Price */}
                        <div className="text-xl font-black text-gray-900 italic w-24 text-right">
                          ₹{(item.product?.sale_price || item.product?.price || 0) * item.quantity}
                        </div>
 
                        {/* Remove */}
                        <button
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50"
                          onClick={() => handleRemoveItem(item.productId || item.product?.id || 0)}
                          disabled={cartLoading}
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 p-10 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 z-10 relative">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8 z-10 relative">
                    <div className="flex justify-between items-center text-gray-500 font-bold">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-gray-900">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-bold">
                      <span className="text-sm">Shipping</span>
                      <span className="text-emerald-500 uppercase text-xs font-black tracking-widest">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-bold">
                      <span className="text-sm">Estimated Tax (10%)</span>
                      <span className="text-gray-900">₹{tax.toFixed(0)}</span>
                    </div>
                    <div className="h-px w-full bg-gray-100 my-4"></div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-gray-900">Total</span>
                      <span className="text-3xl font-black text-orange italic">₹{grandTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <button
                    className="w-full py-5 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-premium hover:shadow-2xl hover:bg-orange/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    onClick={() => router.push("/checkout?type=order")}
                  >
                    Checkout Now
                    <i className="fa-solid fa-arrow-right-long animate-bounce-x" />
                  </button>
                </div>

                {/* Info Badges */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1">
                    <i className="fa-solid fa-shield-check text-emerald-500 text-lg"></i>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Payments</p>
                  </div>
                   <div className="p-4 bg-white rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1">
                    <i className="fa-solid fa-rotate-left text-blue-500 text-lg"></i>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Products */}
        <div className="mt-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              Complete Your Journey
            </h2>
            <div className="h-1.5 flex-grow bg-gray-100 rounded-full"></div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest shrink-0">Personalized Recommendations</p>
          </div>
          <ProductCarousel products={suggestedProducts} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
