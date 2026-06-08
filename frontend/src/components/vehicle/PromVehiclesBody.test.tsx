import { fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import PromVehiclesBody from './PromVehiclesBody';
import { VehicleType, PublicVehicle } from '../../types/vehicle';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
    useRoute: () => ({ params: { companyId: 42 } }),
}));

const mockHookValue: {
    vehicles: PublicVehicle[];
    loading: boolean;
    error: string;
    reload: jest.Mock;
} = {
    vehicles: [],
    loading: false,
    error: '',
    reload: jest.fn(),
};

jest.mock('../../hooks/usePublicVehicles', () => ({
    usePublicVehicles: () => mockHookValue,
}));

describe('PromVehiclesBody', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockGoBack.mockClear();
        mockHookValue.reload.mockClear();
        mockHookValue.vehicles = [];
        mockHookValue.loading = false;
        mockHookValue.error = '';
    });

    it('renders an empty state when there are no vehicles', () => {
        const { getByText } = renderWithProviders(<PromVehiclesBody />);
        expect(getByText('prom-vehicles-empty-title')).toBeTruthy();
    });

    it('renders a card per vehicle and calls the driver phone on press', () => {
        const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        mockHookValue.vehicles = [
            {
                id: 1,
                brand: 'Mercedes',
                model: 'E-Class',
                licensePlate: 'CB1234AA',
                numberOfSeats: 4,
                vehicleType: VehicleType.PROM,
                driverPhoneNumber: '+359888111222',
                imageUrl: 'https://example.com/mercedes.jpg',
            },
        ];

        const { getByText, getByTestId } = renderWithProviders(<PromVehiclesBody />);

        expect(getByText('Mercedes E-Class')).toBeTruthy();
        expect(getByText('CB1234AA')).toBeTruthy();
        expect(getByTestId('prom-image-1').props.source).toEqual({
            uri: 'https://example.com/mercedes.jpg',
        });

        fireEvent.press(getByTestId('prom-call-1'));
        expect(openURL).toHaveBeenCalledWith('tel:+359888111222');

        openURL.mockRestore();
    });

    it('renders a placeholder when the vehicle has no imageUrl', () => {
        mockHookValue.vehicles = [
            {
                id: 5,
                brand: 'BMW',
                model: '7',
                licensePlate: 'CB5555KM',
                vehicleType: VehicleType.PROM,
            },
        ];

        const { getByTestId, queryByTestId } = renderWithProviders(<PromVehiclesBody />);

        expect(getByTestId('prom-image-placeholder-5')).toBeTruthy();
        expect(queryByTestId('prom-image-5')).toBeNull();
    });

    it('disables the call button when no driver phone is available', () => {
        const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        mockHookValue.vehicles = [
            {
                id: 2,
                brand: 'BMW',
                model: '7',
                licensePlate: 'CB5555KM',
                vehicleType: VehicleType.PROM,
            },
        ];

        const { getByTestId } = renderWithProviders(<PromVehiclesBody />);

        fireEvent.press(getByTestId('prom-call-2'));
        expect(openURL).not.toHaveBeenCalled();

        openURL.mockRestore();
    });

    it('renders an error state with retry that triggers reload', () => {
        mockHookValue.error = 'Network down';

        const { getByText, getByTestId } = renderWithProviders(<PromVehiclesBody />);

        expect(getByText('Network down')).toBeTruthy();
        fireEvent.press(getByTestId('prom-vehicles-retry'));
        expect(mockHookValue.reload).toHaveBeenCalled();
    });

    it('back button calls navigation.goBack', () => {
        const { getByTestId } = renderWithProviders(<PromVehiclesBody />);
        fireEvent.press(getByTestId('prom-vehicles-back'));
        expect(mockGoBack).toHaveBeenCalled();
    });
});
