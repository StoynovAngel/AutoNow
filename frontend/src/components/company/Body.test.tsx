import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import Body from './Body';
import { VehicleType } from '../../types/vehicle';
import type { Company } from '../../types/company';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockRouteVehicleType: VehicleType = VehicleType.TAXI;

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
    useRoute: () => ({ params: { vehicleType: mockRouteVehicleType } }),
}));

const mockCompany: Company = {
    id: 7,
    name: 'Acme',
    phone: '+359888123456',
    companyType: VehicleType.TAXI,
};

jest.mock('../../hooks/useCompanies', () => ({
    useCompanies: () => ({
        companies: [mockCompany],
        loading: false,
        error: '',
        reload: jest.fn(),
    }),
}));

describe('company Body', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockGoBack.mockClear();
    });

    it('routes TAXI bookings to the preferences screen', () => {
        mockRouteVehicleType = VehicleType.TAXI;
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('book-7'));

        expect(mockNavigate).toHaveBeenCalledWith('bookingPreferences', {
            companyId: 7,
            vehicleType: VehicleType.TAXI,
        });
    });

    it('routes non-TAXI bookings straight to the map with empty preferences', () => {
        mockRouteVehicleType = VehicleType.AMBULANCE;
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('book-7'));

        expect(mockNavigate).toHaveBeenCalledWith('bookingMap', {
            companyId: 7,
            vehicleType: VehicleType.AMBULANCE,
            preferences: {},
        });
    });
});
