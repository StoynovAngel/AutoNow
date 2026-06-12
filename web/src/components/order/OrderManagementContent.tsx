import {useState} from 'react';
import OrderInfo from './OrderInfo';
import AssignOrderModal from './AssignOrderModal';
import type {Order, OrderStatus} from './OrderInfo';
import type {Driver} from '../company/DriverInfo';
import type {Vehicle} from '../company/VehicleInfo';

interface OrderManagementContentProps {
    selectedOrder: Order | null;
    drivers: Driver[];
    vehicles: Vehicle[];
    onChangeStatus: (status: OrderStatus) => void;
    onAssign: (driverId: number, vehicleId: number) => Promise<void>;
    onAutoAssign: () => Promise<void>;
}

const OrderManagementContent = ({
    selectedOrder,
    drivers,
    vehicles,
    onChangeStatus,
    onAssign,
    onAutoAssign,
}: OrderManagementContentProps) => {
    const [assignOpen, setAssignOpen] = useState(false);

    return (
        <div className="flex-1 flex gap-4">
            <OrderInfo
                order={selectedOrder}
                onChangeStatus={onChangeStatus}
                onOpenAssign={selectedOrder ? () => setAssignOpen(true) : undefined}
                onAutoAssign={selectedOrder?.status === 'CREATED' ? onAutoAssign : undefined}
            />
            {assignOpen && selectedOrder && (
                <AssignOrderModal
                    order={selectedOrder}
                    drivers={drivers}
                    vehicles={vehicles}
                    onAssign={onAssign}
                    onClose={() => setAssignOpen(false)}
                />
            )}
        </div>
    );
};

export default OrderManagementContent;
