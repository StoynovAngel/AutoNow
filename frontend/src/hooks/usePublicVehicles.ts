import { useCallback } from 'react';
import { VehicleType, PublicVehicle } from '../types/vehicle';
import { getPublicVehiclesByCompany } from '../services/vehicleService';
import { useDataFetch } from './useDataFetch';

export const usePublicVehicles = (companyId: number, vehicleType?: VehicleType) => {
    const loader = useCallback(
        () => getPublicVehiclesByCompany(companyId, vehicleType),
        [companyId, vehicleType],
    );
    const { data: vehicles, loading, error, reload } = useDataFetch<PublicVehicle[]>(loader, []);
    return { vehicles, loading, error, reload };
};
