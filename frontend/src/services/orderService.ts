import customAPI from './ApiClient';
import type { VehicleType } from '../types/vehicle';
import type { VehicleClass } from '../types/booking';

export interface OrderRequest {
    userId: number;
    vehicleType: VehicleType;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    distanceKm?: number;
    passengerCount?: number;
    luggageCount?: number;
    vehicleClass?: VehicleClass;
    requiresAirConditioning?: boolean;
}

export interface OrderResponse {
    id: number;
    userId: number;
    vehicleType: VehicleType;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    status: string;
    distanceKm?: number;
    passengerCount?: number;
    luggageCount?: number;
    vehicleClass?: VehicleClass;
    requiresAirConditioning?: boolean;
}

export const createOrder = async (payload: OrderRequest): Promise<OrderResponse> => {
    const response = await customAPI.post<OrderResponse>('api/orders', payload);
    return response.data;
};
