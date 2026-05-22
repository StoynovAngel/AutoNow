import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVehicles } from '../hooks/useVehicles';
import { vehicleService } from '../services/company/vehicleService';
import type { Vehicle } from '../components/company/VehicleInfo';

vi.mock('../services/company/vehicleService');

const mockVehicles: Vehicle[] = [
    { id: 1, brand: 'Toyota', model: 'Camry', licensePlate: 'CB1234AB', airConditioning: true, numberOfSeats: 5, trunkCapacity: 400, vehicleType: 'TAXI', companyId: 1 },
    { id: 2, brand: 'Honda', model: 'Civic', licensePlate: 'CB2345CD', airConditioning: false, numberOfSeats: 4, trunkCapacity: 300, vehicleType: 'SEMI', companyId: 1 },
];

describe('useVehicles', () => {
    beforeEach(() => {
        vi.mocked(vehicleService.getAllVehicles).mockResolvedValue(mockVehicles);
        vi.mocked(vehicleService.getVehicleById).mockResolvedValue(mockVehicles[0]);
        vi.mocked(vehicleService.createVehicle).mockResolvedValue({ ...mockVehicles[0], id: 3 });
        vi.mocked(vehicleService.updateVehicle).mockResolvedValue({ ...mockVehicles[0], brand: 'Updated' });
        vi.mocked(vehicleService.deleteVehicle).mockResolvedValue(undefined);
    });

    it('fetches all vehicles on mount', async () => {
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        expect(result.current.vehicles).toEqual(mockVehicles);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('fetches vehicles by company when companyId is provided', async () => {
        vi.mocked(vehicleService.getVehiclesByCompany).mockResolvedValue([mockVehicles[0]]);
        const { result } = renderHook(() => useVehicles(1));
        await act(async () => {});
        expect(vehicleService.getVehiclesByCompany).toHaveBeenCalledWith('1');
        expect(result.current.vehicles).toHaveLength(1);
    });

    it('sets error on fetch failure', async () => {
        vi.mocked(vehicleService.getAllVehicles).mockRejectedValue(new Error('Network error'));
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        expect(result.current.error).toBe('Failed to load vehicles');
        expect(result.current.vehicles).toEqual([]);
    });

    it('addVehicle calls service and refreshes list', async () => {
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        await act(async () => {
            await result.current.addVehicle({
                brand: 'New', model: 'Car', licensePlate: 'B7777KM', airConditioning: false,
                numberOfSeats: 4, vehicleType: 'TAXI',
            });
        });
        expect(vehicleService.createVehicle).toHaveBeenCalledOnce();
        expect(vehicleService.getAllVehicles).toHaveBeenCalled();
    });

    it('updateVehicle calls service with correct id and refreshes list', async () => {
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        await act(async () => {
            await result.current.updateVehicle(1, {
                brand: 'Updated', model: 'Camry', licensePlate: 'CB8888TX', airConditioning: true,
                numberOfSeats: 5, vehicleType: 'TAXI',
            });
        });
        expect(vehicleService.updateVehicle).toHaveBeenCalledWith('1', expect.any(Object));
        expect(vehicleService.getAllVehicles).toHaveBeenCalled();
    });

    it('removeVehicle calls service and refreshes list', async () => {
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        await act(async () => {
            await result.current.removeVehicle(1);
        });
        expect(vehicleService.deleteVehicle).toHaveBeenCalledWith('1');
        expect(vehicleService.getAllVehicles).toHaveBeenCalled();
    });

    it('removeVehicle clears selection when deleted vehicle was selected', async () => {
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        await act(async () => {
            await result.current.selectVehicle(1);
        });
        expect(result.current.selectedVehicleId).toBe(1);
        await act(async () => {
            await result.current.removeVehicle(1);
        });
        expect(result.current.selectedVehicleId).toBeNull();
        expect(result.current.selectedVehicle).toBeNull();
    });

    it('selectVehicle fetches vehicle details', async () => {
        const { result } = renderHook(() => useVehicles());
        await act(async () => {});
        await act(async () => {
            await result.current.selectVehicle(1);
        });
        expect(vehicleService.getVehicleById).toHaveBeenCalledWith('1');
        expect(result.current.selectedVehicleId).toBe(1);
        expect(result.current.selectedVehicle).toEqual(mockVehicles[0]);
    });
});
