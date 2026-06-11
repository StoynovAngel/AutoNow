import { useState, useEffect, useRef } from 'react';
import type { VehicleType, PublicVehicle } from '../types/vehicle';
import { getPublicVehiclesByCompany } from '../services/vehicleService';
import { parseApiError } from '../utils/errorParser';

export const usePublicVehicles = (companyId: number, vehicleType?: VehicleType) => {
    const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const requestId = useRef(0);

    const load = async () => {
        const id = ++requestId.current;
        setLoading(true);
        setError('');
        try {
            const data = await getPublicVehiclesByCompany(companyId, vehicleType);
            if (id !== requestId.current) return;
            setVehicles(data);
        } catch (err) {
            if (id !== requestId.current) return;
            setError(parseApiError(err));
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [companyId, vehicleType]);

    return { vehicles, loading, error, reload: load };
};
