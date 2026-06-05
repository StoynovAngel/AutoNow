import {useEffect, useState} from 'react';
import Navigation from '../components/ui/Navigation.tsx';
import PageStatus from '../components/ui/PageStatus.tsx';
import OrderManagementSidebar from '../components/order/OrderManagementSidebar';
import type {StatusFilter} from '../components/order/OrderManagementSidebar';
import OrderManagementContent from '../components/order/OrderManagementContent';
import {useOrders} from '../hooks/useOrders';
import {useAllDrivers} from '../hooks/useAllDrivers';
import {vehicleService} from '../services/vehicle/vehicleService';
import type {Vehicle} from '../components/company/VehicleInfo';

const Order = () => {
    const {
        orders,
        selectedOrderId,
        selectedOrder,
        loading,
        error,
        selectOrder,
        changeOrderStatus,
        assignOrder,
        refreshOrders,
    } = useOrders();

    const {drivers} = useAllDrivers();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        let cancelled = false;
        vehicleService
            .getAllVehicles()
            .then((data) => {
                if (!cancelled) setVehicles(data);
            })
            .catch(() => {
                if (!cancelled) setVehicles([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

    if (loading) {
        return <PageStatus state="loading" />;
    }

    if (error) {
        return <PageStatus state="error" message={error} />;
    }

    const handleAssign = async (driverId: number, vehicleId: number) => {
        await assignOrder(driverId, vehicleId);
        await refreshOrders();
    };

    return (
        <>
            <Navigation/>
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 pb-6">
                <div className="max-w-400 mx-auto">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-sm text-gray-600 mt-0.5">Track and manage customer orders</p>
                    </div>
                    <div className="flex gap-4">
                        <OrderManagementSidebar
                            orders={orders}
                            selectedOrderId={selectedOrderId}
                            statusFilter={statusFilter}
                            onSelectOrder={selectOrder}
                            onChangeFilter={setStatusFilter}
                        />
                        <OrderManagementContent
                            selectedOrder={selectedOrder}
                            drivers={drivers}
                            vehicles={vehicles}
                            onChangeStatus={changeOrderStatus}
                            onAssign={handleAssign}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;
