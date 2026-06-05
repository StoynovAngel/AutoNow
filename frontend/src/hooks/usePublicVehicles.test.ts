import { renderHook, waitFor, act } from '@testing-library/react-native';
import { usePublicVehicles } from './usePublicVehicles';
import { getPublicVehiclesByCompany } from '../services/vehicleService';
import { VehicleType } from '../types/vehicle';

jest.mock('../services/vehicleService');

const mockedFetch = getPublicVehiclesByCompany as jest.Mock;

describe('usePublicVehicles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches vehicles for the given company and type on mount', async () => {
        const data = [
            {
                id: 1,
                brand: 'Mercedes',
                model: 'E-Class',
                licensePlate: 'CB1234AA',
                vehicleType: VehicleType.PROM,
                driverPhoneNumber: '+359888111222',
            },
        ];
        mockedFetch.mockResolvedValue(data);

        const { result } = renderHook(() => usePublicVehicles(10, VehicleType.PROM));

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockedFetch).toHaveBeenCalledWith(10, VehicleType.PROM);
        expect(result.current.vehicles).toEqual(data);
        expect(result.current.error).toBe('');
    });

    it('sets the parsed error message when the request fails', async () => {
        mockedFetch.mockRejectedValue({ message: 'boom' });

        const { result } = renderHook(() => usePublicVehicles(10, VehicleType.PROM));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('boom');
        expect(result.current.vehicles).toEqual([]);
    });

    it('reload refetches and clears the previous error', async () => {
        mockedFetch
            .mockRejectedValueOnce({ message: 'boom' })
            .mockResolvedValueOnce([
                {
                    id: 1,
                    brand: 'BMW',
                    model: '7',
                    licensePlate: 'CB7777OK',
                    vehicleType: VehicleType.PROM,
                },
            ]);

        const { result } = renderHook(() => usePublicVehicles(10, VehicleType.PROM));
        await waitFor(() => expect(result.current.error).toBe('boom'));

        await act(async () => {
            await result.current.reload();
        });

        expect(result.current.error).toBe('');
        expect(result.current.vehicles).toHaveLength(1);
    });
});
