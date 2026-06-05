import { submitRating } from './ratingService';
import customAPI from './ApiClient';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

const mockedPost = customAPI.post as jest.Mock;

describe('ratingService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('submitRating', () => {
        it('POSTs api/ratings with the payload and returns the response', async () => {
            const payload = { orderId: 7, rating: 5, comment: 'Great' };
            const responseData = { id: 1, ...payload, createdAt: '2026-06-04T12:00:00' };
            mockedPost.mockResolvedValue({ data: responseData });

            const result = await submitRating(payload);

            expect(mockedPost).toHaveBeenCalledWith('api/ratings', payload);
            expect(result).toEqual(responseData);
        });

        it('omits comment when not provided', async () => {
            const payload = { orderId: 7, rating: 4 };
            const responseData = { id: 1, ...payload };
            mockedPost.mockResolvedValue({ data: responseData });

            await submitRating(payload);

            expect(mockedPost).toHaveBeenCalledWith('api/ratings', payload);
        });
    });
});
