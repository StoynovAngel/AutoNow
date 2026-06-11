import customAPI from './ApiClient';
import type { VehicleType } from '../types/vehicle';

export type OrderStatus =
    | 'CREATED'
    | 'ACCEPTED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELED';

export interface DriverInfo {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imageUrl?: string;
}

export interface VehicleInfo {
    id: number;
    licensePlate: string;
    brand: string;
    model: string;
    imageUrl?: string;
}

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
    weightKg?: number;
}

export interface OrderResponse {
    id: number;
    userId: number;
    driverId?: number;
    vehicleId?: number;
    driver?: DriverInfo;
    vehicle?: VehicleInfo;
    vehicleType: VehicleType;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    status: OrderStatus;
    estimatedPrice?: number;
    finalPrice?: number;
    distanceKm?: number;
    estimatedDurationMinutes?: number;
    specialRequirements?: string;
    passengerCount?: number;
    luggageCount?: number;
    cancellationReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderEstimateRequest {
    vehicleType: VehicleType;
    distanceKm: number;
    weightKg?: number;
}

export interface OrderEstimateResponse {
    estimatedPrice: number;
    currency: string;
    distanceKm: number;
}

export const createOrder = async (payload: OrderRequest): Promise<OrderResponse> => {
    const response = await customAPI.post<OrderResponse>('api/orders', payload);
    return response.data;
};

export const estimateOrder = async (payload: OrderEstimateRequest): Promise<OrderEstimateResponse> => {
    const response = await customAPI.post<OrderEstimateResponse>('api/orders/estimate', payload);
    return response.data;
};

export const getOrderById = async (id: number): Promise<OrderResponse> => {
    const response = await customAPI.get<OrderResponse>(`api/orders/${id}`);
    return response.data;
};

export const getActiveOrderByUserId = async (userId: number): Promise<OrderResponse | null> => {
    try {
        const response = await customAPI.get<OrderResponse>(`api/orders/user/${userId}/active`);
        return response.data;
    } catch (error: unknown) {
        if (isNotFoundError(error)) {
            return null;
        }
        throw error;
    }
};

export const cancelOrder = async (id: number): Promise<OrderResponse> => {
    const response = await customAPI.post<OrderResponse>(`api/orders/${id}/cancel`);
    return response.data;
};

export const updateOrderStatus = async (
    id: number,
    status: OrderStatus,
): Promise<OrderResponse> => {
    const response = await customAPI.patch<OrderResponse>(`api/orders/${id}/status`, { status });
    return response.data;
};

const isNotFoundError = (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }
    const maybeAxios = error as { response?: { status?: number } };
    return maybeAxios.response?.status === 404;
};
