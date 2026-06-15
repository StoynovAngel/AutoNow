import customAPI from './ApiClient';

export interface RentalOrderRequest {
    userId: number;
    companyId?: number;
    vehicleId: number;
    rentalStartDate: string;
    rentalEndDate: string;
    specialRequirements?: string;
}

export type RentalOrderStatus = 'CREATED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface RentalVehicleInfo {
    id: number;
    licensePlate: string;
    brand: string;
    model: string;
    imageUrl?: string;
}

export interface RentalOrderResponse {
    id: number;
    userId: number;
    companyId?: number;
    vehicleId?: number;
    vehicle?: RentalVehicleInfo;
    rentalStartDate: string;
    rentalEndDate: string;
    status: RentalOrderStatus;
    totalPrice?: number;
    specialRequirements?: string;
    cancellationReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const createRentalOrder = async (payload: RentalOrderRequest): Promise<RentalOrderResponse> => {
    const response = await customAPI.post<RentalOrderResponse>('api/rental-orders', payload);
    return response.data;
};

export const getRentalOrderById = async (id: number): Promise<RentalOrderResponse> => {
    const response = await customAPI.get<RentalOrderResponse>(`api/rental-orders/${id}`);
    return response.data;
};

export const cancelRentalOrder = async (id: number): Promise<RentalOrderResponse> => {
    const response = await customAPI.post<RentalOrderResponse>(`api/rental-orders/${id}/cancel`);
    return response.data;
};
