import apiClient from '../apiClient';

export interface DriverPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    expertiseType: string[];
    available: boolean;
    imageUrl?: string;
    companyId?: number;
}

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

    getDriversByCompanyType: async (companyType: string) => {
        const {data} = await apiClient.get(`/drivers/company/types/${companyType}`);
        return data;
    },

    createDriver: async (driverData: DriverPayload) => {
        const {data} = await apiClient.post('/drivers', driverData);
        return data;
    },

    updateDriver: async (id: string, driverData: DriverPayload) => {
        const {data} = await apiClient.put(`/drivers/${id}`, driverData);
        return data;
    },

    deleteDriver: async (id: string) => {
        await apiClient.delete(`/drivers/${id}`);
    },

    assignVehicle: async (driverId: number, vehicleId: number) => {
        const { data } = await apiClient.put(`/drivers/${driverId}/vehicles/${vehicleId}`);
        return data;
    },

    unassignVehicle: async (driverId: number, vehicleId: number) => {
        const { data } = await apiClient.delete(`/drivers/${driverId}/vehicles/${vehicleId}`);
        return data;
    },
};
