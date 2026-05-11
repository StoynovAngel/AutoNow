import apiClient from '../apiClient';

export const companyService = {
    getAllCompanies: async () => {
        const {data} = await apiClient.get('/companies');
        return data;
    },

    getCompanyById: async (id: string) => {
        const {data} = await apiClient.get(`/companies/${id}`);
        return data;
    },

    createCompany: async (companyData: any) => {
        const {data} = await apiClient.post('/companies', companyData);
        return data;
    },

    updateCompany: async (id: string, companyData: any) => {
        const {data} = await apiClient.put(`/companies/${id}`, companyData);
        return data;
    },

    deleteCompany: async (id: string) => {
        await apiClient.delete(`/companies/${id}`);
    }
};
