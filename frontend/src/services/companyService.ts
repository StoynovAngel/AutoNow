import customAPI from './ApiClient';
import type { Company } from '../types/company';
import { VehicleType } from '../types/vehicle';

export const getCompaniesByType = async (vehicleType: VehicleType): Promise<Company[]> => {
    const response = await customAPI.get<Company[]>(
        `api/companies/type/${vehicleType}`
    );
    return response.data;
};
