import { describe, it, expect, beforeEach, vi } from 'vitest';
import { orderService, type OrderPayload } from '../orderService';
import apiClient from '../../apiClient';

vi.mock('../../apiClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

const payload: OrderPayload = {
    userId: 1,
    vehicleType: 'TAXI',
    pickupAddress: 'Pickup',
    pickupLatitude: 42.7,
    pickupLongitude: 23.3,
    dropoffAddress: 'Dropoff',
    dropoffLatitude: 42.8,
    dropoffLongitude: 23.4,
};

describe('orderService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('getAllOrders GETs /orders', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

        await orderService.getAllOrders();

        expect(apiClient.get).toHaveBeenCalledWith('/orders');
    });

    it('getOrderById GETs /orders/{id}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 5 } });

        await orderService.getOrderById('5');

        expect(apiClient.get).toHaveBeenCalledWith('/orders/5');
    });

    it('getOrdersByUser GETs /orders/user/{userId}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

        await orderService.getOrdersByUser('7');

        expect(apiClient.get).toHaveBeenCalledWith('/orders/user/7');
    });

    it('createOrder POSTs to /orders with payload', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 1 } });

        await orderService.createOrder(payload);

        expect(apiClient.post).toHaveBeenCalledWith('/orders', payload);
    });

    it('updateOrder PUTs to /orders/{id} with payload', async () => {
        vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 5 } });

        await orderService.updateOrder('5', payload);

        expect(apiClient.put).toHaveBeenCalledWith('/orders/5', payload);
    });

    it('updateOrderStatus PATCHes /orders/{id}/status with status body', async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: { id: 5, status: 'ACCEPTED' } });

        await orderService.updateOrderStatus('5', 'ACCEPTED');

        expect(apiClient.patch).toHaveBeenCalledWith('/orders/5/status', { status: 'ACCEPTED' });
    });

    it('assignOrder PATCHes /orders/{id}/assign with driverId and vehicleId', async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: { id: 5, driverId: 11, vehicleId: 22 } });

        await orderService.assignOrder('5', 11, 22);

        expect(apiClient.patch).toHaveBeenCalledWith('/orders/5/assign', { driverId: 11, vehicleId: 22 });
    });

    it('deleteOrder DELETEs /orders/{id}', async () => {
        vi.mocked(apiClient.delete).mockResolvedValue({});

        await orderService.deleteOrder('5');

        expect(apiClient.delete).toHaveBeenCalledWith('/orders/5');
    });
});
