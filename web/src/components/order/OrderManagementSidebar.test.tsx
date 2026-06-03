import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderManagementSidebar from './OrderManagementSidebar';
import type { Order } from './OrderInfo';

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

describe('OrderManagementSidebar', () => {
    it('shows an empty message when there are no orders', () => {
        render(
            <OrderManagementSidebar
                orders={[]}
                selectedOrderId={null}
                statusFilter="ALL"
                onSelectOrder={vi.fn()}
                onChangeFilter={vi.fn()}
            />
        );
        expect(screen.getByText('No orders yet')).toBeInTheDocument();
    });

    it('lists orders and shows a per-status empty message when filtered out', () => {
        render(
            <OrderManagementSidebar
                orders={[makeOrder(1, { status: 'CREATED' })]}
                selectedOrderId={null}
                statusFilter="COMPLETED"
                onSelectOrder={vi.fn()}
                onChangeFilter={vi.fn()}
            />
        );
        expect(screen.getByText('No COMPLETED orders')).toBeInTheDocument();
    });

    it('filters orders by status and reflects count', () => {
        render(
            <OrderManagementSidebar
                orders={[
                    makeOrder(1, { status: 'CREATED' }),
                    makeOrder(2, { status: 'ACCEPTED' }),
                    makeOrder(3, { status: 'ACCEPTED' }),
                ]}
                selectedOrderId={null}
                statusFilter="ACCEPTED"
                onSelectOrder={vi.fn()}
                onChangeFilter={vi.fn()}
            />
        );

        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('#3')).toBeInTheDocument();
        expect(screen.queryByText('#1')).not.toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('calls onSelectOrder when an order button is clicked', () => {
        const onSelectOrder = vi.fn();
        render(
            <OrderManagementSidebar
                orders={[makeOrder(1)]}
                selectedOrderId={null}
                statusFilter="ALL"
                onSelectOrder={onSelectOrder}
                onChangeFilter={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /#1/ }));

        expect(onSelectOrder).toHaveBeenCalledWith(1);
    });

    it('calls onChangeFilter when a filter chip is clicked', () => {
        const onChangeFilter = vi.fn();
        render(
            <OrderManagementSidebar
                orders={[]}
                selectedOrderId={null}
                statusFilter="ALL"
                onSelectOrder={vi.fn()}
                onChangeFilter={onChangeFilter}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'COMPLETED' }));

        expect(onChangeFilter).toHaveBeenCalledWith('COMPLETED');
    });

    it('marks the active filter and selected order with aria-pressed=true', () => {
        render(
            <OrderManagementSidebar
                orders={[makeOrder(1), makeOrder(2)]}
                selectedOrderId={2}
                statusFilter="ALL"
                onSelectOrder={vi.fn()}
                onChangeFilter={vi.fn()}
            />
        );

        expect(screen.getByRole('button', { name: 'ALL' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'COMPLETED' })).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('button', { name: /#2/ })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: /#1/ })).toHaveAttribute('aria-pressed', 'false');
    });
});
