import { getCompaniesByType } from './companyService';
import customAPI from './ApiClient';
import { VehicleType } from '../types/vehicle';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

const mockedGet = customAPI.get as jest.Mock;

describe('companyService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GETs api/companies/type/{vehicleType} and returns the data', async () => {
        const data = [{ id: 1, name: 'Acme', companyType: VehicleType.TAXI }];
        mockedGet.mockResolvedValue({ data });

        const result = await getCompaniesByType(VehicleType.TAXI);

        expect(mockedGet).toHaveBeenCalledWith('api/companies/type/TAXI');
        expect(result).toEqual(data);
    });

    it('passes the vehicle type through to the URL', async () => {
        mockedGet.mockResolvedValue({ data: [] });

        await getCompaniesByType(VehicleType.AMBULANCE);

        expect(mockedGet).toHaveBeenCalledWith('api/companies/type/AMBULANCE');
    });
});
