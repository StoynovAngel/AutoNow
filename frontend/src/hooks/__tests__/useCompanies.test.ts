import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useCompanies } from './useCompanies';
import { getCompaniesByType } from '../services/companyService';
import { VehicleType } from '../types/vehicle';

jest.mock('../services/companyService');

const mockedFetch = getCompaniesByType as jest.Mock;

describe('useCompanies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches companies for the given vehicle type on mount', async () => {
        const data = [{ id: 1, name: 'Acme', companyType: VehicleType.TAXI }];
        mockedFetch.mockResolvedValue(data);

        const { result } = renderHook(() => useCompanies(VehicleType.TAXI));

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockedFetch).toHaveBeenCalledWith(VehicleType.TAXI);
        expect(result.current.companies).toEqual(data);
        expect(result.current.error).toBe('');
    });

    it('refetches when the vehicle type changes', async () => {
        mockedFetch
            .mockResolvedValueOnce([{ id: 1, name: 'Taxi co', companyType: VehicleType.TAXI }])
            .mockResolvedValueOnce([{ id: 2, name: 'Ambulance co', companyType: VehicleType.AMBULANCE }]);

        const { result, rerender } = renderHook(({ type }: { type: VehicleType }) => useCompanies(type), {
            initialProps: { type: VehicleType.TAXI },
        });

        await waitFor(() => expect(result.current.companies).toHaveLength(1));
        expect(result.current.companies[0].id).toBe(1);

        rerender({ type: VehicleType.AMBULANCE });

        await waitFor(() => expect(result.current.companies[0].id).toBe(2));
        expect(mockedFetch).toHaveBeenLastCalledWith(VehicleType.AMBULANCE);
    });

    it('sets the parsed error message when the request fails', async () => {
        mockedFetch.mockRejectedValue({ response: { data: { detail: 'No service in your area' } } });

        const { result } = renderHook(() => useCompanies(VehicleType.TAXI));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('No service in your area');
        expect(result.current.companies).toEqual([]);
    });

    it('reload refetches and clears the previous error', async () => {
        mockedFetch
            .mockRejectedValueOnce({ message: 'boom' })
            .mockResolvedValueOnce([{ id: 1, name: 'Acme', companyType: VehicleType.TAXI }]);

        const { result } = renderHook(() => useCompanies(VehicleType.TAXI));
        await waitFor(() => expect(result.current.error).toBe('boom'));

        await act(async () => {
            await result.current.reload();
        });

        expect(result.current.error).toBe('');
        expect(result.current.companies).toHaveLength(1);
    });
});
