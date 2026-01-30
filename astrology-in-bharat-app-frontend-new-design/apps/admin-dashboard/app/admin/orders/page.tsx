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
    Box
} from "lucide-react";
import { toast } from "react-toastify";
import { Order, OrderService } from "../../../src/services/orders.service";
import { SearchInput } from "../../../../shared/components/SearchInput";
import { getNotificationSocket, connectAdminSocket } from "../../../src/utils/socket";

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

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await OrderService.getAllOrders();
            // Handle various response structures
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.data && Array.isArray(data.data)) {
                setOrders(data.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            // toast.warning("Could not fetch orders. Backend API might be missing.");
            // Mock data for UI demonstration if API fails or returns empty
            setOrders([
                /*
                {
                    id: "ORDER-MOCK-101",
                    totalAmount: 1499,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    user: { name: "Ravi Test", email: "ravi@example.com" },
                    shippingAddress: {
                        line1: "123 Main St",
                        city: "New Delhi",
                        state: "Delhi",
                        zipCode: "110001"
                    },
                    items: [
                        { quantity: 1, price: 1499, product: { name: "Rudraksha Mala" } }
                    ]
                }
                */
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Connect Admin Socket
        connectAdminSocket();
        const socket = getNotificationSocket();

        const handleNewOrder = (data: any) => {
            console.log("🔔 New Order Alert:", data);
            toast.info(`🎉 New Order Received! Order #${data.orderId}`);
            // Refresh order list to show new order at top
            fetchOrders();
        };

        socket.on('new_order', handleNewOrder);

        return () => {
            socket.off('new_order', handleNewOrder);
        };
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await OrderService.updateVal(id, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelOrderId || !cancelReason.trim()) {
            toast.error("Please provide a cancellation reason");
            return;
        }

        try {
            await OrderService.updateVal(cancelOrderId, 'cancelled', cancelReason);
            toast.success("Order cancelled successfully");
            setShowCancelModal(false);
            setCancelOrderId(null);
            setCancelReason("");
            fetchOrders();
        } catch (error) {
            console.error("Failed to cancel order", error);
            toast.error("Failed to cancel order");
        }
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
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <div className="w-full md:w-64">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search Order ID, Name..."
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterStatus(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === tab.id
                            ? 'bg-yellow-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
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
                                                #{String(order.id).substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="font-medium">{order.user?.name || "Guest"}</div>
                                                <div className="text-xs text-gray-400">{order.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                ₹{order.totalAmount}
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
                                                                <p>{order.shippingAddress?.line1}</p>
                                                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                                                            </div>

                                                            <div className="mt-4">
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {['pending', 'packed', 'shipped', 'delivered'].map(s => (
                                                                        <button
                                                                            key={s}
                                                                            onClick={() => handleStatusUpdate(String(order.id), s)}
                                                                            disabled={order.status === s}
                                                                            className={`px-3 py-1 rounded text-xs border capitalize transition-all ${order.status === s
                                                                                ? 'bg-gray-800 text-white border-gray-800'
                                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                                                                }`}
                                                                        >
                                                                            {s}
                                                                        </button>
                                                                    ))}
                                                                    {/* Cancel Button - Opens Modal */}
                                                                    <button
                                                                        onClick={() => openCancelModal(String(order.id))}
                                                                        disabled={order.status === 'cancelled'}
                                                                        className={`px-3 py-1 rounded text-xs border capitalize transition-all ${order.status === 'cancelled'
                                                                            ? 'bg-gray-800 text-white border-gray-800'
                                                                            : 'bg-red-50 text-red-600 border-red-200 hover:border-red-400'
                                                                            }`}
                                                                    >
                                                                        cancelled
                                                                    </button>
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
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelOrderId(null);
                                    setCancelReason("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={!cancelReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
