import apiClient from '../apiClient';
import type {Order, OrderStatus} from '../../components/order/OrderInfo';

export interface OrderPayload {
    userId: number;
    driverId?: number;
    vehicleId?: number;
    vehicleType: string;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    estimatedPrice?: number;
    distanceKm?: number;
    estimatedDurationMinutes?: number;
    specialRequirements?: string;
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

    getOrdersByUser: async (userId: string): Promise<Order[]> => {
        const {data} = await apiClient.get(`/orders/user/${userId}`);
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
