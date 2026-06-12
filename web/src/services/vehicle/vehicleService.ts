import apiClient from '../apiClient';

export interface VehiclePayload {
    brand: string;
    model: string;
    licensePlate: string;
    imageUrl?: string;
    airConditioning: boolean;
    numberOfSeats: number;
    trunkCapacity?: number;
    vehicleType: string;
    companyId?: number;
}

export const vehicleService = {
    getAllVehicles: async () => {
        const {data} = await apiClient.get('/vehicles');
        return data;
    },

    getMyVehicles: async () => {
        const {data} = await apiClient.get('/vehicles/my');
        return data;
    },

    getVehicleById: async (id: string) => {
        const {data} = await apiClient.get(`/vehicles/${id}`);
        return data;
    },

    getVehiclesByCompany: async (companyId: string) => {
        const {data} = await apiClient.get(`/vehicles/company/${companyId}`);
        return data;
    },

    getVehiclesByIds: async (ids: string[]) => {
        const requests = ids.map(id => apiClient.get(`/vehicles/${id}`));
        const responses = await Promise.all(requests);
        return responses.map(response => response.data);
    },

    createVehicle: async (vehicleData: VehiclePayload) => {
        const {data} = await apiClient.post('/vehicles', vehicleData);
        return data;
    },

    updateVehicle: async (id: string, vehicleData: VehiclePayload) => {
        const {data} = await apiClient.put(`/vehicles/${id}`, vehicleData);
        return data;
    },

    deleteVehicle: async (id: string) => {
        await apiClient.delete(`/vehicles/${id}`);
    }
};
