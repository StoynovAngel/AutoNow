import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCompanies } from './useCompanies';
import { companyService } from '../services/company/companyService';
import type { Company } from '../components/company/CompanyInfo';

vi.mock('../services/company/companyService');

const company = (id: number, overrides: Partial<Company> = {}): Company => ({
    id,
    name: `Company ${id}`,
    address: '1 Main St',
    phone: '555-0000',
    email: `c${id}@example.com`,
    companyType: 'TAXI',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ...overrides,
});

describe('useCompanies', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('fetches companies on mount', async () => {
        const companies = [company(1), company(2)];
        vi.mocked(companyService.getAllCompanies).mockResolvedValue(companies);

        const { result } = renderHook(() => useCompanies());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.companies).toEqual(companies);
        expect(result.current.error).toBeNull();
    });

    it('sets an error message when the fetch fails', async () => {
        vi.mocked(companyService.getAllCompanies).mockRejectedValue(new Error('boom'));

        const { result } = renderHook(() => useCompanies());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to load companies');
        expect(result.current.companies).toEqual([]);
    });

    it('selectCompany loads the company details', async () => {
        const c = company(1);
        vi.mocked(companyService.getAllCompanies).mockResolvedValue([c]);
        vi.mocked(companyService.getCompanyById).mockResolvedValue(c);

        const { result } = renderHook(() => useCompanies());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.selectCompany(1);
        });

        expect(companyService.getCompanyById).toHaveBeenCalledWith('1');
        expect(result.current.selectedCompanyId).toBe(1);
        expect(result.current.selectedCompany).toEqual(c);
    });

    it('refreshCompanies refetches the list', async () => {
        vi.mocked(companyService.getAllCompanies)
            .mockResolvedValueOnce([company(1)])
            .mockResolvedValueOnce([company(1), company(2)]);

        const { result } = renderHook(() => useCompanies());
        await waitFor(() => expect(result.current.companies).toHaveLength(1));

        await act(async () => {
            await result.current.refreshCompanies();
        });

        expect(result.current.companies).toHaveLength(2);
        expect(companyService.getAllCompanies).toHaveBeenCalledTimes(2);
    });
});
