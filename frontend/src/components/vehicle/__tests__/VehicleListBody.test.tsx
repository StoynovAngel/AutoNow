import { fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import VehicleListBody from '../VehicleListBody';
import { VehicleType, PublicVehicle } from '../../../types/vehicle';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
    useRoute: () => ({ params: { companyId: 42, vehicleType: 'PROM' } }),
}));

jest.mock('../../../hooks/usePublicVehicles', () => ({
    usePublicVehicles: jest.fn(),
}));

import { usePublicVehicles } from '../../../hooks/usePublicVehicles';
const mockUsePublicVehicles = usePublicVehicles as jest.Mock;

const mockReload = jest.fn();

describe('VehicleListBody', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockGoBack.mockClear();
        mockReload.mockClear();
        mockUsePublicVehicles.mockReturnValue({
            vehicles: [] as PublicVehicle[],
            loading: false,
            error: '',
            reload: mockReload,
        });
    });

    it('renders an empty state when there are no vehicles', () => {
        const { getByText } = renderWithProviders(<VehicleListBody />);
        expect(getByText('vehicle-list-empty-title')).toBeTruthy();
    });

    it('renders a card per vehicle and calls the driver phone on press', () => {
        const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        mockUsePublicVehicles.mockReturnValue({
            vehicles: [
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
            ] as PublicVehicle[],
            loading: false,
            error: '',
            reload: mockReload,
        });

        const { getByText, getByTestId } = renderWithProviders(<VehicleListBody />);

        expect(getByText('Mercedes E-Class')).toBeTruthy();
        expect(getByText('CB1234AA')).toBeTruthy();
        expect(getByTestId('vehicle-image-1').props.source).toEqual({
            uri: 'https://example.com/mercedes.jpg',
        });

        fireEvent.press(getByTestId('vehicle-call-1'));
        expect(openURL).toHaveBeenCalledWith('tel:+359888111222');

        openURL.mockRestore();
    });

    it('renders a placeholder when the vehicle has no imageUrl', () => {
        mockUsePublicVehicles.mockReturnValue({
            vehicles: [
                {
                    id: 5,
                    brand: 'BMW',
                    model: '7',
                    licensePlate: 'CB5555KM',
                    vehicleType: VehicleType.PROM,
                },
            ] as PublicVehicle[],
            loading: false,
            error: '',
            reload: mockReload,
        });

        const { getByTestId, queryByTestId } = renderWithProviders(<VehicleListBody />);

        expect(getByTestId('vehicle-image-placeholder-5')).toBeTruthy();
        expect(queryByTestId('vehicle-image-5')).toBeNull();
    });

    it('disables the call button when no driver phone is available', () => {
        const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        mockUsePublicVehicles.mockReturnValue({
            vehicles: [
                {
                    id: 2,
                    brand: 'BMW',
                    model: '7',
                    licensePlate: 'CB5555KM',
                    vehicleType: VehicleType.PROM,
                },
            ] as PublicVehicle[],
            loading: false,
            error: '',
            reload: mockReload,
        });

        const { getByTestId } = renderWithProviders(<VehicleListBody />);

        fireEvent.press(getByTestId('vehicle-call-2'));
        expect(openURL).not.toHaveBeenCalled();

        openURL.mockRestore();
    });

    it('renders an error state with retry that triggers reload', () => {
        mockUsePublicVehicles.mockReturnValue({
            vehicles: [] as PublicVehicle[],
            loading: false,
            error: 'Network down',
            reload: mockReload,
        });

        const { getByText, getByTestId } = renderWithProviders(<VehicleListBody />);

        expect(getByText('Network down')).toBeTruthy();
        fireEvent.press(getByTestId('vehicle-list-retry'));
        expect(mockReload).toHaveBeenCalled();
    });

    it('back button calls navigation.goBack', () => {
        const { getByTestId } = renderWithProviders(<VehicleListBody />);
        fireEvent.press(getByTestId('vehicle-list-back'));
        expect(mockGoBack).toHaveBeenCalled();
    });
});
