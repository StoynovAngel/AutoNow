import { describe, it, expect, beforeEach, vi } from 'vitest';
import { driverService, type DriverPayload } from '../driverService';
import apiClient from '../../apiClient';

vi.mock('../../apiClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const payload: DriverPayload = {
    firstName: 'A',
    lastName: 'B',
    phoneNumber: '555',
    licenseNumber: 'L1',
    expertiseType: 'TAXI',
    available: true,
    companyId: 1,
};

describe('driverService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('getAllDrivers GETs /drivers', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

        await driverService.getAllDrivers();

        expect(apiClient.get).toHaveBeenCalledWith('/drivers');
    });

    it('getDriverById GETs /drivers/{id}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 5 } });

        await driverService.getDriverById('5');

        expect(apiClient.get).toHaveBeenCalledWith('/drivers/5');
    });

    it('getDriversByCompany GETs /drivers/company/{companyId}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

        await driverService.getDriversByCompany('10');

        expect(apiClient.get).toHaveBeenCalledWith('/drivers/company/10');
    });

    it('createDriver POSTs to /drivers with payload', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 1, ...payload } });

        await driverService.createDriver(payload);

        expect(apiClient.post).toHaveBeenCalledWith('/drivers', payload);
    });

    it('updateDriver PUTs to /drivers/{id} with payload', async () => {
        vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 5, ...payload } });

        await driverService.updateDriver('5', payload);

        expect(apiClient.put).toHaveBeenCalledWith('/drivers/5', payload);
    });

    it('getDriversByCompanyType GETs /drivers/company/types/{companyType}', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

        await driverService.getDriversByCompanyType('TAXI');

        expect(apiClient.get).toHaveBeenCalledWith('/drivers/company/types/TAXI');
    });

    it('deleteDriver DELETEs /drivers/{id}', async () => {
        vi.mocked(apiClient.delete).mockResolvedValue({});

        await driverService.deleteDriver('5');

        expect(apiClient.delete).toHaveBeenCalledWith('/drivers/5');
    });
});
