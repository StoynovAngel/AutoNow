import { useState, useEffect } from 'react';
import { VehicleType } from '../types/vehicle';
import type { Company } from '../types/company';
import { getCompaniesByType } from '../services/companyService';
import { parseApiError } from '../utils/errorParser';

export const useCompanies = (vehicleType: VehicleType) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getCompaniesByType(vehicleType);
            setCompanies(data);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [vehicleType]);

    return { companies, loading, error, reload: load };
};
