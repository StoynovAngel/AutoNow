import customAPI from './ApiClient';
import { VehicleType } from '../types/vehicle';
import type { PublicVehicle } from '../types/vehicle';

export const getPublicVehiclesByCompany = async (
    companyId: number,
    vehicleType?: VehicleType,
): Promise<PublicVehicle[]> => {
    const response = await customAPI.get<PublicVehicle[]>(
        `api/vehicles/public/company/${companyId}`,
        vehicleType ? { params: { vehicleType } } : undefined,
    );
    return response.data;
};
