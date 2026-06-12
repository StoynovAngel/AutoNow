import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCompanyPricing } from '../useCompanyPricing';
import { pricingService } from '../../services/company/pricingService';
import type { CompanyPricing } from '../../services/company/pricingService';

vi.mock('../../services/company/pricingService');

const mockPricing = (overrides: Partial<CompanyPricing> = {}): CompanyPricing => ({
    id: 1,
    companyId: 10,
    baseFare: 2.50,
    ratePerKm: 1.20,
    nightMultiplier: 1.20,
    nightStartHour: 22,
    nightEndHour: 6,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
    ...overrides,
});

describe('useCompanyPricing', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('fetches pricing when companyId and supported type are provided', async () => {
        const pricing = mockPricing();
        vi.mocked(pricingService.getPricing).mockResolvedValue(pricing);

        const { result } = renderHook(() => useCompanyPricing(10, 'TAXI'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.pricing).toEqual(pricing);
        expect(result.current.error).toBeNull();
        expect(pricingService.getPricing).toHaveBeenCalledWith(10);
    });

    it('returns null pricing when response is null (no pricing configured)', async () => {
        vi.mocked(pricingService.getPricing).mockResolvedValue(null);

        const { result } = renderHook(() => useCompanyPricing(10, 'AMBULANCE'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.pricing).toBeNull();
    });

    it('skips fetch for unsupported company type', async () => {
        const { result } = renderHook(() => useCompanyPricing(10, 'RENTAL'));

        expect(result.current.loading).toBe(false);
        expect(result.current.pricing).toBeNull();
        expect(result.current.supported).toBe(false);
        expect(pricingService.getPricing).not.toHaveBeenCalled();
    });

    it('skips fetch when companyId is null', async () => {
        const { result } = renderHook(() => useCompanyPricing(null, 'TAXI'));

        expect(result.current.loading).toBe(false);
        expect(result.current.pricing).toBeNull();
        expect(pricingService.getPricing).not.toHaveBeenCalled();
    });

    it('sets error when fetch fails', async () => {
        vi.mocked(pricingService.getPricing).mockRejectedValue(new Error('network error'));

        const { result } = renderHook(() => useCompanyPricing(10, 'LOGISTICS'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Failed to load pricing');
        expect(result.current.pricing).toBeNull();
    });

    it('savePricing calls updatePricing when row exists (id set)', async () => {
        const initial = mockPricing();
        const updated = mockPricing({ baseFare: 3.50 });
        vi.mocked(pricingService.getPricing).mockResolvedValue(initial);
        vi.mocked(pricingService.updatePricing).mockResolvedValue(updated);

        const { result } = renderHook(() => useCompanyPricing(10, 'TAXI'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.savePricing(10, { baseFare: 3.50 });
        });

        expect(result.current.pricing?.baseFare).toBe(3.50);
        expect(pricingService.updatePricing).toHaveBeenCalledWith(10, { baseFare: 3.50 });
        expect(pricingService.createPricing).not.toHaveBeenCalled();
    });

    it('savePricing calls createPricing when no row yet (id undefined / defaults)', async () => {
        const defaults = mockPricing({ id: undefined, createdAt: undefined, updatedAt: undefined });
        const created = mockPricing({ id: 99, baseFare: 3.50 });
        vi.mocked(pricingService.getPricing).mockResolvedValue(defaults);
        vi.mocked(pricingService.createPricing).mockResolvedValue(created);

        const { result } = renderHook(() => useCompanyPricing(10, 'TAXI'));

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.savePricing(10, { baseFare: 3.50 });
        });

        expect(result.current.pricing?.id).toBe(99);
        expect(pricingService.createPricing).toHaveBeenCalledWith(10, { baseFare: 3.50 });
        expect(pricingService.updatePricing).not.toHaveBeenCalled();
    });

    it('refetches when companyId changes', async () => {
        const pricing1 = mockPricing({ companyId: 10 });
        const pricing2 = mockPricing({ companyId: 20, baseFare: 4.00 });
        vi.mocked(pricingService.getPricing)
            .mockResolvedValueOnce(pricing1)
            .mockResolvedValueOnce(pricing2);

        const { result, rerender } = renderHook(
            ({ id }: { id: number }) => useCompanyPricing(id, 'TAXI'),
            { initialProps: { id: 10 } },
        );

        await waitFor(() => expect(result.current.pricing?.companyId).toBe(10));

        rerender({ id: 20 });

        await waitFor(() => expect(result.current.pricing?.companyId).toBe(20));
        expect(pricingService.getPricing).toHaveBeenCalledTimes(2);
    });
});
