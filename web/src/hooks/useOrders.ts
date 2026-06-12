import {useState, useEffect} from 'react';
import {orderService} from '../services/order/orderService';
import type {Order, OrderStatus} from '../components/order/OrderInfo';
import {getErrorMessage} from '../utils/errors';

export const useOrders = (companyId?: number | null) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
                ? await orderService.getOrdersByCompany(companyId)
                : await orderService.getAllOrders();
            setOrders(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to load orders'));
        } finally {
            setLoading(false);
        }
    };

    const selectOrder = async (orderId: number) => {
        setSelectedOrderId(orderId);
        if (orderId) {
            try {
                const data = await orderService.getOrderById(String(orderId));
                setSelectedOrder(data);
            } catch {
                setSelectedOrder(null);
            }
        } else {
            setSelectedOrder(null);
        }
    };

    const changeOrderStatus = async (status: OrderStatus) => {
        if (!selectedOrderId) return;
        try {
            const updated = await orderService.updateOrderStatus(String(selectedOrderId), status);
            setSelectedOrder(updated);
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        } catch {
            // intentionally swallowed
        }
    };

    const assignOrder = async (driverId: number, vehicleId: number) => {
        if (!selectedOrderId) return;
        const updated = await orderService.assignOrder(String(selectedOrderId), driverId, vehicleId);
        setSelectedOrder(updated);
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        return updated;
    };

    const autoAssignOrder = async () => {
        if (!selectedOrderId) return;
        const updated = await orderService.autoAssign(String(selectedOrderId));
        setSelectedOrder(updated);
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        return updated;
    };

    return {
        orders,
        selectedOrderId,
        selectedOrder,
        loading,
        error,
        selectOrder,
        changeOrderStatus,
        assignOrder,
        autoAssignOrder,
        refreshOrders: fetchOrders,
    };
};
