import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vehicleService, type VehiclePayload } from './vehicleService';
import apiClient from '../apiClient';

vi.mock('../apiClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const payload: VehiclePayload = {
    brand: 'Toyota',
    model: 'Corolla',
    airConditioning: true,
    numberOfSeats: 4,
    trunkCapacity: 300,
    vehicleType: 'SEDAN',
};

describe('vehicleService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('getAllVehicles GETs /vehicles', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

        await vehicleService.getAllVehicles();

        expect(apiClient.get).toHaveBeenCalledWith('/vehicles');
    });

    it('getVehicleById GETs /vehicles/{id}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 5 } });

        await vehicleService.getVehicleById('5');

        expect(apiClient.get).toHaveBeenCalledWith('/vehicles/5');
    });

    it('getVehiclesByIds requests each id in parallel and returns their data', async () => {
        vi.mocked(apiClient.get)
            .mockResolvedValueOnce({ data: { id: 1 } })
            .mockResolvedValueOnce({ data: { id: 2 } });

        const result = await vehicleService.getVehiclesByIds(['1', '2']);

        expect(apiClient.get).toHaveBeenNthCalledWith(1, '/vehicles/1');
        expect(apiClient.get).toHaveBeenNthCalledWith(2, '/vehicles/2');
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('getVehiclesByIds returns an empty array when given no ids', async () => {
        const result = await vehicleService.getVehiclesByIds([]);

        expect(apiClient.get).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('createVehicle POSTs to /vehicles with payload', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 1, ...payload } });

        await vehicleService.createVehicle(payload);

        expect(apiClient.post).toHaveBeenCalledWith('/vehicles', payload);
    });

    it('updateVehicle PUTs to /vehicles/{id} with payload', async () => {
        vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 5, ...payload } });

        await vehicleService.updateVehicle('5', payload);

        expect(apiClient.put).toHaveBeenCalledWith('/vehicles/5', payload);
    });

    it('deleteVehicle DELETEs /vehicles/{id}', async () => {
        vi.mocked(apiClient.delete).mockResolvedValue({});

        await vehicleService.deleteVehicle('5');

        expect(apiClient.delete).toHaveBeenCalledWith('/vehicles/5');
    });
});
