import apiClient from '../apiClient';
import type {Order, OrderStatus} from '../../components/order/OrderInfo';

export interface OrderPayload {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    companyId: number;
    driverId?: number;
    vehicleType: string;
    pickupAddress: string;
    dropoffAddress: string;
    scheduledAt: string;
    notes?: string;
    totalPrice?: number;
}

export const orderService = {
    getAllOrders: async (): Promise<Order[]> => {
        const {data} = await apiClient.get('/orders');
        return data;
    },

    getOrderById: async (id: string): Promise<Order> => {
        const {data} = await apiClient.get(`/orders/${id}`);
        return data;
    },

    getOrdersByCompany: async (companyId: string): Promise<Order[]> => {
        const {data} = await apiClient.get(`/orders/company/${companyId}`);
        return data;
    },

    createOrder: async (orderData: OrderPayload): Promise<Order> => {
        const {data} = await apiClient.post('/orders', orderData);
        return data;
    },

    updateOrder: async (id: string, orderData: OrderPayload): Promise<Order> => {
        const {data} = await apiClient.put(`/orders/${id}`, orderData);
        return data;
    },

    updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
        const {data} = await apiClient.patch(`/orders/${id}/status`, {status});
        return data;
    },

    deleteOrder: async (id: string): Promise<void> => {
        await apiClient.delete(`/orders/${id}`);
    }
};
