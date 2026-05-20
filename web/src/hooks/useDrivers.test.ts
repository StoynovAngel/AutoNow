import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDrivers } from './useDrivers';
import { driverService } from '../services/company/driverService';
import { vehicleService } from '../services/company/vehicleService';
import type { Driver } from '../components/company/DriverInfo';
import type { Vehicle } from '../components/company/VehicleInfo';

vi.mock('../services/company/driverService');
vi.mock('../services/company/vehicleService');

const driver = (id: number, overrides: Partial<Driver> = {}): Driver => ({
    id,
    firstName: 'Driver',
    lastName: String(id),
    phoneNumber: '555-0000',
    licenseNumber: `LIC-${id}`,
    expertiseType: 'TAXI',
    available: true,
    companyId: 1,
    vehicleIds: [],
    ...overrides,
});

const vehicle = (id: number): Vehicle => ({
    id,
    licensePlate: `PL-${id}`,
} as Vehicle);

describe('useDrivers', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns empty drivers and does not fetch when no companyId is provided', async () => {
        const { result } = renderHook(() => useDrivers(null));

        expect(result.current.drivers).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(driverService.getDriversByCompany).not.toHaveBeenCalled();
        expect(driverService.getAllDrivers).not.toHaveBeenCalled();
    });

    it('fetches drivers when a companyId is provided', async () => {
        const drivers = [driver(1), driver(2)];
        vi.mocked(driverService.getDriversByCompany).mockResolvedValue(drivers);

        const { result } = renderHook(() => useDrivers(10));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(driverService.getDriversByCompany).toHaveBeenCalledWith('10');
        expect(result.current.drivers).toEqual(drivers);
        expect(result.current.error).toBeNull();
    });

    it('refetches when companyId changes', async () => {
        vi.mocked(driverService.getDriversByCompany)
            .mockResolvedValueOnce([driver(1)])
            .mockResolvedValueOnce([driver(2)]);

        const { result, rerender } = renderHook(({ id }: { id: number | null }) => useDrivers(id), {
            initialProps: { id: 10 as number | null },
        });

        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        rerender({ id: 20 });

        await waitFor(() => {
            expect(driverService.getDriversByCompany).toHaveBeenCalledWith('20');
            expect(result.current.drivers).toEqual([driver(2)]);
        });
    });

    it('hides stale state when companyId becomes null', async () => {
        vi.mocked(driverService.getDriversByCompany).mockResolvedValue([driver(1)]);

        const { result, rerender } = renderHook(({ id }: { id: number | null }) => useDrivers(id), {
            initialProps: { id: 10 as number | null },
        });

        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        rerender({ id: null });

        expect(result.current.drivers).toEqual([]);
        expect(result.current.selectedDriverId).toBeNull();
        expect(result.current.selectedDriver).toBeNull();
        expect(result.current.driverVehicles).toEqual([]);
    });

    it('selectDriver loads driver details and vehicles', async () => {
        vi.mocked(driverService.getDriversByCompany).mockResolvedValue([driver(1, { vehicleIds: [100] })]);
        vi.mocked(driverService.getDriverById).mockResolvedValue(driver(1, { vehicleIds: [100] }));
        vi.mocked(vehicleService.getVehiclesByIds).mockResolvedValue([vehicle(100)]);

        const { result } = renderHook(() => useDrivers(10));
        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        await act(async () => {
            await result.current.selectDriver(1);
        });

        expect(driverService.getDriverById).toHaveBeenCalledWith('1');
        expect(vehicleService.getVehiclesByIds).toHaveBeenCalledWith(['100']);
        expect(result.current.selectedDriverId).toBe(1);
        expect(result.current.selectedDriver?.id).toBe(1);
        expect(result.current.driverVehicles).toEqual([vehicle(100)]);
    });

    it('selectDriver with no vehicleIds skips the vehicle service', async () => {
        vi.mocked(driverService.getDriversByCompany).mockResolvedValue([driver(1)]);
        vi.mocked(driverService.getDriverById).mockResolvedValue(driver(1, { vehicleIds: [] }));

        const { result } = renderHook(() => useDrivers(10));
        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        await act(async () => {
            await result.current.selectDriver(1);
        });

        expect(vehicleService.getVehiclesByIds).not.toHaveBeenCalled();
        expect(result.current.driverVehicles).toEqual([]);
    });

    it('clears selection if the selected driver is not in the new list after refetch', async () => {
        vi.mocked(driverService.getDriversByCompany)
            .mockResolvedValueOnce([driver(1)])
            .mockResolvedValueOnce([driver(2)]);
        vi.mocked(driverService.getDriverById).mockResolvedValue(driver(1));

        const { result, rerender } = renderHook(({ id }: { id: number | null }) => useDrivers(id), {
            initialProps: { id: 10 as number | null },
        });

        await waitFor(() => expect(result.current.drivers).toHaveLength(1));

        await act(async () => {
            await result.current.selectDriver(1);
        });
        expect(result.current.selectedDriverId).toBe(1);

        rerender({ id: 20 });

        await waitFor(() => {
            expect(result.current.drivers).toEqual([driver(2)]);
            expect(result.current.selectedDriverId).toBeNull();
            expect(result.current.selectedDriver).toBeNull();
            expect(result.current.driverVehicles).toEqual([]);
        });
    });

    it('sets an error message when the fetch fails', async () => {
        vi.mocked(driverService.getDriversByCompany).mockRejectedValue(new Error('boom'));

        const { result } = renderHook(() => useDrivers(10));

        await waitFor(() => {
            expect(result.current.error).toBe('Failed to load drivers');
            expect(result.current.loading).toBe(false);
        });
    });
});
