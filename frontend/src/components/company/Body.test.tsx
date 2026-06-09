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

    it('TAXI bookings show STANDARD/XL buttons that navigate to map with the chosen class', () => {
        mockRouteVehicleType = VehicleType.TAXI;
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('book-7-STANDARD'));
        expect(mockNavigate).toHaveBeenCalledWith('bookingMap', {
            companyId: 7,
            vehicleType: VehicleType.TAXI,
            preferences: { vehicleClass: 'STANDARD' },
        });

        mockNavigate.mockClear();
        fireEvent.press(getByTestId('book-7-XL'));
        expect(mockNavigate).toHaveBeenCalledWith('bookingMap', {
            companyId: 7,
            vehicleType: VehicleType.TAXI,
            preferences: { vehicleClass: 'XL' },
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

    it('routes PROM bookings to the prom vehicles screen', () => {
        mockRouteVehicleType = VehicleType.PROM;
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('book-7'));

        expect(mockNavigate).toHaveBeenCalledWith('vehicleList', {
            companyId: 7,
            vehicleType: VehicleType.PROM,
        });
    });

    it('routes RENTAL bookings to the vehicle list screen', () => {
        mockRouteVehicleType = VehicleType.RENTAL;
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('book-7'));

        expect(mockNavigate).toHaveBeenCalledWith('vehicleList', {
            companyId: 7,
            vehicleType: VehicleType.RENTAL,
        });
    });

    it('does not render a Book button for FUNERAL companies', () => {
        mockRouteVehicleType = VehicleType.FUNERAL;
        const { queryByTestId } = renderWithProviders(<Body />);

        expect(queryByTestId('book-7')).toBeNull();
        expect(queryByTestId('book-7-STANDARD')).toBeNull();
    });
});
