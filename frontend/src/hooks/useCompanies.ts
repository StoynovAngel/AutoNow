import { useState, useEffect } from 'react';
import { VehicleType } from '../types/vehicle';
import { Company } from '../types/company';
import { getCompaniesByType } from '../services/companyService';
import { parseApiError } from '../utils/errorParser';
import { useAppForeground } from './useAppForeground';

export const useCompanies = (vehicleType: VehicleType) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCompanies();
    }, [vehicleType]);

    useAppForeground(() => {
        loadCompanies();
    });

    const loadCompanies = async () => {
        setLoading(true);
        setError('');

        try {
            const companies = await getCompaniesByType(vehicleType);
            setCompanies(companies);
        } catch (err: any) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { companies, loading, error, reload: loadCompanies };
};
