import React from "react";
import Link from "next/link";
import { PATHS } from "@repo/routes";
import { getBasePath } from "@/utils/api-config";

const NextLink = Link as any;

interface OrdersTabProps {
    orders: any[];
    loadingOrders: boolean;
    expandedOrders: Record<number, boolean>;
    toggleOrder: (id: number) => void;
    orderDisputes: Record<number, any>;
    onViewChat: (dispute: any) => void;
    onReportIssue: (order: any) => void;
    userPhone?: string;
    userName?: string;
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
    userName
}) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#f3e5f5", color: "#8e24aa" }}>
                        <i className="fa-solid fa-bag-shopping"></i>
                    </span>
                    My Orders
                </h5>
            </div>
            <div className="card-body p-4 pt-4">
                {loadingOrders ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <p className="text-muted">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="fa-solid fa-box-open fa-3x text-light"></i>
                        </div>
                        <h6 className="fw-bold">No Orders Found</h6>
                        <p className="text-muted small">You haven't placed any orders yet.</p>
                        <NextLink href={PATHS.BUY_PRODUCTS} className="btn-orange-gradient px-4 py-2 mt-2 rounded-pill text-white text-decoration-none d-inline-block">
                            Shop Now
                        </NextLink>
                    </div>
                ) : (
                    <div className="order-list">
                        {orders.map((order: any, idx: number) => (
                            <div key={order.id || idx} className="order-card border rounded-4 p-0 mb-4 overflow-hidden shadow-sm transition-all hover-shadow-md">
                                <div className="bg-light p-3 d-flex justify-content-between align-items-center border-bottom flex-wrap gap-3">
                                    <div className="d-flex flex-column">
                                        <span className="text-muted small fw-bold text-uppercase">Order ID</span>
                                        <span className="fw-bold">#{order.orderId || order.id}</span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="text-muted small fw-bold text-uppercase">Date</span>
                                        <span className="fw-bold">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="text-muted small fw-bold text-uppercase">Total Amount</span>
                                        <span className="fw-bold text-orange-500">₹{order.totalAmount || order.amount || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status?.toLowerCase() === 'cancelled' || order.status?.toLowerCase() === 'failed'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status || 'Pending'}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleOrder(order.id);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <i className={`fa-solid fa-chevron-${expandedOrders[order.id] ? 'up' : 'down'} text-gray-600`}></i>
                                        </button>
                                    </div>
                                </div>

                                {expandedOrders[order.id] && (
                                    <div className="p-4 border-t border-gray-100 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                                        {(order.items || order.OrderItems || []).map((item: any, itemIdx: number) => {
                                            const product = item.product || item.Product;

                                            const formatImageUrl = (url: string) => {
                                                if (!url) return "/images/no-image.png";
                                                if (url.startsWith("http")) return url;
                                                const cleanApiUrl = getBasePath();
                                                if (url.startsWith("/uploads/")) return `${cleanApiUrl}${url}`;
                                                if (url.startsWith("/")) return url;
                                                return `${cleanApiUrl}/uploads/${url}`;
                                            };

                                            const productImg = formatImageUrl(product?.imageUrl || product?.image || (product?.images && product.images[0]));

                                            return (
                                                <div key={itemIdx} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom last-border-none">
                                                    <div className="rounded-3 border overflow-hidden" style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                                                        <img
                                                            src={productImg}
                                                            className="w-100 h-100 object-cover"
                                                            alt={product?.name || "Product"}
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between">
                                                            <h6 className="mb-0 fw-bold">{product?.name || "Product Name"}</h6>
                                                            <span className="fw-bold">₹{item.price || 0}</span>
                                                        </div>
                                                        <div className="text-muted small d-flex justify-content-between mt-1">
                                                            <span>Qty: {item.quantity || 1}</span>
                                                            {order.status?.toLowerCase() === 'delivered' && (
                                                                <NextLink href="#" className="text-orange-500 text-decoration-none fw-bold">Write Review</NextLink>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                                            {order.shippingAddress && (
                                                <div className="small text-muted">
                                                    <i className="fa-solid fa-location-dot me-1"></i>
                                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                                </div>
                                            )}
                                            <div className="d-flex gap-2">
                                                {order.status?.toLowerCase() === 'pending' && (
                                                    <button className="btn btn-danger btn-sm rounded-pill px-3 bg-red-600 border-red-600 text-white">Cancel Order</button>
                                                )}

                                                {orderDisputes[order.id] ? (
                                                    <button
                                                        onClick={() => onViewChat(orderDisputes[order.id])}
                                                        className="btn btn-primary btn-sm rounded-pill px-3 position-relative"
                                                        style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'white' }}
                                                    >
                                                        <i className="fa-solid fa-comments me-1"></i>
                                                        Chat Support
                                                        {orderDisputes[order.id].unreadCount > 0 && (
                                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                                                {orderDisputes[order.id].unreadCount}
                                                                <span className="visually-hidden">unread messages</span>
                                                            </span>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onReportIssue(order)}
                                                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                                    >
                                                        <i className="fa-solid fa-circle-exclamation me-1"></i>
                                                        Report Issue
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h6 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Shipping Address</h6>
                                                    {order.shippingAddress ? (
                                                        <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                            <p className="font-bold text-gray-800 mb-1">{order.shippingAddress.full_name || userName}</p>
                                                            <p className="mb-0">{order.shippingAddress.line1}</p>
                                                            {order.shippingAddress.line2 && <p className="mb-0">{order.shippingAddress.line2}</p>}
                                                            <p className="mb-0">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                                                            <p className="mt-2 text-gray-500"><i className="fa-solid fa-phone me-2"></i>{order.shippingAddress.phone || userPhone}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">Shipping address details not available.</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <h6 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Order Summary</h6>
                                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Subtotal</span>
                                                            <span className="font-medium">₹{order.totalAmount || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Shipping</span>
                                                            <span className="text-green-600 font-medium">FREE</span>
                                                        </div>
                                                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                                                            <span className="font-bold text-gray-800">Total</span>
                                                            <span className="font-bold text-orange-600 text-lg">₹{order.totalAmount || 0}</span>
                                                        </div>
                                                        <div className="mt-3 text-[10px] text-gray-400 text-center italic">
                                                            Paid via Razorpay Online
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTab;


