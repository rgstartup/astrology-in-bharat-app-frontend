export interface OrderItem {
    id?: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
        imageUrl?: string;
    };
}

export interface Order {
    id: string;
    totalAmount: number;
    status: 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress?: {
        line1: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: OrderItem[];
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
};

const getAuthHeaders = (): Record<string, string> => {
    const token = getCookie("accessToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

const API_BASE = "";

export const OrderService = {
    getAllOrders: async () => {
        // Backend endpoint: GET /api/v1/orders/admin/all (Admin only)
        const res = await fetch(`${API_BASE}/api/v1/orders/admin/all`, {
            headers: { ...getAuthHeaders() }
        });
        if (!res.ok) {
            if (res.status === 404) return [];
            throw new Error("Failed to fetch orders");
        }
        return res.json();
    },

    updateVal: async (id: string, status: string, reason?: string) => {
        // Backend endpoint: PATCH /api/v1/orders/:id/status (Admin only)
        const body: any = { status };
        if (reason) {
            body.cancellationReason = reason;
        }

        const res = await fetch(`${API_BASE}/api/v1/orders/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update order status");
        }
        return res.json();
    }
};



