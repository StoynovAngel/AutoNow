import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddVehicleForm from './AddVehicleForm';
import type { VehiclePayload } from '../../services/company/vehicleService';

vi.mock('axios');

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText(/license plate/i), 'CB1234AB');
    await user.type(screen.getByLabelText(/brand/i), 'Toyota');
    await user.type(screen.getByLabelText(/model/i), 'Camry');
    await user.type(screen.getByLabelText(/number of seats/i), '5');
};

describe('AddVehicleForm', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    beforeEach(() => {
        onSubmit.mockReset();
        onCancel.mockReset();
        onSubmit.mockResolvedValue(undefined);
    });

    it('renders add mode title and button', () => {
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        expect(screen.getByRole('heading', { name: 'Add Vehicle' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add Vehicle' })).toBeInTheDocument();
    });

    it('renders edit mode title and button when initialData is provided', () => {
        const vehicle = {
            id: 1, brand: 'Toyota', model: 'Camry', licensePlate: 'CB1234AB', airConditioning: true,
            numberOfSeats: 5, trunkCapacity: 400, vehicleType: 'TAXI', companyId: 1,
        };
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} initialData={vehicle} />);
        expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });

    it('pre-fills fields from initialData', () => {
        const vehicle = {
            id: 1, brand: 'Ferrari', model: 'Enzo', licensePlate: 'PB5555MT', airConditioning: true,
            numberOfSeats: 2, trunkCapacity: 100, vehicleType: 'PROM', companyId: 3,
        };
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} initialData={vehicle} />);
        expect(screen.getByLabelText(/license plate/i)).toHaveValue('PB5555MT');
        expect(screen.getByLabelText(/brand/i)).toHaveValue('Ferrari');
        expect(screen.getByLabelText(/model/i)).toHaveValue('Enzo');
        expect(screen.getByLabelText(/number of seats/i)).toHaveValue(2);
        expect(screen.getByLabelText(/vehicle type/i)).toHaveValue('PROM');
        expect(screen.getByLabelText(/air conditioning/i)).toBeChecked();
    });

    it('shows validation error when license plate is missing', async () => {
        const user = userEvent.setup();
        const { container } = render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await user.type(screen.getByLabelText(/brand/i), 'Toyota');
        await user.type(screen.getByLabelText(/model/i), 'Camry');
        await user.type(screen.getByLabelText(/number of seats/i), '5');
        fireEvent.submit(container.querySelector('form')!);
        expect(await screen.findByRole('alert')).toHaveTextContent('License plate is required');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error when brand is missing', async () => {
        const user = userEvent.setup();
        const { container } = render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await user.type(screen.getByLabelText(/license plate/i), 'CB1234AB');
        await user.type(screen.getByLabelText(/model/i), 'Camry');
        fireEvent.submit(container.querySelector('form')!);
        expect(await screen.findByRole('alert')).toHaveTextContent('Brand and model are required');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for non-positive seats', async () => {
        const user = userEvent.setup();
        const { container } = render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await user.type(screen.getByLabelText(/license plate/i), 'CB1234AB');
        await user.type(screen.getByLabelText(/brand/i), 'Toyota');
        await user.type(screen.getByLabelText(/model/i), 'Camry');
        await user.type(screen.getByLabelText(/number of seats/i), '0');
        fireEvent.submit(container.querySelector('form')!);
        expect(await screen.findByRole('alert')).toHaveTextContent('positive integer');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for invalid trunk capacity', async () => {
        const user = userEvent.setup();
        const { container } = render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await fillRequiredFields(user);
        await user.type(screen.getByLabelText(/trunk capacity/i), '-5');
        fireEvent.submit(container.querySelector('form')!);
        expect(await screen.findByRole('alert')).toHaveTextContent('positive number');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits correct payload with all fields', async () => {
        const user = userEvent.setup();
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await fillRequiredFields(user);
        await user.type(screen.getByLabelText(/trunk capacity/i), '400');
        await user.type(screen.getByLabelText(/company id/i), '2');
        await user.click(screen.getByLabelText(/air conditioning/i));
        await user.click(screen.getByRole('button', { name: 'Add Vehicle' }));

        await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
        const payload: VehiclePayload = onSubmit.mock.calls[0][0];
        expect(payload.brand).toBe('Toyota');
        expect(payload.model).toBe('Camry');
        expect(payload.licensePlate).toBe('CB1234AB');
        expect(payload.numberOfSeats).toBe(5);
        expect(payload.trunkCapacity).toBe(400);
        expect(payload.companyId).toBe(2);
        expect(payload.airConditioning).toBe(true);
        expect(payload.vehicleType).toBe('TAXI');
    });

    it('submits without trunk capacity when left empty', async () => {
        const user = userEvent.setup();
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await fillRequiredFields(user);
        await user.click(screen.getByRole('button', { name: 'Add Vehicle' }));

        await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
        expect(onSubmit.mock.calls[0][0].trunkCapacity).toBeUndefined();
    });

    it('calls onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onCancel).toHaveBeenCalledOnce();
    });

    it('shows all vehicle type options', () => {
        render(<AddVehicleForm onSubmit={onSubmit} onCancel={onCancel} />);
        const select = screen.getByLabelText(/vehicle type/i);
        const options = Array.from((select as HTMLSelectElement).options).map(o => o.value);
        expect(options).toEqual(['TAXI', 'SEMI', 'AMBULANCE', 'RENTAL', 'PROM', 'FUNERAL']);
    });
});
