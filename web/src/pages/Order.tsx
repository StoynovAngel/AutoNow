import {useState} from 'react';
import Navigation from '../components/Navigation';
import OrderManagementSidebar from '../components/order/OrderManagementSidebar';
import type {StatusFilter} from '../components/order/OrderManagementSidebar';
import OrderManagementContent from '../components/order/OrderManagementContent';
import {useOrders} from '../hooks/useOrders';

const Order = () => {
    const {
        orders,
        selectedOrderId,
        selectedOrder,
        loading,
        error,
        selectOrder,
        changeOrderStatus,
    } = useOrders();

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

    const handleAddOrder = () => {
        // TODO: Implement add order modal
        console.log('Add new order');
    };

    if (loading) {
        return (
            <>
                <Navigation/>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation/>
                <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md" role="alert" aria-live="assertive">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

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
                            onAddOrder={handleAddOrder}
                        />
                        <OrderManagementContent
                            selectedOrder={selectedOrder}
                            onChangeStatus={changeOrderStatus}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;
