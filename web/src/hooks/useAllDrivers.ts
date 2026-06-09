import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../services/driver/driverService';
import type { DriverPayload } from '../services/driver/driverService';
import type { Driver } from '../components/company/DriverInfo';

export const useAllDrivers = (companyTypeFilter: string | null = null) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = companyTypeFilter
                ? await driverService.getDriversByCompanyType(companyTypeFilter)
                : await driverService.getAllDrivers();
            setDrivers(data);
        } catch {
            setError('Failed to load drivers.');
        } finally {
            setLoading(false);
        }
    }, [companyTypeFilter]);

    useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

    const addDriver = async (payload: DriverPayload) => {
        const created = await driverService.createDriver(payload);
        setDrivers(prev => [...prev, created]);
    };

    const updateDriver = async (id: number, payload: DriverPayload) => {
        const updated = await driverService.updateDriver(String(id), payload);
        setDrivers(prev => prev.map(d => d.id === id ? updated : d));
    };

    const removeDriver = async (id: number) => {
        await driverService.deleteDriver(String(id));
        setDrivers(prev => prev.filter(d => d.id !== id));
    };

    const assignVehicle = async (driverId: number, vehicleId: number) => {
        const updated = await driverService.assignVehicle(driverId, vehicleId);
        setDrivers(prev => prev.map(d => d.id === driverId ? updated : d));
    };

    const unassignVehicle = async (driverId: number, vehicleId: number) => {
        const updated = await driverService.unassignVehicle(driverId, vehicleId);
        setDrivers(prev => prev.map(d => d.id === driverId ? updated : d));
    };

    return { drivers, loading, error, addDriver, updateDriver, removeDriver, assignVehicle, unassignVehicle, refreshDrivers: fetchDrivers };
};
