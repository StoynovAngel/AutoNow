import {
    createOrder,
    estimateOrder,
    getOrderById,
    getActiveOrderByUserId,
    cancelOrder,
    updateOrderStatus,
} from './orderService';
import customAPI from './ApiClient';
import { VehicleType } from '../types/vehicle';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        get: jest.fn(),
        patch: jest.fn(),
    },
}));

const mockedPost = customAPI.post as jest.Mock;
const mockedGet = customAPI.get as jest.Mock;
const mockedPatch = customAPI.patch as jest.Mock;

describe('orderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('POSTs api/orders with the full payload and returns the response data', async () => {
            const payload = {
                userId: 7,
                vehicleType: VehicleType.TAXI,
                pickupAddress: 'A',
                pickupLatitude: 1,
                pickupLongitude: 2,
                dropoffAddress: 'B',
                dropoffLatitude: 3,
                dropoffLongitude: 4,
                distanceKm: 5.2,
                vehicleClass: 'STANDARD' as const,
            };
            const responseData = { id: 99, status: 'CREATED', ...payload };
            mockedPost.mockResolvedValue({ data: responseData });

            const result = await createOrder(payload);

            expect(mockedPost).toHaveBeenCalledWith('api/orders', payload);
            expect(result).toEqual(responseData);
        });
    });

    describe('estimateOrder', () => {
        it('POSTs api/orders/estimate and returns price + currency', async () => {
            const payload = {
                vehicleType: VehicleType.TAXI,
                distanceKm: 5.2,
                vehicleClass: 'STANDARD' as const,
            };
            const responseData = { estimatedPrice: 14.5, currency: 'EUR', distanceKm: 5.2 };
            mockedPost.mockResolvedValue({ data: responseData });

            const result = await estimateOrder(payload);

            expect(mockedPost).toHaveBeenCalledWith('api/orders/estimate', payload);
            expect(result).toEqual(responseData);
        });
    });

    describe('getOrderById', () => {
        it('GETs api/orders/:id', async () => {
            const responseData = { id: 42, status: 'IN_PROGRESS' };
            mockedGet.mockResolvedValue({ data: responseData });

            const result = await getOrderById(42);

            expect(mockedGet).toHaveBeenCalledWith('api/orders/42');
            expect(result).toEqual(responseData);
        });
    });

    describe('getActiveOrderByUserId', () => {
        it('returns the active order when 200', async () => {
            const responseData = { id: 7, userId: 1, status: 'ACCEPTED' };
            mockedGet.mockResolvedValue({ data: responseData });

            const result = await getActiveOrderByUserId(1);

            expect(mockedGet).toHaveBeenCalledWith('api/orders/user/1/active');
            expect(result).toEqual(responseData);
        });

        it('returns null on 404', async () => {
            mockedGet.mockRejectedValue({ response: { status: 404 } });

            const result = await getActiveOrderByUserId(1);

            expect(result).toBeNull();
        });

        it('rethrows non-404 errors', async () => {
            mockedGet.mockRejectedValue({ response: { status: 500 } });

            await expect(getActiveOrderByUserId(1)).rejects.toEqual({ response: { status: 500 } });
        });

        it('rethrows network errors without a response', async () => {
            mockedGet.mockRejectedValue(new Error('Network Error'));

            await expect(getActiveOrderByUserId(1)).rejects.toThrow('Network Error');
        });
    });

    describe('cancelOrder', () => {
        it('POSTs api/orders/:id/cancel', async () => {
            const responseData = { id: 42, status: 'CANCELED' };
            mockedPost.mockResolvedValue({ data: responseData });

            const result = await cancelOrder(42);

            expect(mockedPost).toHaveBeenCalledWith('api/orders/42/cancel');
            expect(result).toEqual(responseData);
        });
    });

    describe('updateOrderStatus', () => {
        it('PATCHes api/orders/:id/status with the new status', async () => {
            const responseData = { id: 42, status: 'COMPLETED' };
            mockedPatch.mockResolvedValue({ data: responseData });

            const result = await updateOrderStatus(42, 'COMPLETED');

            expect(mockedPatch).toHaveBeenCalledWith('api/orders/42/status', { status: 'COMPLETED' });
            expect(result).toEqual(responseData);
        });
    });
});
