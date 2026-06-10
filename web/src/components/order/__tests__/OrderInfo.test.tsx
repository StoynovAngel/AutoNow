import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderInfo, { statusBadgeClass } from '../OrderInfo';
import type { Order } from '../OrderInfo';

const makeOrder = (overrides: Partial<Order> = {}): Order => ({
    id: 42,
    userId: 7,
    vehicleType: 'TAXI',
    pickupAddress: '1 Pickup St',
    pickupLatitude: 42.7,
    pickupLongitude: 23.3,
    dropoffAddress: '2 Dropoff Ave',
    dropoffLatitude: 42.8,
    dropoffLongitude: 23.4,
    status: 'CREATED',
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-02T10:00:00Z',
    ...overrides,
});

describe('OrderInfo', () => {
    it('renders the empty placeholder when order is null', () => {
        render(<OrderInfo order={null} />);
        expect(screen.getByText('Select an order to view details')).toBeInTheDocument();
    });

    it('renders order id, status, addresses and user', () => {
        render(<OrderInfo order={makeOrder()} />);

        expect(screen.getByText('Order #42')).toBeInTheDocument();
        expect(screen.getByText('CREATED')).toBeInTheDocument();
        expect(screen.getByText('1 Pickup St')).toBeInTheDocument();
        expect(screen.getByText('2 Dropoff Ave')).toBeInTheDocument();
        expect(screen.getByText('#7')).toBeInTheDocument();
    });

    it('shows "Unassigned" when no driver is set, and #id when set', () => {
        const { rerender } = render(<OrderInfo order={makeOrder()} />);
        expect(screen.getByText('Unassigned')).toBeInTheDocument();

        rerender(<OrderInfo order={makeOrder({ driverId: 99 })} />);
        expect(screen.getByText('#99')).toBeInTheDocument();
    });

    it('formats numeric prices and distance with two decimals, em dash when missing', () => {
        render(<OrderInfo order={makeOrder({ estimatedPrice: 12.5, distanceKm: 3.4 })} />);

        expect(screen.getByText('12.50')).toBeInTheDocument();
        expect(screen.getByText('3.40')).toBeInTheDocument();
        // finalPrice and estimatedDurationMinutes were not provided
        expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    });

    it('renders cancellation reason when present', () => {
        render(<OrderInfo order={makeOrder({ status: 'CANCELED', cancellationReason: 'driver no-show' })} />);
        expect(screen.getByText('driver no-show')).toBeInTheDocument();
    });

    it('renders capacity fields when set', () => {
        render(<OrderInfo order={makeOrder({
            passengerCount: 6,
            luggageCount: 4,
            vehicleClass: 'XL',
            requiresAirConditioning: true,
        })} />);

        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('XL')).toBeInTheDocument();
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('renders "Not required" when requiresAirConditioning is explicitly false', () => {
        render(<OrderInfo order={makeOrder({ requiresAirConditioning: false })} />);
        expect(screen.getByText('Not required')).toBeInTheDocument();
    });

    it('renders an em-dash when optional numeric fields are undefined', () => {
        render(<OrderInfo order={makeOrder({
            estimatedPrice: undefined,
            finalPrice: undefined,
            distanceKm: undefined,
        })} />);
        // None of the renders above should throw, and all three should fall back to —
        expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(3);
    });

    it('does not render the status select when onChangeStatus is not provided', () => {
        render(<OrderInfo order={makeOrder()} />);
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('calls onChangeStatus when a new status is selected', () => {
        const onChangeStatus = vi.fn();
        render(<OrderInfo order={makeOrder()} onChangeStatus={onChangeStatus} />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ACCEPTED' } });

        expect(onChangeStatus).toHaveBeenCalledWith('ACCEPTED');
    });

    it('shows an Assign button on CREATED orders when onOpenAssign is provided', () => {
        const onOpenAssign = vi.fn();
        render(<OrderInfo order={makeOrder()} onOpenAssign={onOpenAssign} />);

        const btn = screen.getByTestId('order-assign-btn');
        expect(btn).toHaveTextContent('Assign');
        fireEvent.click(btn);
        expect(onOpenAssign).toHaveBeenCalled();
    });

    it('shows a Reassign button on ACCEPTED orders that already have a driver', () => {
        render(
            <OrderInfo
                order={makeOrder({ status: 'ACCEPTED', driverId: 5 })}
                onOpenAssign={vi.fn()}
            />,
        );
        expect(screen.getByTestId('order-assign-btn')).toHaveTextContent('Reassign');
    });

    it('hides the Assign button on terminal statuses', () => {
        const { rerender } = render(
            <OrderInfo order={makeOrder({ status: 'COMPLETED' })} onOpenAssign={vi.fn()} />,
        );
        expect(screen.queryByTestId('order-assign-btn')).not.toBeInTheDocument();

        rerender(
            <OrderInfo order={makeOrder({ status: 'CANCELED' })} onOpenAssign={vi.fn()} />,
        );
        expect(screen.queryByTestId('order-assign-btn')).not.toBeInTheDocument();
    });

    it('does not show the Assign button when onOpenAssign is omitted', () => {
        render(<OrderInfo order={makeOrder()} />);
        expect(screen.queryByTestId('order-assign-btn')).not.toBeInTheDocument();
    });

    it('shows weightKg for logistics orders', () => {
        render(<OrderInfo order={makeOrder({ vehicleType: 'LOGISTICS', weightKg: 75.5 })} />);
        expect(screen.getByText('Weight (kg)')).toBeInTheDocument();
        expect(screen.getByText('75.50')).toBeInTheDocument();
    });

    it('hides the weight field when weightKg is not set', () => {
        render(<OrderInfo order={makeOrder()} />);
        expect(screen.queryByText('Weight (kg)')).not.toBeInTheDocument();
    });
});

describe('statusBadgeClass', () => {
    it('returns a distinct class per status', () => {
        const classes = new Set([
            statusBadgeClass('CREATED'),
            statusBadgeClass('ACCEPTED'),
            statusBadgeClass('IN_PROGRESS'),
            statusBadgeClass('COMPLETED'),
            statusBadgeClass('CANCELED'),
        ]);
        expect(classes.size).toBe(5);
    });
});
