import apiClient from '../apiClient';

export interface CompanyPricing {
    id?: number;
    companyId: number;
    baseFare?: number;
    ratePerKm?: number;
    premiumMultiplier?: number;
    nightMultiplier?: number;
    nightStartHour?: number;
    nightEndHour?: number;
    ambulanceBaseFare?: number;
    logisticsBaseFare?: number;
    logisticsRatePerKg?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PricingPayload {
    baseFare?: number;
    ratePerKm?: number;
    premiumMultiplier?: number;
    nightMultiplier?: number;
    nightStartHour?: number;
    nightEndHour?: number;
    ambulanceBaseFare?: number;
    logisticsBaseFare?: number;
    logisticsRatePerKg?: number;
}

export const pricingService = {
    getPricing: async (companyId: number): Promise<CompanyPricing | null> => {
        const response = await apiClient.get(`/companies/${companyId}/pricing`, {
            validateStatus: (status) => status === 200 || status === 404,
        });
        return response.status === 404 ? null : response.data;
    },

    createPricing: async (companyId: number, payload: PricingPayload): Promise<CompanyPricing> => {
        const { data } = await apiClient.post(`/companies/${companyId}/pricing`, payload);
        return data;
    },

    updatePricing: async (companyId: number, payload: PricingPayload): Promise<CompanyPricing> => {
        const { data } = await apiClient.put(`/companies/${companyId}/pricing`, payload);
        return data;
    },
};
