import { Badge, Button } from 'flowbite-react';
import type { RentalOrder, RentalOrderStatus } from '../../services/rentalOrder/rentalOrderService';
import { rentalStatusBadgeClass } from './RentalOrderSidebar';

const badgeColor = (status: RentalOrderStatus): 'gray' | 'info' | 'purple' | 'success' | 'failure' => {
    switch (status) {
        case 'CREATED':     return 'gray';
        case 'ACCEPTED':    return 'info';
        case 'IN_PROGRESS': return 'purple';
        case 'COMPLETED':   return 'success';
        case 'CANCELED':    return 'failure';
    }
};

const formatDateTime = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
};

interface RentalOrderInfoProps {
    order: RentalOrder | null;
    onChangeStatus?: (status: RentalOrderStatus) => void;
}

const ACTIONS: { status: RentalOrderStatus; label: string; color: 'blue' | 'purple' | 'green' | 'red' }[] = [
    { status: 'ACCEPTED',    label: 'Accept',   color: 'blue'   },
    { status: 'IN_PROGRESS', label: 'Start',    color: 'purple' },
    { status: 'COMPLETED',   label: 'Complete', color: 'green'  },
    { status: 'CANCELED',    label: 'Cancel',   color: 'red'    },
];

const ALLOWED_TRANSITIONS: Record<RentalOrderStatus, RentalOrderStatus[]> = {
    CREATED:     ['ACCEPTED', 'CANCELED'],
    ACCEPTED:    ['IN_PROGRESS', 'CANCELED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELED'],
    COMPLETED:   [],
    CANCELED:    [],
};

const RentalOrderInfo = ({ order, onChangeStatus }: RentalOrderInfoProps) => {
    if (!order) {
        return (
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Select a rental order to view details</p>
                    <p className="text-gray-400 text-xs mt-1">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    const allowedActions = ACTIONS.filter(a => ALLOWED_TRANSITIONS[order.status].includes(a.status));

    return (
        <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Rental Order #{order.id}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge color={badgeColor(order.status)}>{order.status}</Badge>
                    {onChangeStatus && allowedActions.map(a => (
                        <Button key={a.status} size="xs" color={a.color} onClick={() => onChangeStatus(a.status)}>
                            {a.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">User</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">#{order.userId}</p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Vehicle</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.vehicle ? `${order.vehicle.brand} ${order.vehicle.model} · ${order.vehicle.licensePlate}` : order.vehicleId ? `#${order.vehicleId}` : '—'}
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDateTime(order.rentalStartDate)}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDateTime(order.rentalEndDate)}
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Rental Total</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.totalPrice != null ? `${order.totalPrice.toFixed(2)} EUR` : '—'}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Security Deposit</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {order.securityDeposit != null ? `${order.securityDeposit.toFixed(2)} EUR` : '—'}
                    </p>
                </div>

                {order.specialRequirements && (
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Special Requirements</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 whitespace-pre-wrap">
                            {order.specialRequirements}
                        </p>
                    </div>
                )}

                {order.cancellationReason && (
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Cancellation Reason</label>
                        <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200 whitespace-pre-wrap">
                            {order.cancellationReason}
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

export default RentalOrderInfo;
