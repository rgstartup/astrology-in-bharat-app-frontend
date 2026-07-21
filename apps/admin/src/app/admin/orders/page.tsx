"use client";
import React, { useState, useEffect } from "react";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    ChevronDown,
    ChevronUp,
    Search,
    Eye,
    Box,
    LayoutGrid,
    ShoppingBag
} from "lucide-react";
import { toast } from "react-toastify";
import { Order, OrderService } from "@/services/orders.service";
import { getErrorMessage } from "@repo/lib";
import { SearchInput } from "@repo/ui";
import { Button } from "@repo/ui";
import { getNotificationSocket, connectAdminSocket } from "@/utils/socket";
import MerchantOrders from "./MerchantOrders";

// Cast icons
const PackageIcon = Package as any;
const TruckIcon = Truck as any;
const CheckCircleIcon = CheckCircle as any;
const ClockIcon = Clock as any;
const XCircleIcon = XCircle as any;
const ChevronDownIcon = ChevronDown as any;
const ChevronUpIcon = ChevronUp as any;
const EyeIcon = Eye as any;
const BoxIcon = Box as any;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [viewMode, setViewMode] = useState<"standard" | "merchant">("standard");

    const fetchOrders = async () => {
        setLoading(true);
        const [data, error] = await OrderService.getAllOrders();
        
        if (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
            setLoading(false);
            return;
        }

        // Handle various response structures
        if (Array.isArray(data)) {
            setOrders(data);
        } else if (data && data.data && Array.isArray(data.data)) {
            setOrders(data.data);
        } else {
            setOrders([]);
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchOrders();

        // Connect Admin Socket
        connectAdminSocket();
        const socket = getNotificationSocket();

        const handleNewOrder = (data: any) => {
            console.log("🔔 New Order Alert:", data);
            const orderId = data.order_id || data.orderId || data.id || 'Unknown';
            toast.info(`🎉 New Order Received! Order #${orderId}`);
            // Refresh order list to show new order at top
            fetchOrders();
        };

        socket.on('new_order', handleNewOrder);

        return () => {
            socket.off('new_order', handleNewOrder);
        };
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (newStatus === 'delivered') {
            const isConfirmed = window.confirm(
                "Are you sure you want to bypass OTP and mark this as delivered? Please ensure you have verified with the customer."
            );
            if (!isConfirmed) return;
        }

        const [_, error] = await OrderService.updateVal(id, newStatus);
        if (error) {
            console.error("Failed to update status", error);
            toast.error(getErrorMessage(error) || "Failed to update status");
            return;
        }
        // Manually update local state — backend no longer returns updated data
        setOrders(prev => prev.map(order =>
            String(order.id) === String(id) ? { ...order, status: newStatus } : order
        ));
        toast.success(`Order status updated to ${newStatus}`);
    };


    const handleCancelOrder = async () => {
        if (!cancelOrderId || !cancelReason.trim()) {
            toast.error("Please provide a cancellation reason");
            return;
        }

        const [_, error] = await OrderService.updateVal(cancelOrderId, 'cancelled', cancelReason);
        if (error) {
            console.error("Failed to cancel order", error);
            toast.error(getErrorMessage(error) || "Failed to cancel order");
            return;
        }
        
        toast.success("Order cancelled successfully");
        // Manually update local state — backend no longer returns updated data
        setOrders(prev => prev.map(order =>
            String(order.id) === String(cancelOrderId)
                ? { ...order, status: 'cancelled', cancellationReason: cancelReason }
                : order
        ));
        setShowCancelModal(false);
        setCancelOrderId(null);
        setCancelReason("");
    };


    const openCancelModal = (orderId: string) => {
        setCancelOrderId(orderId);
        setShowCancelModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'packed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered':
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <ClockIcon size={16} />;
            case 'packed': return <BoxIcon size={16} />;
            case 'shipped': return <TruckIcon size={16} />;
            case 'delivered':
            case 'completed': return <CheckCircleIcon size={16} />;
            case 'cancelled': return <XCircleIcon size={16} />;
            default: return <ClockIcon size={16} />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus;
        const matchesSearch =
            String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const tabs = [
        { id: 'all', label: 'All Orders' },
        { id: 'pending', label: 'Pending' },
        { id: 'packed', label: 'Packed' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="w-full overflow-hidden">
            <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                {/* Row 1: Buttons (always) + Search (desktop only) */}
                <div className="flex flex-row justify-between items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button 
                            onClick={() => setViewMode("standard")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${viewMode === "standard" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
                        >
                            <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
                            Standard View
                        </button>
                        <div className="w-px h-5 bg-gray-300 flex-shrink-0" />
                        <button 
                            onClick={() => setViewMode("merchant")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${viewMode === "merchant" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
                            Merchant Orders
                        </button>
                    </div>
                    {/* Search - Desktop only (right side) */}
                    {viewMode === "standard" && (
                        <div className="hidden sm:block w-64 flex-shrink-0">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search Order ID, Name..."
                            />
                        </div>
                    )}
                </div>

                {/* Row 2: Search - Mobile only (full width below buttons) */}
                {viewMode === "standard" && (
                    <div className="sm:hidden w-full">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search Order ID, Name..."
                        />
                    </div>
                )}
            </div>

            {viewMode === "merchant" ? (
                <MerchantOrders />
            ) : (
                <>
                    {/* Filter Tabs */}
                    <div className="-mx-4 sm:mx-0">
                    <div className="flex overflow-x-auto pb-3 mb-3 sm:mb-4 gap-2 no-scrollbar px-4 sm:px-0">
                        {tabs.map(tab => (
                            <Button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                variant={filterStatus === tab.id ? 'primary' : 'outline'}
                                size="sm"
                                className="rounded-full whitespace-nowrap text-xs"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                                                    Loading Orders...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                No orders found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map(order => (
                                            <React.Fragment key={order.id}>
                                                <tr className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        #{String(order.id)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date((order as any).created_at || order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        <div className="font-medium">{order.user?.name || "Guest"}</div>
                                                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                        ₹{(order as any).total_amount || order.totalAmount}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                {expandedOrderId === order.id ? <ChevronUpIcon size={18} /> : <EyeIcon size={18} />}
                                                            </button>

                                                            {/* Status Update Quick Actions */}
                                                            {order.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(String(order.id), 'packed')}
                                                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                                                                >
                                                                    Mark Packed
                                                                </button>
                                                            )}
                                                            {order.status === 'packed' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(String(order.id), 'shipped')}
                                                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 border border-indigo-200 transition-colors"
                                                                >
                                                                    Mark Shipped
                                                                </button>
                                                            )}
                                                            {order.status === 'shipped' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(String(order.id), 'delivered')}
                                                                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                                                                >
                                                                    Mark Delivered
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Expanded Details Row */}
                                                {expandedOrderId === order.id && (
                                                    <tr className="bg-gray-50/50">
                                                        <td colSpan={6} className="px-6 py-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                                                                {/* Items */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                                                                    <div className="space-y-3">
                                                                        {order.items?.map((item, idx) => (
                                                                            <div key={idx} className="flex items-start gap-3">
                                                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                                                    <PackageIcon size={20} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">{item.product?.name || "Product"}</p>
                                                                                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                                                </div>
                                                                                <div className="ml-auto font-medium text-sm">
                                                                                    ₹{item.quantity * item.price}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Shipping Address */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Details</h4>
                                                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                                                                        <p className="font-medium text-gray-900 mb-1">{order.user?.name}</p>
                                                                        <p>{((order as any).shipping_address || (order as any).shippingAddress)?.line1}</p>
                                                                        <p>{((order as any).shipping_address || (order as any).shippingAddress)?.city}, {((order as any).shipping_address || (order as any).shippingAddress)?.state} - {((order as any).shipping_address || (order as any).shippingAddress)?.zipCode}</p>
                                                                    </div>

                                                                    <div className="mt-4">
                                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</h4>
                                                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                                                            {['pending', 'packed', 'shipped', 'delivered'].map(s => (
                                                                                <Button
                                                                                    key={s}
                                                                                    onClick={() => handleStatusUpdate(String(order.id), s)}
                                                                                    disabled={order.status === s}
                                                                                    size="sm"
                                                                                    variant={order.status === s ? 'primary' : 'outline'}
                                                                                    className="capitalize whitespace-nowrap flex-shrink-0"
                                                                                >
                                                                                    {s}
                                                                                </Button>
                                                                            ))}
                                                                            {/* Cancel Button - Opens Modal */}
                                                                            <Button
                                                                                onClick={() => openCancelModal(String(order.id))}
                                                                                disabled={order.status === 'cancelled'}
                                                                                size="sm"
                                                                                variant="danger"
                                                                                className="capitalize whitespace-nowrap flex-shrink-0"
                                                                            >
                                                                                Cancelled
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for cancelling this order. This will be visible to the customer.
                        </p>

                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="e.g., Product out of stock, Customer requested cancellation..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                        />

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelOrderId(null);
                                    setCancelReason("");
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCancelOrder}
                                disabled={!cancelReason.trim()}
                                variant="danger"
                                className="flex-1"
                            >
                                Confirm Cancellation
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




