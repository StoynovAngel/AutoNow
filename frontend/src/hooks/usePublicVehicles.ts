import { useState, useEffect } from 'react';
import type { VehicleType, PublicVehicle } from '../types/vehicle';
import { getPublicVehiclesByCompany } from '../services/vehicleService';
import { parseApiError } from '../utils/errorParser';

export const usePublicVehicles = (companyId: number, vehicleType?: VehicleType) => {
    const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getPublicVehiclesByCompany(companyId, vehicleType);
            setVehicles(data);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [companyId, vehicleType]);

    return { vehicles, loading, error, reload: load };
};
