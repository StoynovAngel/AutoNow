export type OrderStatus =
    | 'PENDING'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';

export const ORDER_STATUSES: OrderStatus[] = [
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
];

export interface Order {
    id: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    companyId: number;
    companyName?: string;
    driverId?: number;
    driverName?: string;
    vehicleType: string;
    status: OrderStatus;
    pickupAddress: string;
    dropoffAddress: string;
    scheduledAt: string;
    notes?: string;
    totalPrice?: number;
    createdAt: string;
    updatedAt: string;
}

export const statusBadgeClass = (status: OrderStatus): string => {
    switch (status) {
        case 'PENDING':
            return 'bg-gray-100 text-gray-700';
        case 'ASSIGNED':
            return 'bg-blue-100 text-blue-700';
        case 'IN_PROGRESS':
            return 'bg-violet-100 text-violet-700';
        case 'COMPLETED':
            return 'bg-green-100 text-green-700';
        case 'CANCELLED':
            return 'bg-red-100 text-red-700';
    }
};

const formatDateTime = (iso: string): string => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
};

interface OrderInfoProps {
    order: Order | null;
    onChangeStatus?: (status: OrderStatus) => void;
}

const OrderInfo = ({order, onChangeStatus}: OrderInfoProps) => {
    if (!order) {
        return (
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 17v-2a4 4 0 014-4h4M5 17V7a2 2 0 012-2h10a2 2 0 012 2v10m-2 4H7a2 2 0 01-2-2v-2h14v2a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Select an order to view details</p>
                    <p className="text-gray-400 text-xs mt-1">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Order #{order.id}</h2>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                        {order.status}
                    </span>
                    {onChangeStatus && (
                        <label className="sr-only" htmlFor={`order-${order.id}-status`}>Change status</label>
                    )}
                    {onChangeStatus && (
                        <select
                            id={`order-${order.id}-status`}
                            value={order.status}
                            onChange={(e) => onChangeStatus(e.target.value as OrderStatus)}
                            className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                            {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Customer</label>
                    <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.customerName}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.customerPhone}
                    </p>
                </div>

                {order.customerEmail && (
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            {order.customerEmail}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Company</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.companyName ?? `#${order.companyId}`}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Driver</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.driverName ?? (order.driverId ? `#${order.driverId}` : 'Unassigned')}
                    </p>
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Vehicle Type</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.vehicleType}
                    </p>
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.pickupAddress}
                    </p>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Dropoff</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.dropoffAddress}
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Scheduled</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDateTime(order.scheduledAt)}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Total</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : '—'}
                    </p>
                </div>

                {order.notes && (
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 whitespace-pre-wrap">
                            {order.notes}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Created</label>
                    <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDateTime(order.createdAt)}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Updated</label>
                    <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDateTime(order.updatedAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;
