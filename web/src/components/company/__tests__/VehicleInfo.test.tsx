import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleInfo from '../VehicleInfo';
import type { Vehicle } from '../VehicleInfo';

const makeVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    licensePlate: 'CB1234AB',
    airConditioning: true,
    numberOfSeats: 5,
    trunkCapacity: 400,
    vehicleType: 'TAXI',
    companyId: 1,
    ...overrides,
});

describe('VehicleInfo', () => {
    it('shows empty state when no vehicles', () => {
        render(<VehicleInfo vehicles={[]} />);
        expect(screen.getByText('No vehicles assigned')).toBeInTheDocument();
    });

    it('renders a vehicle card with correct data', () => {
        render(<VehicleInfo vehicles={[makeVehicle()]} />);
        expect(screen.getByText('Toyota - Camry')).toBeInTheDocument();
        expect(screen.getByText('CB1234AB')).toBeInTheDocument();
        expect(screen.getByText('TAXI')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('400L')).toBeInTheDocument();
    });

    it('shows — for missing trunk capacity', () => {
        render(<VehicleInfo vehicles={[makeVehicle({ trunkCapacity: 0 })]} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('shows YES for air conditioning', () => {
        render(<VehicleInfo vehicles={[makeVehicle({ airConditioning: true })]} />);
        expect(screen.getByText('YES')).toBeInTheDocument();
    });

    it('shows NO for no air conditioning', () => {
        render(<VehicleInfo vehicles={[makeVehicle({ airConditioning: false })]} />);
        expect(screen.getByText('NO')).toBeInTheDocument();
    });

    it('renders vehicle image when imageUrl is set', () => {
        render(<VehicleInfo vehicles={[makeVehicle({ imageUrl: 'https://example.com/car.jpg' })]} />);
        expect(screen.getByAltText('Toyota Camry')).toHaveAttribute('src', 'https://example.com/car.jpg');
    });

    it('does not render image element when imageUrl is absent', () => {
        render(<VehicleInfo vehicles={[makeVehicle({ imageUrl: undefined })]} />);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders edit and delete buttons when handlers provided', () => {
        render(<VehicleInfo vehicles={[makeVehicle()]} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('does not render edit/delete buttons without handlers', () => {
        render(<VehicleInfo vehicles={[makeVehicle()]} />);
        expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('calls onEdit with the correct vehicle', async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();
        const vehicle = makeVehicle();
        render(<VehicleInfo vehicles={[vehicle]} onEdit={onEdit} onDelete={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: /edit/i }));
        expect(onEdit).toHaveBeenCalledWith(vehicle);
    });

    it('calls onDelete with the correct id', async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();
        render(<VehicleInfo vehicles={[makeVehicle({ id: 42 })]} onEdit={vi.fn()} onDelete={onDelete} />);
        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(onDelete).toHaveBeenCalledWith(42);
    });

    it('renders multiple vehicles', () => {
        const vehicles = [
            makeVehicle({ id: 1, brand: 'Toyota' }),
            makeVehicle({ id: 2, brand: 'Honda' }),
            makeVehicle({ id: 3, brand: 'BMW' }),
        ];
        render(<VehicleInfo vehicles={vehicles} />);
        expect(screen.getByText('Toyota - Camry')).toBeInTheDocument();
        expect(screen.getByText('Honda - Camry')).toBeInTheDocument();
        expect(screen.getByText('BMW - Camry')).toBeInTheDocument();
    });

    it('renders class badges when present', () => {
        render(<VehicleInfo vehicles={[makeVehicle({
            vehicleClasses: ['XL', 'STANDARD'],
        })]} />);

        expect(screen.getByText('XL')).toBeInTheDocument();
        expect(screen.getByText('STANDARD')).toBeInTheDocument();
    });

    it('omits class badges when not provided', () => {
        render(<VehicleInfo vehicles={[makeVehicle()]} />);
        expect(screen.queryByText('STANDARD')).not.toBeInTheDocument();
        expect(screen.queryByText('XL')).not.toBeInTheDocument();
    });
});
