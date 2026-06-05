import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import Body from './Body';
import { VehicleType } from '../../types/vehicle';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
    useRoute: () => ({ params: { companyId: 42, vehicleType: 'TAXI' } }),
}));

describe('booking Body', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockGoBack.mockClear();
    });

    it('Skip navigates to bookingMap with empty preferences', () => {
        const { getByTestId } = renderWithProviders(<Body />);
        fireEvent.press(getByTestId('booking-skip'));
        expect(mockNavigate).toHaveBeenCalledWith('bookingMap', {
            companyId: 42,
            vehicleType: VehicleType.TAXI,
            preferences: {},
        });
    });

    it('Continue navigates to bookingMap with collected preferences', () => {
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('passengers-increment'));
        fireEvent.press(getByTestId('luggage-increment'));
        fireEvent.press(getByTestId('vehicle-class-PREMIUM'));
        fireEvent(getByTestId('ac-toggle'), 'valueChange', true);

        fireEvent.press(getByTestId('booking-continue'));

        expect(mockNavigate).toHaveBeenCalledWith('bookingMap', {
            companyId: 42,
            vehicleType: VehicleType.TAXI,
            preferences: {
                passengerCount: 1,
                luggageCount: 0,
                vehicleClass: 'PREMIUM',
                requiresAirConditioning: true,
            },
        });
    });

    it('Back triggers navigation.goBack', () => {
        const { getByTestId } = renderWithProviders(<Body />);
        fireEvent.press(getByTestId('booking-back'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('promotes STANDARD to XL when passenger count crosses the threshold', () => {
        const { getByTestId } = renderWithProviders(<Body />);

        fireEvent.press(getByTestId('vehicle-class-STANDARD'));
        for (let i = 0; i < 6; i += 1) {
            fireEvent.press(getByTestId('passengers-increment'));
        }
        fireEvent.press(getByTestId('booking-continue'));

        expect(mockNavigate).toHaveBeenCalledWith('bookingMap', {
            companyId: 42,
            vehicleType: VehicleType.TAXI,
            preferences: expect.objectContaining({
                passengerCount: 6,
                vehicleClass: 'XL',
            }),
        });
    });
});
