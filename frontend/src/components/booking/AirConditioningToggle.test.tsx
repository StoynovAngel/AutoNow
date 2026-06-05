import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import AirConditioningToggle from './AirConditioningToggle';

describe('AirConditioningToggle', () => {
    it('toggling on fires onChange with true', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <AirConditioningToggle onChange={onChange} />,
        );
        fireEvent(getByTestId('ac-toggle'), 'valueChange', true);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggling off fires onChange with undefined', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <AirConditioningToggle value={true} onChange={onChange} />,
        );
        fireEvent(getByTestId('ac-toggle'), 'valueChange', false);
        expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it('reflects value=true as a switched-on toggle', () => {
        const { getByTestId } = renderWithProviders(
            <AirConditioningToggle value={true} onChange={jest.fn()} />,
        );
        expect(getByTestId('ac-toggle').props.value).toBe(true);
    });

    it('reflects undefined value as a switched-off toggle', () => {
        const { getByTestId } = renderWithProviders(
            <AirConditioningToggle onChange={jest.fn()} />,
        );
        expect(getByTestId('ac-toggle').props.value).toBe(false);
    });
});
