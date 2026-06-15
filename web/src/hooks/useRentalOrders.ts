import { useState, useEffect } from 'react';
import { rentalOrderService } from '../services/rentalOrder/rentalOrderService';
import type { RentalOrder, RentalOrderStatus } from '../services/rentalOrder/rentalOrderService';
import { getErrorMessage } from '../utils/errors';

export const useRentalOrders = (companyId?: number | null) => {
    const [orders, setOrders] = useState<RentalOrder[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [companyId]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = companyId
                ? await rentalOrderService.getRentalOrdersByCompany(companyId)
                : await rentalOrderService.getAllRentalOrders();
            setOrders(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to load rental orders'));
        } finally {
            setLoading(false);
        }
    };

    const selectOrder = async (orderId: number) => {
        setSelectedOrderId(orderId);
        try {
            const data = await rentalOrderService.getRentalOrderById(orderId);
            setSelectedOrder(data);
        } catch {
            setSelectedOrder(null);
        }
    };

    const changeStatus = async (status: RentalOrderStatus) => {
        if (!selectedOrderId) return;
        const updated = status === 'CANCELED'
            ? await rentalOrderService.adminCancelRentalOrder(selectedOrderId)
            : await rentalOrderService.updateRentalOrderStatus(selectedOrderId, status);
        setSelectedOrder(updated);
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    };

    return {
        orders,
        selectedOrderId,
        selectedOrder,
        loading,
        error,
        selectOrder,
        changeStatus,
        refreshOrders: fetchOrders,
    };
};
