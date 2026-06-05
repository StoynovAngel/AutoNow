import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import VehicleClassPicker from './VehicleClassPicker';

describe('VehicleClassPicker', () => {
    it('selecting a class fires onChange with that class', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <VehicleClassPicker onChange={onChange} />,
        );
        fireEvent.press(getByTestId('vehicle-class-PREMIUM'));
        expect(onChange).toHaveBeenCalledWith('PREMIUM');
    });

    it('tapping the selected class clears the value', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <VehicleClassPicker value="XL" onChange={onChange} />,
        );
        fireEvent.press(getByTestId('vehicle-class-XL'));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it('STANDARD is locked when passengerCount >= 6', () => {
        const onChange = jest.fn();
        const { getByTestId, getByText } = renderWithProviders(
            <VehicleClassPicker passengerCount={6} onChange={onChange} />,
        );
        fireEvent.press(getByTestId('vehicle-class-STANDARD'));
        expect(onChange).not.toHaveBeenCalled();
        expect(getByText('booking-class-locked-xl')).toBeTruthy();
    });

    it('STANDARD is selectable when passengerCount < 6', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <VehicleClassPicker passengerCount={4} onChange={onChange} />,
        );
        fireEvent.press(getByTestId('vehicle-class-STANDARD'));
        expect(onChange).toHaveBeenCalledWith('STANDARD');
    });
});
