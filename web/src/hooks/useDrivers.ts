import {useState, useEffect, useCallback} from 'react';
import {driverService} from '../services/driver/driverService';
import {vehicleService} from '../services/vehicle/vehicleService';
import type {Driver} from '../components/company/DriverInfo';
import type {Vehicle} from '../components/company/VehicleInfo';

export const useDrivers = (companyId?: number | null) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [driverVehicles, setDriverVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivers = useCallback(async () => {
        if (!companyId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await driverService.getDriversByCompany(String(companyId));
            setDrivers(data);
            setSelectedDriverId((prevId) => {
                if (prevId && !data.find((d: Driver) => d.id === prevId)) {
                    setSelectedDriver(null);
                    setDriverVehicles([]);
                    return null;
                }
                return prevId;
            });
        } catch (err: any) {
            console.error('Failed to fetch drivers', err);
            console.error('Error response:', err.response?.data);
            setError('Failed to load drivers');
        } finally {
            setLoading(false);
        }
    }, [companyId]);

    useEffect(() => {
        if (!companyId) return;
        fetchDrivers();
    }, [companyId, fetchDrivers]);

    const selectDriver = async (driverId: number) => {
        setSelectedDriverId(driverId);
        if (driverId) {
            try {
                const data = await driverService.getDriverById(String(driverId));
                setSelectedDriver(data);

                if (data.vehicleIds && data.vehicleIds.length > 0) {
                    const vehicleData = await vehicleService.getVehiclesByIds(
                        Array.from(data.vehicleIds).map(String)
                    );
                    setDriverVehicles(vehicleData);
                } else {
                    setDriverVehicles([]);
                }
            } catch (err: any) {
                console.error('Failed to fetch driver details', err);
                console.error('Error response:', err.response?.data);
                setDriverVehicles([]);
            }
        } else {
            setSelectedDriver(null);
            setDriverVehicles([]);
        }
    };

    const hasCompany = !!companyId;

    return {
        drivers: hasCompany ? drivers : [],
        selectedDriverId: hasCompany ? selectedDriverId : null,
        selectedDriver: hasCompany ? selectedDriver : null,
        driverVehicles: hasCompany ? driverVehicles : [],
        loading: hasCompany ? loading : false,
        error: hasCompany ? error : null,
        selectDriver,
        refreshDrivers: fetchDrivers
    };
};
