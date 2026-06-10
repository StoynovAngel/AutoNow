import { useState, useEffect } from 'react';
import { VehicleType, PublicVehicle } from '../types/vehicle';
import { getPublicVehiclesByCompany } from '../services/vehicleService';
import { parseApiError } from '../utils/errorParser';
import { useAppForeground } from './useAppForeground';

export const usePublicVehicles = (companyId: number, vehicleType?: VehicleType) => {
    const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadVehicles();
    }, [companyId, vehicleType]);

    useAppForeground(() => {
        loadVehicles();
    });

    const loadVehicles = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getPublicVehiclesByCompany(companyId, vehicleType);
            setVehicles(result);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { vehicles, loading, error, reload: loadVehicles };
};
