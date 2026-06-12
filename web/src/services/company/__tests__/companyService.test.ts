import { describe, it, expect, beforeEach, vi } from 'vitest';
import { companyService, type CompanyPayload } from '../companyService';
import apiClient from '../../apiClient';

vi.mock('../../apiClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const payload: CompanyPayload = {
    name: 'Acme',
    address: '1 Main',
    phone: '555',
    email: 'a@b.com',
    companyType: 'TAXI',
};

describe('companyService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('getAllCompanies GETs /companies and returns the data', async () => {
        const data = [{ id: 1, name: 'Acme' }];
        vi.mocked(apiClient.get).mockResolvedValue({ data });

        const result = await companyService.getAllCompanies();

        expect(apiClient.get).toHaveBeenCalledWith('/companies');
        expect(result).toEqual(data);
    });

    it('getCompanyById GETs /companies/{id}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 5 } });

        await companyService.getCompanyById(5);

        expect(apiClient.get).toHaveBeenCalledWith('/companies/5');
    });

    it('createCompany POSTs to /companies with payload', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 1, ...payload } });

        await companyService.createCompany(payload);

        expect(apiClient.post).toHaveBeenCalledWith('/companies', payload);
    });

    it('updateCompany PUTs to /companies/{id} with payload', async () => {
        vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 5, ...payload } });

        await companyService.updateCompany(5, payload);

        expect(apiClient.put).toHaveBeenCalledWith('/companies/5', payload);
    });

    it('deleteCompany DELETEs /companies/{id}', async () => {
        vi.mocked(apiClient.delete).mockResolvedValue({});

        await companyService.deleteCompany(5);

        expect(apiClient.delete).toHaveBeenCalledWith('/companies/5');
    });

    it('joinCompany POSTs to /companies/{id}/join and returns token', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { token: 'new-jwt' } });

        const result = await companyService.joinCompany(7);

        expect(apiClient.post).toHaveBeenCalledWith('/companies/7/join');
        expect(result).toEqual({ token: 'new-jwt' });
    });
});
