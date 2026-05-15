import apiClient from '../apiClient';

export const vehicleService = {
    getAllVehicles: async () => {
        const {data} = await apiClient.get('/vehicles');
        return data;
    },

    getVehicleById: async (id: string) => {
        const {data} = await apiClient.get(`/vehicles/${id}`);
        return data;
    },

    getVehiclesByIds: async (ids: string[]) => {
        const requests = ids.map(id => apiClient.get(`/vehicles/${id}`));
        const responses = await Promise.all(requests);
        return responses.map(response => response.data);
    },

    createVehicle: async (vehicleData: any) => {
        const {data} = await apiClient.post('/vehicles', vehicleData);
        return data;
    },

    updateVehicle: async (id: string, vehicleData: any) => {
        const {data} = await apiClient.put(`/vehicles/${id}`, vehicleData);
        return data;
    },

    deleteVehicle: async (id: string) => {
        await apiClient.delete(`/vehicles/${id}`);
    }
};
