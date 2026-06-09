import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderManagementSidebar from '../OrderManagementSidebar';
import type { Order } from '../OrderInfo';

const makeOrder = (id: number, overrides: Partial<Order> = {}): Order => ({
    id,
    userId: 1,
    vehicleType: 'TAXI',
    pickupAddress: `Pickup ${id}`,
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffAddress: `Dropoff ${id}`,
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    status: 'CREATED',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
});

const defaultProps = {
    orders: [],
    selectedOrderId: null,
    statusFilter: 'ALL' as const,
    vehicleTypeFilter: 'ALL' as const,
    onSelectOrder: vi.fn(),
    onChangeFilter: vi.fn(),
    onChangeVehicleType: vi.fn(),
};

describe('OrderManagementSidebar', () => {
    it('shows an empty message when there are no orders', () => {
        render(<OrderManagementSidebar {...defaultProps} />);
        expect(screen.getByText('No orders yet')).toBeInTheDocument();
    });

    it('shows "No matching orders" when filters are active and nothing matches', () => {
        render(
            <OrderManagementSidebar
                {...defaultProps}
                orders={[makeOrder(1, { status: 'CREATED' })]}
                statusFilter="COMPLETED"
            />
        );
        expect(screen.getByText('No matching orders')).toBeInTheDocument();
    });

    it('filters orders by status and reflects count', () => {
        render(
            <OrderManagementSidebar
                {...defaultProps}
                orders={[
                    makeOrder(1, { status: 'CREATED' }),
                    makeOrder(2, { status: 'ACCEPTED' }),
                    makeOrder(3, { status: 'ACCEPTED' }),
                ]}
                statusFilter="ACCEPTED"
            />
        );

        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('#3')).toBeInTheDocument();
        expect(screen.queryByText('#1')).not.toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('filters orders by vehicle type', () => {
        render(
            <OrderManagementSidebar
                {...defaultProps}
                orders={[
                    makeOrder(1, { vehicleType: 'TAXI' }),
                    makeOrder(2, { vehicleType: 'LOGISTICS' }),
                    makeOrder(3, { vehicleType: 'LOGISTICS' }),
                ]}
                vehicleTypeFilter="LOGISTICS"
            />
        );

        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('#3')).toBeInTheDocument();
        expect(screen.queryByText('#1')).not.toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('applies both status and vehicle type filters', () => {
        render(
            <OrderManagementSidebar
                {...defaultProps}
                orders={[
                    makeOrder(1, { vehicleType: 'TAXI', status: 'CREATED' }),
                    makeOrder(2, { vehicleType: 'LOGISTICS', status: 'CREATED' }),
                    makeOrder(3, { vehicleType: 'LOGISTICS', status: 'ACCEPTED' }),
                ]}
                statusFilter="CREATED"
                vehicleTypeFilter="LOGISTICS"
            />
        );

        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.queryByText('#1')).not.toBeInTheDocument();
        expect(screen.queryByText('#3')).not.toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('calls onSelectOrder when an order button is clicked', () => {
        const onSelectOrder = vi.fn();
        render(
            <OrderManagementSidebar
                {...defaultProps}
                orders={[makeOrder(1)]}
                onSelectOrder={onSelectOrder}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /#1/ }));

        expect(onSelectOrder).toHaveBeenCalledWith(1);
    });

    it('calls onChangeFilter when a status chip is clicked', () => {
        const onChangeFilter = vi.fn();
        render(
            <OrderManagementSidebar
                {...defaultProps}
                onChangeFilter={onChangeFilter}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'COMPLETED' }));

        expect(onChangeFilter).toHaveBeenCalledWith('COMPLETED');
    });

    it('calls onChangeVehicleType when a vehicle type chip is clicked', () => {
        const onChangeVehicleType = vi.fn();
        render(
            <OrderManagementSidebar
                {...defaultProps}
                onChangeVehicleType={onChangeVehicleType}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'LOGISTICS' }));

        expect(onChangeVehicleType).toHaveBeenCalledWith('LOGISTICS');
    });

    it('marks the active status filter and selected order with aria-pressed=true', () => {
        render(
            <OrderManagementSidebar
                {...defaultProps}
                orders={[makeOrder(1), makeOrder(2)]}
                selectedOrderId={2}
                statusFilter="ALL"
            />
        );

        // Two "ALL" buttons exist (status row + type row); both should have aria-pressed=true when both are ALL
        const allButtons = screen.getAllByRole('button', { name: 'ALL' });
        expect(allButtons).toHaveLength(2);
        expect(allButtons[0]).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'COMPLETED' })).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('button', { name: /#2/ })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: /#1/ })).toHaveAttribute('aria-pressed', 'false');
    });

    it('marks the active vehicle type chip with aria-pressed=true', () => {
        render(
            <OrderManagementSidebar
                {...defaultProps}
                vehicleTypeFilter="LOGISTICS"
            />
        );

        expect(screen.getByRole('button', { name: 'LOGISTICS' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'TAXI' })).toHaveAttribute('aria-pressed', 'false');
    });
});
