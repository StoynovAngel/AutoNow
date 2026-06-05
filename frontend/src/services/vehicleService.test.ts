import { getPublicVehiclesByCompany } from './vehicleService';
import customAPI from './ApiClient';
import { VehicleType } from '../types/vehicle';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

const mockedGet = customAPI.get as jest.Mock;

describe('vehicleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GETs the public endpoint with the vehicleType param when provided', async () => {
        const data = [
            {
                id: 1,
                brand: 'Mercedes',
                model: 'E-Class',
                licensePlate: 'CB1234AA',
                vehicleType: VehicleType.PROM,
                driverPhoneNumber: '+359888111222',
            },
        ];
        mockedGet.mockResolvedValue({ data });

        const result = await getPublicVehiclesByCompany(42, VehicleType.PROM);

        expect(mockedGet).toHaveBeenCalledWith('api/vehicles/public/company/42', {
            params: { vehicleType: VehicleType.PROM },
        });
        expect(result).toEqual(data);
    });

    it('omits the params when no vehicleType is provided', async () => {
        mockedGet.mockResolvedValue({ data: [] });

        await getPublicVehiclesByCompany(7);

        expect(mockedGet).toHaveBeenCalledWith('api/vehicles/public/company/7', undefined);
    });
});
