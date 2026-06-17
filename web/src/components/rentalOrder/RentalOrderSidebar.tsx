import type { RentalOrder, RentalOrderStatus } from '../../services/rentalOrder/rentalOrderService';

const STATUSES: RentalOrderStatus[] = ['CREATED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];

export const rentalStatusBadgeClass = (status: RentalOrderStatus): string => {
    switch (status) {
        case 'CREATED':     return 'bg-gray-100 text-gray-700';
        case 'ACCEPTED':    return 'bg-blue-100 text-blue-700';
        case 'IN_PROGRESS': return 'bg-violet-100 text-violet-700';
        case 'COMPLETED':   return 'bg-green-100 text-green-700';
        case 'CANCELED':    return 'bg-red-100 text-red-700';
    }
};

type StatusFilter = 'ALL' | RentalOrderStatus;

interface RentalOrderSidebarProps {
    orders: RentalOrder[];
    selectedOrderId: number | null;
    statusFilter: StatusFilter;
    onSelectOrder: (id: number) => void;
    onChangeFilter: (f: StatusFilter) => void;
}

const RentalOrderSidebar = ({ orders, selectedOrderId, statusFilter, onSelectOrder, onChangeFilter }: RentalOrderSidebarProps) => {
    const filtered = orders.filter(o => statusFilter === 'ALL' || o.status === statusFilter);

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="flex flex-col gap-3 w-72">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Rentals</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {filtered.length}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {(['ALL', ...STATUSES] as StatusFilter[]).map(f => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => onChangeFilter(f)}
                            aria-pressed={statusFilter === f}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border transition-all ${
                                statusFilter === f
                                    ? 'bg-brand-500 text-white border-brand-500'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-[28rem] scrollbar-hide">
                    {filtered.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                            {statusFilter === 'ALL' ? 'No rental orders yet' : 'No matching orders'}
                        </p>
                    ) : (
                        filtered.map(order => (
                            <button
                                key={order.id}
                                type="button"
                                onClick={() => onSelectOrder(order.id)}
                                aria-pressed={selectedOrderId === order.id}
                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedOrderId === order.id
                                        ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-lg transform scale-[1.02]'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm">#{order.id}</p>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                        selectedOrderId === order.id ? 'bg-white/20 text-white' : rentalStatusBadgeClass(order.status)
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                {order.vehicle && (
                                    <p className={`text-xs mt-0.5 truncate ${selectedOrderId === order.id ? 'text-brand-50' : 'text-gray-500'}`}>
                                        {order.vehicle.brand} {order.vehicle.model} · {order.vehicle.licensePlate}
                                    </p>
                                )}
                                <p className={`text-xs mt-0.5 ${selectedOrderId === order.id ? 'text-brand-100' : 'text-gray-400'}`}>
                                    {formatDate(order.rentalStartDate)} → {formatDate(order.rentalEndDate)}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalOrderSidebar;
export type { StatusFilter as RentalStatusFilter };
