"use client";
import React from "react";
import Image from "next/image";
import { getProductImageUrl } from "@/utils/image-utils";
import ProductCarousel from "@/components/features/shop/ProductCarousel";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/__useAuthStore";
import { api } from "@/actions";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";
import { Loading } from "@repo/ui";

const CartPage: React.FC = () => {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const t =
    homeTranslations[lang as keyof typeof homeTranslations] ||
    homeTranslations.en;
  const { isAuthenticated, loading } = useAuthStore();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isLoading: cartLoading,
  } = useCartStore();

  const [suggestedProducts, setSuggestedProducts] = React.useState<any[]>([]);
  const [platformFee, setPlatformFee] = React.useState(0);

  React.useEffect(() => {
    // Clear any stale single-purchase data when moving to the cart
    sessionStorage.removeItem("buyNowItem");

    // Only redirect if we ARE NOT loading anymore and we ARE NOT authenticated
    if (!loading && !isAuthenticated) {
      router.push("/sign-in");
    }

    const fetchProducts = async () => {
      const [data, fetchError] = await api.get<any>(`/products`);

      if (!fetchError && data) {
        const products = Array.isArray(data) ? data : data.data || [];
        setSuggestedProducts(products);
      }
    };

    const fetchPlatformFee = async () => {
      const [res, err] = await api.get<any>("/settings/platform-fee");
      if (!err && res) {
        setPlatformFee(Number(res.platform_fee) || 0);
      }
    };

    fetchProducts();
    fetchPlatformFee();
  }, [isAuthenticated, loading, router]);

  if (loading || (!isAuthenticated && typeof window !== "undefined")) {
    return <Loading fullScreen />;
  }

  // Combined Loading state
  const isDataLoading = cartLoading && cartItems.length === 0;

  if (isDataLoading) {
    return <Loading fullScreen />;
  }

  const handleQuantityChange = async (id: string, delta: number) => {
    const item = cartItems.find((i: any) => i.productId === id);
    if (item) {
      await updateQuantity(id, item.quantity + delta);
    }
  };

  const handleRemoveItem = async (id: string) => {
    await removeFromCart(id);
  };

  const subtotal = cartTotal;
  let shipping = 0;

  // Calculate shipping per merchant
  const merchantShippingMap = new Map<string, number>();
  cartItems.forEach((item: any) => {
    if (item.product?.is_shipping_chargeable) {
      const merchantId = item.product?.merchant_id || "platform";
      const currentMax = merchantShippingMap.get(merchantId) || 0;
      const charge = Number(item.product?.shipping_charge) || 0;
      if (charge > currentMax) {
        merchantShippingMap.set(merchantId, charge);
      }
    }
  });

  merchantShippingMap.forEach((charge) => {
    shipping += charge;
  });

  const grandTotal = subtotal + shipping + platformFee;

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 md:py-10 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-2 sm:px-4 md:px-8 lg:px-16">
        {/* Title */}
        <div className="flex flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-xl md:text-4xl font-extrabold text-gray-900 leading-none">
              {t.cart.shoppingBagTitle}
            </h1>
          </div>
          <div className="text-white font-bold text-xs md:text-sm tracking-wide bg-orange px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-premium border border-orange/20 whitespace-nowrap">
            {cartItems.length} {t.cart.itemsInCart}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-premium border border-gray-100">
            <div className="w-24 h-24 bg-orange/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-orange">
              <i className="fa-solid fa-cart-shopping-slash text-4xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              {t.cart.emptyBagTitle}
            </h2>
            <p className="text-gray-500 font-bold mb-10 max-w-xs mx-auto">
              {t.cart.emptyBagDesc}
            </p>
            <button
              onClick={() => router.push("/product")}
              className="px-10 py-4 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium hover:shadow-2xl hover:bg-orange/90 transition-all font-bold"
            >
              {t.cart.startShopping}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-premium border-[3px] border-orange p-4 sm:p-6 md:p-10 divide-y divide-gray-100">
                {cartItems.map((item: any) => {
                  const imageUrl = getProductImageUrl(item.product);

                  return (
                    <div
                      key={item.productId || item.product?.id}
                      className="flex flex-row items-center gap-4 py-5 first:pt-0 last:pb-0 group"
                    >
                      <div className="flex flex-row items-center gap-4 md:gap-8 flex-grow w-full">
                        <div className="relative w-11 h-11 md:w-16 md:h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50 border-[3px] border-orange p-1 transition-transform group-hover:scale-105 duration-500">
                          <Image
                            src={imageUrl}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="text-left space-y-1 md:space-y-2">
                          <h3 className="text-sm md:text-xl font-black text-gray-900 leading-tight">
                            {item.product?.name || "Product Name"}
                          </h3>
                          <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-gray-50 text-gray-400 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                            ₹{item.product?.sale_price || item.product?.price}{" "}
                            {t.cart.perUnit}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 md:gap-8 shrink-0">
                        {/* Quantity Controls */}
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 bg-gray-50 p-1 md:p-1.5 rounded-xl md:rounded-2xl border-2 border-orange/60 shrink-0">
                          <button
                            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl bg-white text-gray-800 hover:text-orange transition-all active:scale-90 shadow-sm disabled:opacity-50"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId || item.product?.id || 0,
                                -1,
                              )
                            }
                            disabled={cartLoading || item.quantity <= 1}
                          >
                            <i className="fa-solid fa-minus text-[10px] md:text-xs" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-7 h-7 md:w-12 text-center font-black text-gray-900 bg-transparent border-0 outline-none text-xs md:text-base"
                          />
                          <button
                            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl bg-white text-gray-800 hover:text-orange transition-all active:scale-90 shadow-sm disabled:opacity-50"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId || item.product?.id || 0,
                                1,
                              )
                            }
                            disabled={cartLoading}
                          >
                            <i className="fa-solid fa-plus text-[10px] md:text-xs" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-sm md:text-xl font-black text-gray-900 italic min-w-[50px] md:w-24 text-right shrink-0">
                          ₹
                          {(item.product?.sale_price ||
                            item.product?.price ||
                            0) * item.quantity}
                        </div>

                        {/* Remove */}
                        <button
                          className="w-8 h-8 md:w-12 md:h-12 flex shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50"
                          onClick={() =>
                            handleRemoveItem(
                              item.productId || item.product?.id || 0,
                            )
                          }
                          disabled={cartLoading}
                        >
                          <i className="fa-solid fa-trash-can text-xs md:text-base" />
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
                <div className="bg-white rounded-[3rem] shadow-premium border-[3px] border-orange p-10 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 z-10 relative">
                    {t.cart.orderSummary}
                  </h2>

                  <div className="space-y-4 mb-8 z-10 relative">
                    <div className="flex justify-between items-center text-gray-500 font-bold">
                      <span className="text-sm">{t.cart.subtotal}</span>
                      <span className="text-gray-900">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-bold">
                      <span className="text-sm">{t.cart.shipping}</span>
                      <span className="text-emerald-500 uppercase text-xs font-black tracking-widest">
                        {shipping === 0 ? t.cart.shippingFree : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-bold">
                      <span className="text-sm">Platform Charges</span>
                      <span className="text-gray-900">₹{platformFee}</span>
                    </div>
                    <div className="h-px w-full bg-gray-100 my-4"></div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-gray-900">
                        {t.cart.total}
                      </span>
                      <span className="text-3xl font-black text-orange italic">
                        ₹{grandTotal.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full py-5 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-premium hover:shadow-2xl hover:bg-orange/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    onClick={() => router.push("/client/checkout?type=order")}
                  >
                    {t.cart.checkoutNow}
                    <i className="fa-solid fa-arrow-right-long animate-bounce-x" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Products */}
        <div className="mt-24 md:mt-40">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              {t.cart.completeJourney}
            </h2>
            <div className="hidden md:block h-1.5 flex-grow bg-gray-100 rounded-full"></div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">
              {t.cart.personalizedRecs}
            </p>
          </div>
          <ProductCarousel products={suggestedProducts} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
