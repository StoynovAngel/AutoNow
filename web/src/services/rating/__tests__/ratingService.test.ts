import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ratingService, type Rating } from '../ratingService';
import apiClient from '../../apiClient';

vi.mock('../../apiClient', () => ({
    default: {
        get: vi.fn(),
    },
}));

describe('ratingService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('getRatingsByDriverId GETs /ratings/driver/{driverId} and returns the data array', async () => {
        const mockedRatings: Rating[] = [
            { id: 1, orderId: 10, rating: 5, comment: 'great', createdAt: '2026-06-01T00:00:00Z' },
            { id: 2, orderId: 20, rating: 4, createdAt: '2026-06-02T00:00:00Z' },
        ];
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockedRatings });

        const result = await ratingService.getRatingsByDriverId('7');

        expect(apiClient.get).toHaveBeenCalledWith('/ratings/driver/7');
        expect(result).toEqual(mockedRatings);
    });
});
