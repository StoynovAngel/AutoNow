import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderManagementContent from '../OrderManagementContent';
import type { Order } from '../OrderInfo';

const order: Order = {
    id: 42,
    userId: 7,
    vehicleType: 'TAXI',
    pickupAddress: 'Pickup',
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffAddress: 'Dropoff',
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    status: 'CREATED',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
};

describe('OrderManagementContent', () => {
    it('renders the empty placeholder when no order is selected', () => {
        render(
            <OrderManagementContent
                selectedOrder={null}
                drivers={[]}
                vehicles={[]}
                onChangeStatus={vi.fn()}
                onAssign={vi.fn()}
            />,
        );
        expect(screen.getByText('Select an order to view details')).toBeInTheDocument();
    });

    it('renders the selected order and forwards status changes', () => {
        const onChangeStatus = vi.fn();
        render(
            <OrderManagementContent
                selectedOrder={order}
                drivers={[]}
                vehicles={[]}
                onChangeStatus={onChangeStatus}
                onAssign={vi.fn()}
            />,
        );

        expect(screen.getByText('Order #42')).toBeInTheDocument();

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ACCEPTED' } });
        expect(onChangeStatus).toHaveBeenCalledWith('ACCEPTED');
    });

    it('opens the assignment modal when the Assign button is clicked', () => {
        render(
            <OrderManagementContent
                selectedOrder={order}
                drivers={[]}
                vehicles={[]}
                onChangeStatus={vi.fn()}
                onAssign={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByTestId('order-assign-btn'));
        expect(screen.getByText('Assign Order — #42')).toBeInTheDocument();
    });
});
