import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOrders } from '../useOrders';
import { orderService } from '../../services/order/orderService';
import type { Order } from '../../components/order/OrderInfo';

vi.mock('../../services/order/orderService');

const order = (id: number, overrides: Partial<Order> = {}): Order => ({
    id,
    userId: 1,
    vehicleType: 'TAXI',
    pickupAddress: 'A',
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffAddress: 'B',
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    status: 'CREATED',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
});

describe('useOrders', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('fetches orders on mount', async () => {
        const orders = [order(1), order(2)];
        vi.mocked(orderService.getAllOrders).mockResolvedValue(orders);

        const { result } = renderHook(() => useOrders());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(orderService.getAllOrders).toHaveBeenCalled();
        expect(result.current.orders).toEqual(orders);
        expect(result.current.error).toBeNull();
    });

    it('sets an error message when the fetch fails', async () => {
        vi.mocked(orderService.getAllOrders).mockRejectedValue(new Error('boom'));

        const { result } = renderHook(() => useOrders());

        await waitFor(() => {
            expect(result.current.error).toBe('Failed to load orders');
            expect(result.current.loading).toBe(false);
        });
    });

    it('selectOrder loads order details by id', async () => {
        vi.mocked(orderService.getAllOrders).mockResolvedValue([order(1)]);
        vi.mocked(orderService.getOrderById).mockResolvedValue(order(1, { pickupAddress: 'Detailed' }));

        const { result } = renderHook(() => useOrders());
        await waitFor(() => expect(result.current.orders).toHaveLength(1));

        await act(async () => {
            await result.current.selectOrder(1);
        });

        expect(orderService.getOrderById).toHaveBeenCalledWith('1');
        expect(result.current.selectedOrderId).toBe(1);
        expect(result.current.selectedOrder?.pickupAddress).toBe('Detailed');
    });

    it('changeOrderStatus is a no-op when no order is selected', async () => {
        vi.mocked(orderService.getAllOrders).mockResolvedValue([]);

        const { result } = renderHook(() => useOrders());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.changeOrderStatus('ACCEPTED');
        });

        expect(orderService.updateOrderStatus).not.toHaveBeenCalled();
    });

    it('changeOrderStatus updates the selected order and the list entry', async () => {
        vi.mocked(orderService.getAllOrders).mockResolvedValue([order(1), order(2)]);
        vi.mocked(orderService.getOrderById).mockResolvedValue(order(1));
        vi.mocked(orderService.updateOrderStatus).mockResolvedValue(order(1, { status: 'ACCEPTED' }));

        const { result } = renderHook(() => useOrders());
        await waitFor(() => expect(result.current.orders).toHaveLength(2));

        await act(async () => {
            await result.current.selectOrder(1);
        });

        await act(async () => {
            await result.current.changeOrderStatus('ACCEPTED');
        });

        expect(orderService.updateOrderStatus).toHaveBeenCalledWith('1', 'ACCEPTED');
        expect(result.current.selectedOrder?.status).toBe('ACCEPTED');
        expect(result.current.orders.find((o) => o.id === 1)?.status).toBe('ACCEPTED');
        expect(result.current.orders.find((o) => o.id === 2)?.status).toBe('CREATED');
    });

    it('refreshOrders re-fetches the list', async () => {
        vi.mocked(orderService.getAllOrders)
            .mockResolvedValueOnce([order(1)])
            .mockResolvedValueOnce([order(1), order(2)]);

        const { result } = renderHook(() => useOrders());
        await waitFor(() => expect(result.current.orders).toHaveLength(1));

        await act(async () => {
            await result.current.refreshOrders();
        });

        expect(result.current.orders).toHaveLength(2);
    });
});
