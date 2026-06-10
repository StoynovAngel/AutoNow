import { useCallback } from 'react';
import { VehicleType } from '../types/vehicle';
import { Company } from '../types/company';
import { getCompaniesByType } from '../services/companyService';
import { useDataFetch } from './useDataFetch';

export const useCompanies = (vehicleType: VehicleType) => {
    const loader = useCallback(() => getCompaniesByType(vehicleType), [vehicleType]);
    const { data: companies, loading, error, reload } = useDataFetch<Company[]>(loader, []);
    return { companies, loading, error, reload };
};
