import {useState, useEffect} from 'react';
import {orderService} from '../services/order/orderService';
import type {Order, OrderStatus} from '../components/order/OrderInfo';

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getAllOrders();
            console.log('Orders fetched:', data);
            setOrders(data);
        } catch (err: any) {
            console.error('Failed to fetch orders', err);
            console.error('Error response:', err.response?.data);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const selectOrder = async (orderId: number) => {
        setSelectedOrderId(orderId);
        if (orderId) {
            try {
                const data = await orderService.getOrderById(String(orderId));
                console.log('Order details:', data);
                setSelectedOrder(data);
            } catch (err: any) {
                console.error('Failed to fetch order details', err);
                console.error('Error response:', err.response?.data);
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
        } catch (err: any) {
            console.error('Failed to update order status', err);
            console.error('Error response:', err.response?.data);
        }
    };

    return {
        orders,
        selectedOrderId,
        selectedOrder,
        loading,
        error,
        selectOrder,
        changeOrderStatus,
        refreshOrders: fetchOrders,
    };
};
