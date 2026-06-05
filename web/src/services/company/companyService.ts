import apiClient from '../apiClient';

export const COMPANY_TYPES = ['TAXI', 'LOGISTICS', 'AMBULANCE', 'RENTAL', 'FUNERAL', 'PROM'] as const;
export type CompanyType = typeof COMPANY_TYPES[number];

export interface CompanyPayload {
    name: string;
    address: string;
    phone: string;
    email: string;
    description?: string;
    companyType: CompanyType;
}

export const companyService = {
    getAllCompanies: async () => {
        const {data} = await apiClient.get('/companies');
        return data;
    },

    getCompanyById: async (id: string) => {
        const {data} = await apiClient.get(`/companies/${id}`);
        return data;
    },

    createCompany: async (companyData: CompanyPayload) => {
        const {data} = await apiClient.post('/companies', companyData);
        return data;
    },

    updateCompany: async (id: string, companyData: CompanyPayload) => {
        const {data} = await apiClient.put(`/companies/${id}`, companyData);
        return data;
    },

    deleteCompany: async (id: string) => {
        await apiClient.delete(`/companies/${id}`);
    }
};
