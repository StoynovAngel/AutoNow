import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssignOrderModal from '../AssignOrderModal';
import type { Order } from '../OrderInfo';
import type { Driver } from '../../company/DriverInfo';

const baseOrder: Order = {
    id: 42,
    userId: 1,
    vehicleType: 'TAXI',
    pickupAddress: 'A',
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffAddress: 'B',
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    status: 'CREATED',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
};

const driver = (overrides: Partial<Driver> = {}): Driver => ({
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    phoneNumber: '+359888123456',
    expertiseType: ['TAXI'],
    available: true,
    companyId: 1,
    preferredVehicleId: 10,
    ...overrides,
});

describe('AssignOrderModal', () => {
    it('renders only available drivers that have a preferred vehicle', () => {
        const drivers = [
            driver({ id: 1, firstName: 'HasVehicle', available: true, preferredVehicleId: 10 }),
            driver({ id: 2, firstName: 'NoVehicle', available: true, preferredVehicleId: null }),
            driver({ id: 3, firstName: 'Unavailable', available: false, preferredVehicleId: 10 }),
        ];

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={drivers}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        const driverSelect = screen.getByLabelText(/Driver/) as HTMLSelectElement;
        const optionTexts = Array.from(driverSelect.options).map((o) => o.textContent ?? '');

        expect(optionTexts.some((t) => t.includes('HasVehicle'))).toBe(true);
        expect(optionTexts.some((t) => t.includes('NoVehicle'))).toBe(false);
        expect(optionTexts.some((t) => t.includes('Unavailable'))).toBe(false);
    });

    it('keeps the submit button disabled until a driver is selected', () => {
        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={[driver({ id: 1, preferredVehicleId: 10 })]}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        const submit = screen.getByRole('button', { name: /^Assign$/ });
        expect(submit).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Driver/), { target: { value: '1' } });
        expect(submit).not.toBeDisabled();
    });

    it('calls onAssign with driverId and preferredVehicleId, then closes', async () => {
        const onAssign = vi.fn().mockResolvedValue(undefined);
        const onClose = vi.fn();

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={[driver({ id: 1, preferredVehicleId: 10 })]}
                onAssign={onAssign}
                onClose={onClose}
            />,
        );

        fireEvent.change(screen.getByLabelText(/Driver/), { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /^Assign$/ }));

        await waitFor(() => expect(onAssign).toHaveBeenCalledWith(1, 10));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });

    it('shows an error alert and stays open when onAssign rejects', async () => {
        const onAssign = vi.fn().mockRejectedValue(new Error('boom'));
        const onClose = vi.fn();

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={[driver({ id: 1, preferredVehicleId: 10 })]}
                onAssign={onAssign}
                onClose={onClose}
            />,
        );

        fireEvent.change(screen.getByLabelText(/Driver/), { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /^Assign$/ }));

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/Assignment failed/),
        );
        expect(onClose).not.toHaveBeenCalled();
    });

    it('shows Reassign label and prefills driver when order already has one', () => {
        render(
            <AssignOrderModal
                order={{ ...baseOrder, status: 'ACCEPTED', driverId: 1, vehicleId: 10 }}
                drivers={[driver({ id: 1, preferredVehicleId: 10 })]}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText('Reassign Order — #42')).toBeInTheDocument();
        expect((screen.getByLabelText(/Driver/) as HTMLSelectElement).value).toBe('1');
        expect(screen.getByRole('button', { name: /^Reassign$/ })).not.toBeDisabled();
    });

    it('shows empty state message when no eligible drivers', () => {
        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={[driver({ id: 1, available: false, preferredVehicleId: 10 })]}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        const driverSelect = screen.getByLabelText(/Driver/) as HTMLSelectElement;
        expect(driverSelect).toBeDisabled();
        expect(Array.from(driverSelect.options)[0].textContent).toMatch(/No available drivers/);
    });
});
