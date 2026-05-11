import {useState, useEffect} from 'react';
import {driverService} from '../services/company/driverService';
import {vehicleService} from '../services/company/vehicleService';

export const useDrivers = (companyId?: string | null) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverVehicles, setDriverVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDrivers();
    }, [companyId]);

    const fetchDrivers = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (companyId) {
                data = await driverService.getDriversByCompany(companyId);
            } else {
                data = await driverService.getAllDrivers();
            }
            console.log('Drivers fetched:', data);
            setDrivers(data);
            // Clear selected driver if it's not in the new list
            if (selectedDriverId && !data.find((d: any) => d.id === selectedDriverId)) {
                setSelectedDriverId(null);
                setSelectedDriver(null);
                setDriverVehicles([]);
            }
        } catch (err: any) {
            console.error('Failed to fetch drivers', err);
            console.error('Error response:', err.response?.data);
            setError('Failed to load drivers');
        } finally {
            setLoading(false);
        }
    };

    const selectDriver = async (driverId: string) => {
        setSelectedDriverId(driverId);
        if (driverId) {
            try {
                const data = await driverService.getDriverById(driverId);
                console.log('Driver details:', data);
                setSelectedDriver(data);

                if (data.vehicleIds && data.vehicleIds.length > 0) {
                    const vehicleData = await vehicleService.getVehiclesByIds(
                        Array.from(data.vehicleIds).map(String)
                    );
                    console.log('Driver vehicles:', vehicleData);
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

    return {
        drivers,
        selectedDriverId,
        selectedDriver,
        driverVehicles,
        loading,
        error,
        selectDriver,
        refreshDrivers: fetchDrivers
    };
};
