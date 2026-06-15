import apiClient from '../apiClient';

export type RentalOrderStatus = 'CREATED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface RentalVehicleInfo {
    id: number;
    licensePlate: string;
    brand: string;
    model: string;
    imageUrl?: string;
}

export interface RentalOrder {
    id: number;
    userId: number;
    companyId?: number;
    vehicleId?: number;
    vehicle?: RentalVehicleInfo;
    rentalStartDate: string;
    rentalEndDate: string;
    status: RentalOrderStatus;
    totalPrice?: number;
    securityDeposit?: number;
    specialRequirements?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
}

export const rentalOrderService = {
    getAllRentalOrders: async (): Promise<RentalOrder[]> => {
        const { data } = await apiClient.get('/rental-orders');
        return data;
    },

    getRentalOrdersByCompany: async (companyId: number): Promise<RentalOrder[]> => {
        const { data } = await apiClient.get(`/rental-orders/company/${companyId}`);
        return data;
    },

    getRentalOrderById: async (id: number): Promise<RentalOrder> => {
        const { data } = await apiClient.get(`/rental-orders/${id}`);
        return data;
    },

    updateRentalOrderStatus: async (id: number, status: RentalOrderStatus): Promise<RentalOrder> => {
        const { data } = await apiClient.patch(`/rental-orders/${id}/status`, { status });
        return data;
    },

    adminCancelRentalOrder: async (id: number): Promise<RentalOrder> => {
        const { data } = await apiClient.post(`/rental-orders/${id}/admin-cancel`);
        return data;
    },
};
