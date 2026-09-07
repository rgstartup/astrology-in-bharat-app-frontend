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

import { api } from "@/lib/api";

export const OrderService = {
    getAllOrders: async (): Promise<[any | null, any | null]> => {
        return await api.get("/orders/admin/all");
    },

    updateVal: async (id: string, status: string, reason?: string): Promise<[any | null, any | null]> => {
        const body: any = { status };
        if (reason) {
            body.cancellation_reason = reason;
        }
        return await api.patch(`/orders/${id}/status`, body);
    }
};




