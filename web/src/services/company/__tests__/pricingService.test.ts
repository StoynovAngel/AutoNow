import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../../apiClient';
import { pricingService } from '../pricingService';

vi.mock('../../apiClient');

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);
const mockPut = vi.mocked(apiClient.put);

describe('pricingService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('getPricing', () => {
        it('returns pricing data on 200', async () => {
            const data = { id: 1, companyId: 5, baseFare: 2.50 };
            mockGet.mockResolvedValue({ status: 200, data });

            const result = await pricingService.getPricing(5);

            expect(result).toEqual(data);
            expect(mockGet).toHaveBeenCalledWith('/companies/5/pricing', expect.any(Object));
        });

        it('returns null on 404', async () => {
            mockGet.mockResolvedValue({ status: 404, data: null });

            const result = await pricingService.getPricing(5);

            expect(result).toBeNull();
        });
    });

    describe('createPricing', () => {
        it('sends POST with payload and returns response data', async () => {
            const payload = { baseFare: 3.00, ratePerKm: 1.50 };
            const data = { id: 1, companyId: 5, ...payload };
            mockPost.mockResolvedValue({ data });

            const result = await pricingService.createPricing(5, payload);

            expect(result).toEqual(data);
            expect(mockPost).toHaveBeenCalledWith('/companies/5/pricing', payload);
        });
    });

    describe('updatePricing', () => {
        it('sends PUT with payload and returns response data', async () => {
            const payload = { baseFare: 4.00, ratePerKm: 1.80 };
            const data = { id: 1, companyId: 5, ...payload };
            mockPut.mockResolvedValue({ data });

            const result = await pricingService.updatePricing(5, payload);

            expect(result).toEqual(data);
            expect(mockPut).toHaveBeenCalledWith('/companies/5/pricing', payload);
        });
    });
});
