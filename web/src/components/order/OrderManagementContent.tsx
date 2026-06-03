import OrderInfo from './OrderInfo';
import type {Order, OrderStatus} from './OrderInfo';

interface OrderManagementContentProps {
    selectedOrder: Order | null;
    onChangeStatus: (status: OrderStatus) => void;
}

const OrderManagementContent = ({selectedOrder, onChangeStatus}: OrderManagementContentProps) => {
    return (
        <div className="flex-1 flex gap-4">
            <OrderInfo order={selectedOrder} onChangeStatus={onChangeStatus}/>
        </div>
    );
};

export default OrderManagementContent;
