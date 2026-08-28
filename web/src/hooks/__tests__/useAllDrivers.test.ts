import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAllDrivers } from '../useAllDrivers';
import { driverService } from '../../services/driver/driverService';
import type { Driver } from '../../components/company/DriverInfo';

vi.mock('../../services/driver/driverService');

const driver = (id: number): Driver => ({
    id,
    firstName: 'Driver',
    lastName: String(id),
    phoneNumber: '+359881000001',
    expertiseType: ['B'],
    available: true,
    companyId: 1,
});

describe('useAllDrivers', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('fetches all drivers when no companyTypeFilter is provided', async () => {
        vi.mocked(driverService.getAllDrivers).mockResolvedValue([driver(1), driver(2)]);

        const { result } = renderHook(() => useAllDrivers());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(driverService.getAllDrivers).toHaveBeenCalled();
        expect(driverService.getDriversByCompanyType).not.toHaveBeenCalled();
        expect(result.current.drivers).toHaveLength(2);
        expect(result.current.error).toBeNull();
    });

    it('fetches by company type when companyTypeFilter is provided', async () => {
        vi.mocked(driverService.getDriversByCompanyType).mockResolvedValue([driver(1)]);

        const { result } = renderHook(() => useAllDrivers('TAXI'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(driverService.getDriversByCompanyType).toHaveBeenCalledWith('TAXI');
        expect(driverService.getAllDrivers).not.toHaveBeenCalled();
        expect(result.current.drivers).toHaveLength(1);
    });

    it('refetches when companyTypeFilter changes', async () => {
        vi.mocked(driverService.getDriversByCompanyType)
            .mockResolvedValueOnce([driver(1)])
            .mockResolvedValueOnce([driver(2), driver(3)]);

        const { result, rerender } = renderHook(
            ({ type }: { type: string | null }) => useAllDrivers(type),
            { initialProps: { type: 'TAXI' as string | null } }
        );

        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        rerender({ type: 'LOGISTICS' });

        await waitFor(() => {
            expect(driverService.getDriversByCompanyType).toHaveBeenCalledWith('LOGISTICS');
            expect(result.current.drivers).toHaveLength(2);
        });
    });

    it('switches back to getAllDrivers when companyTypeFilter becomes null', async () => {
        vi.mocked(driverService.getDriversByCompanyType).mockResolvedValue([driver(1)]);
        vi.mocked(driverService.getAllDrivers).mockResolvedValue([driver(1), driver(2), driver(3)]);

        const { result, rerender } = renderHook(
            ({ type }: { type: string | null }) => useAllDrivers(type),
            { initialProps: { type: 'TAXI' as string | null } }
        );

        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        rerender({ type: null });

        await waitFor(() => {
            expect(driverService.getAllDrivers).toHaveBeenCalled();
            expect(result.current.drivers).toHaveLength(3);
        });
    });

    it('sets error when fetch fails', async () => {
        vi.mocked(driverService.getAllDrivers).mockRejectedValue(new Error('network error'));

        const { result } = renderHook(() => useAllDrivers());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Failed to load drivers.');
        expect(result.current.drivers).toEqual([]);
    });

    it('sets error when company-type fetch fails', async () => {
        vi.mocked(driverService.getDriversByCompanyType).mockRejectedValue(new Error('network error'));

        const { result } = renderHook(() => useAllDrivers('AMBULANCE'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Failed to load drivers.');
    });

    it('setPreferredVehicle updates driver in state', async () => {
        const initial = driver(1);
        vi.mocked(driverService.getAllDrivers).mockResolvedValue([initial]);
        const updated = { ...initial, preferredVehicleId: 5 };
        vi.mocked(driverService.setPreferredVehicle).mockResolvedValue(updated);

        const { result } = renderHook(() => useAllDrivers());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.setPreferredVehicle(1, 5);
        });

        expect(driverService.setPreferredVehicle).toHaveBeenCalledWith(1, 5);
        expect(result.current.drivers[0].preferredVehicleId).toBe(5);
    });

    it('clearPreferredVehicle updates driver in state', async () => {
        const initial = { ...driver(1), preferredVehicleId: 5 };
        vi.mocked(driverService.getAllDrivers).mockResolvedValue([initial]);
        const cleared = { ...initial, preferredVehicleId: null };
        vi.mocked(driverService.clearPreferredVehicle).mockResolvedValue(cleared);

        const { result } = renderHook(() => useAllDrivers());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.clearPreferredVehicle(1);
        });

        expect(driverService.clearPreferredVehicle).toHaveBeenCalledWith(1);
        expect(result.current.drivers[0].preferredVehicleId).toBeNull();
    });
});
