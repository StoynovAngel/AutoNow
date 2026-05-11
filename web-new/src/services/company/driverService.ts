import apiClient from '../apiClient';

export const driverService = {
    getAllDrivers: async () => {
        const {data} = await apiClient.get('/drivers');
        return data;
    },

    getDriverById: async (id: string) => {
        const {data} = await apiClient.get(`/drivers/${id}`);
        return data;
    },

    getDriversByCompany: async (companyId: string) => {
        const {data} = await apiClient.get(`/drivers/company/${companyId}`);
        return data;
    },

    createDriver: async (driverData: any) => {
        const {data} = await apiClient.post('/drivers', driverData);
        return data;
    },

    updateDriver: async (id: string, driverData: any) => {
        const {data} = await apiClient.put(`/drivers/${id}`, driverData);
        return data;
    },

    deleteDriver: async (id: string) => {
        await apiClient.delete(`/drivers/${id}`);
    }
};
