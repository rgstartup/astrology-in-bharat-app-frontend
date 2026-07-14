import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PATHS } from "@repo/routes";
import { getProductImageUrl } from "@/utils/image-utils";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import ReviewModal from "../../ui/modals/ReviewModal";
import Skeleton from "@/components/ui/Skeleton";

const NextLink = Link as any;

const FALLBACK_IMG = "/images/image-not-found.png";

interface OrdersTabProps {
    orders: any[];
    loadingOrders: boolean;
    expandedOrders: Record<number, boolean>;
    toggleOrder: (id: string) => void;
    orderDisputes: Record<number, any>;
    onViewChat: (dispute: any) => void;
    onReportIssue: (order: any) => void;
    userPhone?: string;
    userName?: string;
    reviewModalOpen: boolean;
    onCloseReviewModal: () => void;
    onOpenReviewModal: (merchantId: any, orderId: any) => void;
    onReviewSubmit: (data: any) => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({
    orders,
    loadingOrders,
    expandedOrders,
    toggleOrder,
    orderDisputes,
    onViewChat,
    onReportIssue,
    userPhone,
    userName,
    reviewModalOpen,
    onCloseReviewModal,
    onOpenReviewModal,
    onReviewSubmit,
    hasMore,
    loadingMore,
    onLoadMore
}) => {
    const { lang } = useLanguageStore();
    const t = (profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en).orders;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden">
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h5
          className="text-lg font-bold text-gray-900 mb-0 flex items-center"
          style={fontStyle}
        >
          <span className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-3 shrink-0">
            <i className="fa-solid fa-bag-shopping"></i>
          </span>
          {t.title}
        </h5>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        {loadingOrders ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-8">
                    <div className="space-y-2">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={120} height={20} />
                    </div>
                    <div className="space-y-2">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={80} height={20} />
                    </div>
                    <div className="space-y-2">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={70} height={20} />
                    </div>
                  </div>
                  <Skeleton width={100} height={32} className="rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
              <i className="fa-solid fa-box-open text-3xl text-gray-300"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.noOrders}
            </h6>
            <p className="text-gray-500 text-sm mb-8 max-w-xs" style={fontStyle}>
              {t.noOrdersHint}
            </p>
            <NextLink
              href={PATHS.BUY_PRODUCTS}
              className="px-8 py-3 bg-orange text-white font-bold rounded-2xl shadow-lg shadow-orange/20 hover:bg-orange/90 transition-all no-underline"
              style={fontStyle}
            >
              {t.shopNow}
            </NextLink>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {(() => {
                console.log("DEBUG: Total Orders found:", orders.length);
                console.table(orders.map(o => ({ 
                    id: o.trackingId || o.id, 
                    status: o.status, 
                    hasOTP: !!(o.deliveryOtp || o.delivery_otp || o.deliveryOTP || o.otp) 
                })));
                return null;
            })()}
            {orders.filter(Boolean).map((order: any, idx: number) => {
              console.log(`DEBUG: Order #${order.id || idx} full data:`, order);
              return (
              <div
                key={order.tracking_id || order.trackingId || order.id || idx}
                className="group border-y sm:border border-gray-100 sm:rounded-3xl overflow-hidden sm:shadow-sm hover:shadow-md transition-all duration-300 bg-white -mx-4 sm:mx-0"
              >
                {/* Order Summary Header */}
                <div
                  className="bg-gray-50/50 p-4 sm:p-6 flex flex-wrap gap-6 items-center justify-between border-b border-gray-100 cursor-pointer hover:bg-gray-100/30 transition-colors"
                  onClick={() => toggleOrder(order.tracking_id || order.trackingId || order.id)}
                >
                  <div className="flex flex-wrap gap-8 items-center">
                    <div>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1"
                        style={fontStyle}
                      >
                        {t.orderId}
                      </span>
                      <span className="font-bold text-gray-900" style={fontStyle}>
                        {order.tracking_id || order.trackingId || order.orderId || order.id}
                      </span>
                    </div>
                    <div>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1"
                        style={fontStyle}
                      >
                        {t.date}
                      </span>
                      <span className="font-bold text-gray-900" style={fontStyle}>
                        {(() => {
                          const dateVal = order.date || order.createdAt || order.created_at;
                          if (!dateVal) return t.na;
                          const d = new Date(dateVal);
                          return isNaN(d.getTime())
                            ? t.na
                            : d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                        })()}
                      </span>
                    </div>
                    <div>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1"
                        style={fontStyle}
                      >
                        {t.totalAmount}
                      </span>
                      <span className="font-bold text-orange text-lg">
                        ₹{order.amount || order.totalAmount || order.total_amount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 ml-auto">
                    {(() => {
                        const otp = order.deliveryOtp || order.delivery_otp || order.deliveryOTP || order.otp;
                        if (otp && order.status?.toLowerCase() !== 'delivered' && order.status?.toLowerCase() !== 'cancelled') {
                            return (
                                <div className="flex items-center gap-2 px-3 py-1 bg-orange/10 border border-orange/20 rounded-lg">
                                  <i className="fa-solid fa-shield-halved text-orange text-[10px]"></i>
                                  <span className="text-[10px] font-black text-orange tracking-widest leading-none">
                                     OTP: {otp}
                                  </span>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        order.status?.toLowerCase() === "delivered" ||
                        order.status?.toLowerCase() === "paid" ||
                        order.status?.toLowerCase() === "success"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : order.status?.toLowerCase() === "cancelled" ||
                              order.status?.toLowerCase() === "failed"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}
                      style={fontStyle}
                    >
                      {t.statusMap?.[order.status?.toLowerCase() as keyof typeof t.statusMap] || order.status || t.pending}
                    </span>
                    <button
                      className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm transition-transform duration-300 ${
                        expandedOrders[order.tracking_id || order.trackingId || order.id] ? "rotate-180" : ""
                      }`}
                    >
                      <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrders[order.tracking_id || order.trackingId || order.id] && (
                  <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Specialized View for Puja/Services */}
                    {order.type === 'puja' ? (
                        <div className="bg-orange/5 border border-orange/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 mb-8">
                             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-orange shadow-premium shrink-0 border border-orange/5 relative">
                                <i className="fa-solid fa-om text-3xl"></i>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                                    <i className="fa-solid fa-check text-[10px] text-white"></i>
                                </div>
                             </div>
                             <div className="flex-1 text-center md:text-left space-y-2">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <h4 className="text-xl font-black text-slate-900 m-0 uppercase italic">{order.name || 'Spiritual Service'}</h4>
                                    <span className="px-3 py-0.5 bg-orange text-white text-[9px] font-black uppercase tracking-widest rounded-full">Puja Booking</span>
                                </div>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-lg">
                                    Your personal consultation and puja session scheduled. Our experts will connect with you shortly for the rituals and process.
                                </p>
                             </div>
                             <div className="px-8 py-4 bg-white rounded-2xl border border-orange/10 shadow-sm flex flex-col items-center justify-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ritual Value</span>
                                <span className="text-xl md:text-2xl font-black text-orange">₹{order.amount}</span>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Delivery OTP Section (New) */}
                            {(order.deliveryOtp || order.delivery_otp || order.deliveryOTP) && 
                             order.status?.toLowerCase() !== 'delivered' && 
                             order.status?.toLowerCase() !== 'cancelled' && (
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 mb-6 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <i className="fa-solid fa-shield-halved"></i>
                                        <span>Secure Delivery Verification</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-[0.3em] font-mono">
                                            {order.deliveryOtp || order.delivery_otp || order.deliveryOTP}
                                        </span>
                                        <p className="text-[10px] text-orange-500 font-bold mt-2 uppercase tracking-widest text-center">Share this OTP only with the delivery person</p>
                                    </div>
                                    <div className="absolute top-2 right-4 opacity-5 pointer-events-none">
                                        <i className="fa-solid fa-truck-fast text-6xl"></i>
                                    </div>
                                </div>
                            )}

                            {(order.items || order.OrderItems || []).filter(Boolean).map(
                                (item: any, itemIdx: number) => {
                                const product = item.product || item.Product;
                                const productImg =
                                    getProductImageUrl(product) !== FALLBACK_IMG
                                    ? getProductImageUrl(product)
                                    : getProductImageUrl(item);

                                return (
                                    <div
                                    key={item.id || itemIdx}
                                    className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                    >
                                    <div className="w-16 h-16 rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm shrink-0">
                                        <Image
                                        src={productImg}
                                        alt={product?.name || t.productName}
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                            (e.target as any).src = FALLBACK_IMG;
                                        }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4 mb-1">
                                        <h6 className="font-bold text-gray-900 m-0 truncate">
                                            {product?.name || t.productName}
                                        </h6>
                                        <span className="font-bold text-gray-900 text-lg">
                                            ₹{item.price || 0}
                                        </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                        <span
                                            className="text-gray-400 text-xs font-medium"
                                            style={fontStyle}
                                        >
                                            {t.qty}: {item.quantity || 1}
                                        </span>
                                        {order.status?.toLowerCase() ===
                                            "delivered" && (
                                            <button
                                                onClick={() => onOpenReviewModal(order.merchantId || order.Merchant?.id || order.merchant?.id, order.id)}
                                                className="text-orange font-black text-xs no-underline hover:underline bg-transparent border-0 p-0 cursor-pointer"
                                                style={fontStyle}
                                            >
                                                {t.writeReview}
                                            </button>
                                        )}
                                        </div>
                                    </div>
                                    </div>
                                );
                                }
                            )}
                        </div>
                    )}

                    {/* Order Footer Actions */}
                    <div className="mt-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center py-6 border-t border-gray-100">
                      {(order.shippingAddress || order.shipping_address) && (
                        <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <span className="max-w-[200px] truncate">
                            {(order.shippingAddress || order.shipping_address).city},{" "}
                            {(order.shippingAddress || order.shipping_address).state}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-3 w-full md:w-auto">
                        {order.status?.toLowerCase() === "pending" && (
                          <button
                            className="flex-1 md:flex-none px-6 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors"
                            style={fontStyle}
                          >
                            {t.cancelOrder}
                          </button>
                        )}

                        {orderDisputes[order.tracking_id || order.trackingId || order.id] ? (
                          <button
                            onClick={() => onViewChat(orderDisputes[order.tracking_id || order.trackingId || order.id])}
                            className="flex-1 md:flex-none relative px-6 py-2 bg-orange text-white font-bold text-xs rounded-xl hover:bg-orange/90 transition-all shadow-md flex items-center justify-center gap-2"
                            style={fontStyle}
                          >
                            <i className="fa-solid fa-comments"></i>
                            {t.reportIssueDiscussion}
                            {orderDisputes[order.tracking_id || order.trackingId || order.id].unreadCount > 0 && (
                              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                                {orderDisputes[order.tracking_id || order.trackingId || order.id].unreadCount}
                              </span>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => onReportIssue(order)}
                            className="flex-1 md:flex-none px-6 py-2 border border-red-100 text-red-500 font-bold text-xs rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            style={fontStyle}
                          >
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {t.reportIssue}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detailed Shipping & Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                      <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <h6
                          className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-6 flex items-center"
                          style={fontStyle}
                        >
                          <i className="fa-solid fa-truck-fast mr-2 text-orange/60"></i>
                          {t.shippingAddress}
                        </h6>
                        {(order.shippingAddress || order.shipping_address) ? (
                          <div className="relative z-10">
                            <p className="font-bold text-gray-900 mb-2">
                              {(order.shippingAddress || order.shipping_address)
                                .full_name || userName}
                            </p>
                            <div className="space-y-1 text-sm text-gray-500 font-medium">
                              <p className="m-0">
                                {(order.shippingAddress || order.shipping_address)
                                  .line1}
                              </p>
                              {(order.shippingAddress || order.shipping_address)
                                .line2 && (
                                <p className="m-0">
                                  {(order.shippingAddress || order.shipping_address)
                                    .line2}
                                </p>
                              )}
                              <p className="m-0">
                                {(order.shippingAddress || order.shipping_address)
                                  .city},{" "}
                                {(order.shippingAddress || order.shipping_address)
                                  .state} -{" "}
                                {(order.shippingAddress || order.shipping_address)
                                  .zip_code ||
                                  (order.shippingAddress || order.shipping_address)
                                    .zipCode}
                              </p>
                              <div className="pt-3 mt-3 border-t border-gray-200/50 flex items-center">
                                <i className="fa-solid fa-phone text-[10px] mr-2 text-gray-300"></i>
                                { (order.shippingAddress || order.shipping_address).phone || userPhone}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="text-sm text-gray-400 italic m-0"
                            style={fontStyle}
                          >
                            {t.noShippingAddress}
                          </p>
                        )}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                      </div>

                      <div className="bg-gray-900 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                        <h6
                          className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-6"
                          style={fontStyle}
                        >
                          {t.orderSummary}
                        </h6>
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400" style={fontStyle}>
                              {t.subtotal}
                            </span>
                            <span className="text-white font-bold tracking-tight">
                              ₹{order.amount || order.totalAmount || order.total_amount || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400" style={fontStyle}>
                              {t.shipping}
                            </span>
                            <span
                              className="text-emerald-400 font-black uppercase tracking-widest text-[10px]"
                              style={fontStyle}
                            >
                              {t.free}
                            </span>
                          </div>
                          <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                            <span
                              className="text-white font-bold"
                              style={fontStyle}
                            >
                              {t.total}
                            </span>
                            <div className="text-right">
                              <span className="block text-2xl md:text-3xl font-black text-orange leading-none">
                                ₹{order.amount || order.totalAmount || order.total_amount || 0}
                              </span>
                              <span
                                className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2 block"
                                style={fontStyle}
                              >
                                {t.paidVia}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Summary background effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })}

            {/* Load More Button */}
            {hasMore ? (
              <div className="flex justify-center mt-10">
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-orange-200 hover:text-orange hover:bg-orange-50/30 transition-all duration-300 flex items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
                  style={fontStyle}
                >
                  {loadingMore ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>{lang === "hi" ? "और लोड हो रहा है..." : "Loading More..."}</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrow-down-long"></i>
                      <span>{lang === "hi" ? "और ऑर्डर लोड करें" : "Load More Orders"}</span>
                    </>
                  )}
                </button>
              </div>
            ) : orders.length > 0 && (
              <div className="flex flex-col items-center justify-center mt-12 py-8 border-t border-dashed border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p className="text-gray-400 text-sm font-medium" style={fontStyle}>
                  {lang === "hi" ? "आपने अपने सभी ऑर्डर देख लिए हैं" : "You've viewed all your orders"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Merchant Review Modal */}
      <ReviewModal 
        isOpen={reviewModalOpen}
        onClose={onCloseReviewModal}
        onSubmit={onReviewSubmit}
      />
    </div>
  );
};

export default OrdersTab;
