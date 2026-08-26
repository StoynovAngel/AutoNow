import { useEffect, useState } from 'react';
import Navigation from '../components/ui/Navigation.tsx';
import PageStatus from '../components/ui/PageStatus.tsx';
import OrderManagementSidebar from '../components/order/OrderManagementSidebar';
import type { StatusFilter } from '../components/order/OrderManagementSidebar';
import type { VehicleTypeFilter } from '../components/order/OrderInfo';
import OrderManagementContent from '../components/order/OrderManagementContent';
import RentalOrderInfo from '../components/rentalOrder/RentalOrderInfo';
import { useOrders } from '../hooks/useOrders';
import { useRentalOrders } from '../hooks/useRentalOrders';
import { useAllDrivers } from '../hooks/useAllDrivers';
import { vehicleService } from '../services/vehicle/vehicleService';
import type { Vehicle } from '../components/company/VehicleInfo';
import { useAuth } from '../contexts/AuthContext';
import { rentalStatusBadgeClass } from '../components/rentalOrder/RentalOrderSidebar';

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

const Order = () => {
    const { user } = useAuth();
    const isCompanyAdmin = user?.authorities?.includes('ROLE_COMPANY_ADMIN') ?? false;
    const companyId = isCompanyAdmin ? (user?.companyId ?? null) : null;
    const isRentalCompany = isCompanyAdmin && user?.companyType === 'RENTAL';

    const {
        orders,
        selectedOrderId,
        selectedOrder,
        loading: ordersLoading,
        error: ordersError,
        selectOrder,
        deselectOrder,
        changeOrderStatus,
        assignOrder,
        refreshOrders,
    } = useOrders(companyId);

    const {
        orders: rentalOrders,
        selectedOrderId: selectedRentalOrderId,
        selectedOrder: selectedRentalOrder,
        loading: rentalsLoading,
        error: rentalsError,
        selectOrder: selectRentalOrder,
        deselectOrder: deselectRentalOrder,
        changeStatus: changeRentalStatus,
    } = useRentalOrders(companyId);

    const { drivers } = useAllDrivers(null, isCompanyAdmin ? companyId : null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        let cancelled = false;
        const fetch = isCompanyAdmin
            ? vehicleService.getMyVehicles()
            : vehicleService.getAllVehicles();
        fetch
            .then(data => { if (!cancelled) setVehicles(data); })
            .catch(() => { if (!cancelled) setVehicles([]); });
        return () => { cancelled = true; };
    }, [isCompanyAdmin]);

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<VehicleTypeFilter>('ALL');

    const loading = ordersLoading || rentalsLoading;

    if (loading) return <PageStatus state="loading" />;
    if (ordersError || rentalsError) return <PageStatus state="error" message={ordersError ?? rentalsError ?? undefined} />;

    const handleAssign = async (driverId: number, vehicleId: number) => {
        await assignOrder(driverId, vehicleId);
        await refreshOrders();
    };

    const handleSelectOrder = (id: number) => {
        selectOrder(id);
        deselectRentalOrder();
    };

    const handleSelectRental = (id: number) => {
        selectRentalOrder(id);
        deselectOrder();
    };

    const isRentalSelected = selectedRentalOrderId !== null && selectedRentalOrder !== null;

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 pb-6">
                <div className="max-w-400 mx-auto">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-sm text-gray-600 mt-0.5">Track and manage customer orders</p>
                    </div>
                    <div className="flex gap-4">
                        {/* Sidebar */}
                        <div className="flex flex-col gap-3 w-72">
                            {!isRentalCompany && (
                                <OrderManagementSidebar
                                    orders={orders}
                                    selectedOrderId={selectedOrderId}
                                    statusFilter={statusFilter}
                                    vehicleTypeFilter={vehicleTypeFilter}
                                    onSelectOrder={handleSelectOrder}
                                    onChangeFilter={setStatusFilter}
                                    onChangeVehicleType={setVehicleTypeFilter}
                                    hideVehicleTypeFilter={isCompanyAdmin}
                                />
                            )}

                            {/* Rental orders list */}
                            {isRentalCompany && <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-800">Rentals</h3>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {rentalOrders.length}
                                    </span>
                                </div>
                                <div className="space-y-2 overflow-y-auto max-h-[20rem] scrollbar-hide">
                                    {rentalOrders.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-4">No rental orders yet</p>
                                    ) : (
                                        rentalOrders.map(order => (
                                            <button
                                                key={order.id}
                                                type="button"
                                                onClick={() => handleSelectRental(order.id)}
                                                aria-pressed={selectedRentalOrderId === order.id}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                                    selectedRentalOrderId === order.id
                                                        ? 'bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-lg transform scale-[1.02]'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-sm">#{order.id}</p>
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                                        selectedRentalOrderId === order.id ? 'bg-white/20 text-white' : rentalStatusBadgeClass(order.status)
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                {order.vehicle && (
                                                    <p className={`text-xs mt-0.5 truncate ${selectedRentalOrderId === order.id ? 'text-brand-50' : 'text-gray-500'}`}>
                                                        {order.vehicle.brand} {order.vehicle.model} · {order.vehicle.licensePlate}
                                                    </p>
                                                )}
                                                <p className={`text-xs mt-0.5 ${selectedRentalOrderId === order.id ? 'text-brand-100' : 'text-gray-400'}`}>
                                                    {formatDate(order.rentalStartDate)} → {formatDate(order.rentalEndDate)}
                                                </p>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>}
                        </div>

                        {/* Detail panel — shows rental detail or regular order detail */}
                        {isRentalSelected ? (
                            <RentalOrderInfo
                                order={selectedRentalOrder}
                                onChangeStatus={changeRentalStatus}
                            />
                        ) : (
                            <OrderManagementContent
                                selectedOrder={selectedOrder}
                                drivers={drivers}
                                vehicles={vehicles}
                                onChangeStatus={changeOrderStatus}
                                onAssign={handleAssign}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;
