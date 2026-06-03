import { createOrder } from './orderService';
import customAPI from './ApiClient';
import { VehicleType } from '../types/vehicle';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}));

const mockedPost = customAPI.post as jest.Mock;

describe('orderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
            passengerCount: 2,
        };
        const responseData = { id: 99, status: 'CREATED', ...payload };
        mockedPost.mockResolvedValue({ data: responseData });

        const result = await createOrder(payload);

        expect(mockedPost).toHaveBeenCalledWith('api/orders', payload);
        expect(result).toEqual(responseData);
    });
});
