import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssignOrderModal from '../AssignOrderModal';
import type { Order } from '../OrderInfo';
import type { Driver } from '../../company/DriverInfo';
import type { Vehicle } from '../../company/VehicleInfo';

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
    vehicleIds: [10],
    ...overrides,
});

const vehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
    id: 10,
    brand: 'Toyota',
    model: 'Corolla',
    licensePlate: 'CA1234AB',
    airConditioning: true,
    numberOfSeats: 4,
    trunkCapacity: 400,
    vehicleType: 'TAXI',
    companyId: 1,
    ...overrides,
});

describe('AssignOrderModal', () => {
    it('renders only available drivers who have at least one vehicle matching the order vehicleType', () => {
        const drivers = [
            driver({ id: 1, firstName: 'TaxiAvail', vehicleIds: [10], available: true }),
            driver({ id: 2, firstName: 'TaxiOff', vehicleIds: [10], available: false }),
            driver({ id: 3, firstName: 'AmbOnly', vehicleIds: [11], available: true }),
            driver({ id: 4, firstName: 'NoVehicles', vehicleIds: [], available: true }),
        ];
        const vehicles = [
            vehicle({ id: 10, vehicleType: 'TAXI' }),
            vehicle({ id: 11, vehicleType: 'AMBULANCE' }),
        ];

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={drivers}
                vehicles={vehicles}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        const driverSelect = screen.getByLabelText(/Driver/) as HTMLSelectElement;
        const optionTexts = Array.from(driverSelect.options).map((o) => o.textContent ?? '');

        expect(optionTexts.some((t) => t.includes('TaxiAvail'))).toBe(true);
        expect(optionTexts.some((t) => t.includes('TaxiOff'))).toBe(false);
        expect(optionTexts.some((t) => t.includes('AmbOnly'))).toBe(false);
        expect(optionTexts.some((t) => t.includes('NoVehicles'))).toBe(false);
    });

    it('lists only vehicles belonging to the selected driver and matching the order vehicleType', () => {
        const drivers = [driver({ id: 1, vehicleIds: [10, 11] })];
        const vehicles = [
            vehicle({ id: 10, vehicleType: 'TAXI', licensePlate: 'CA1111AB' }),
            vehicle({ id: 11, vehicleType: 'AMBULANCE', licensePlate: 'CA2222AB' }),
            vehicle({ id: 12, vehicleType: 'TAXI', licensePlate: 'CA3333AB' }),
        ];

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={drivers}
                vehicles={vehicles}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        const driverSelect = screen.getByLabelText(/Driver/) as HTMLSelectElement;
        fireEvent.change(driverSelect, { target: { value: '1' } });

        const vehicleSelect = screen.getByLabelText(/Vehicle/) as HTMLSelectElement;
        const texts = Array.from(vehicleSelect.options).map((o) => o.textContent ?? '');

        expect(texts.some((t) => t.includes('CA1111AB'))).toBe(true);
        expect(texts.some((t) => t.includes('CA2222AB'))).toBe(false);
        expect(texts.some((t) => t.includes('CA3333AB'))).toBe(false);
    });

    it('keeps the submit button disabled until a driver and vehicle are picked', () => {
        const drivers = [driver({ id: 1, vehicleIds: [10] })];
        const vehicles = [vehicle({ id: 10 })];

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={drivers}
                vehicles={vehicles}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        const submit = screen.getByRole('button', { name: /^Assign$/ });
        expect(submit).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Driver/), { target: { value: '1' } });
        expect(submit).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Vehicle/), { target: { value: '10' } });
        expect(submit).not.toBeDisabled();
    });

    it('calls onAssign with the chosen driverId and vehicleId, then closes', async () => {
        const drivers = [driver({ id: 1, vehicleIds: [10] })];
        const vehicles = [vehicle({ id: 10 })];
        const onAssign = vi.fn().mockResolvedValue(undefined);
        const onClose = vi.fn();

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={drivers}
                vehicles={vehicles}
                onAssign={onAssign}
                onClose={onClose}
            />,
        );

        fireEvent.change(screen.getByLabelText(/Driver/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Vehicle/), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: /^Assign$/ }));

        await waitFor(() => expect(onAssign).toHaveBeenCalledWith(1, 10));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });

    it('shows an error alert and stays open when onAssign rejects', async () => {
        const drivers = [driver({ id: 1, vehicleIds: [10] })];
        const vehicles = [vehicle({ id: 10 })];
        const onAssign = vi.fn().mockRejectedValue(new Error('boom'));
        const onClose = vi.fn();

        render(
            <AssignOrderModal
                order={baseOrder}
                drivers={drivers}
                vehicles={vehicles}
                onAssign={onAssign}
                onClose={onClose}
            />,
        );

        fireEvent.change(screen.getByLabelText(/Driver/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Vehicle/), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: /^Assign$/ }));

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/Assignment failed/),
        );
        expect(onClose).not.toHaveBeenCalled();
    });

    it('shows the Reassign label and prefills driver/vehicle when the order already has them', () => {
        const drivers = [driver({ id: 1, vehicleIds: [10] })];
        const vehicles = [vehicle({ id: 10 })];

        render(
            <AssignOrderModal
                order={{ ...baseOrder, status: 'ACCEPTED', driverId: 1, vehicleId: 10 }}
                drivers={drivers}
                vehicles={vehicles}
                onAssign={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText('Reassign Order — #42')).toBeInTheDocument();
        expect((screen.getByLabelText(/Driver/) as HTMLSelectElement).value).toBe('1');
        expect((screen.getByLabelText(/Vehicle/) as HTMLSelectElement).value).toBe('10');
        expect(screen.getByRole('button', { name: /^Reassign$/ })).not.toBeDisabled();
    });
});
