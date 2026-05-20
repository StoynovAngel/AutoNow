import type {Order, OrderStatus} from './OrderInfo';
import {ORDER_STATUSES, statusBadgeClass} from './OrderInfo';

type StatusFilter = 'ALL' | OrderStatus;

interface OrderManagementSidebarProps {
    orders: Order[];
    selectedOrderId: number | null;
    statusFilter: StatusFilter;
    onSelectOrder: (orderId: number) => void;
    onChangeFilter: (filter: StatusFilter) => void;
}

const OrderManagementSidebar = ({
    orders,
    selectedOrderId,
    statusFilter,
    onSelectOrder,
    onChangeFilter,
}: OrderManagementSidebarProps) => {
    const filteredOrders = statusFilter === 'ALL'
        ? orders
        : orders.filter((o) => o.status === statusFilter);

    const filters: StatusFilter[] = ['ALL', ...ORDER_STATUSES];

    return (
        <div className="flex flex-col gap-3 w-72">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Orders</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {filteredOrders.length}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {filters.map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => onChangeFilter(f)}
                            aria-pressed={statusFilter === f}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border transition-all ${
                                statusFilter === f
                                    ? 'bg-violet-600 text-white border-violet-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-[28rem] scrollbar-hide">
                    {filteredOrders.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                            {statusFilter === 'ALL' ? 'No orders yet' : `No ${statusFilter} orders`}
                        </p>
                    ) : (
                        filteredOrders.map((order) => (
                            <button
                                key={order.id}
                                type="button"
                                onClick={() => onSelectOrder(order.id)}
                                aria-pressed={selectedOrderId === order.id}
                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedOrderId === order.id
                                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg transform scale-[1.02]'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm">#{order.id}</p>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                        selectedOrderId === order.id ? 'bg-white/20 text-white' : statusBadgeClass(order.status)
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className={`text-xs mt-0.5 truncate ${selectedOrderId === order.id ? 'text-violet-100' : 'text-gray-500'}`}>
                                    {order.pickupAddress} → {order.dropoffAddress}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagementSidebar;
export type {StatusFilter};
