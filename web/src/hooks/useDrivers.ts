import {useState, useEffect, useCallback} from 'react';
import {driverService} from '../services/driver/driverService';
import {vehicleService} from '../services/vehicle/vehicleService';
import {ratingService} from '../services/rating/ratingService';
import type {Driver} from '../components/company/DriverInfo';
import type {Vehicle} from '../components/company/VehicleInfo';
import type {Rating} from '../services/rating/ratingService';
import {getErrorMessage} from '../utils/errors';

export const useDrivers = (companyId?: number | null) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [driverVehicles, setDriverVehicles] = useState<Vehicle[]>([]);
    const [driverRatings, setDriverRatings] = useState<Rating[]>([]);
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
                    setDriverRatings([]);
                    return null;
                }
                return prevId;
            });
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to load drivers'));
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

                try {
                    const ratings = await ratingService.getRatingsByDriverId(String(driverId));
                    setDriverRatings(ratings);
                } catch {
                    setDriverRatings([]);
                }
            } catch {
                setDriverVehicles([]);
                setDriverRatings([]);
            }
        } else {
            setSelectedDriver(null);
            setDriverVehicles([]);
            setDriverRatings([]);
        }
    };

    const hasCompany = !!companyId;

    return {
        drivers: hasCompany ? drivers : [],
        selectedDriverId: hasCompany ? selectedDriverId : null,
        selectedDriver: hasCompany ? selectedDriver : null,
        driverVehicles: hasCompany ? driverVehicles : [],
        driverRatings: hasCompany ? driverRatings : [],
        loading: hasCompany ? loading : false,
        error: hasCompany ? error : null,
        selectDriver,
        refreshDrivers: fetchDrivers
    };
};
