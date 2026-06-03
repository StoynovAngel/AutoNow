import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import Counter from './Counter';

describe('Counter', () => {
    it('renders em dash when value is undefined', () => {
        const { getByTestId } = renderWithProviders(
            <Counter label="Passengers" min={1} max={8} onChange={jest.fn()} testID="passengers" />,
        );
        expect(getByTestId('passengers-value').props.children).toBe('—');
    });

    it('increment from undefined sets value to min', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <Counter label="Passengers" min={1} max={8} onChange={onChange} testID="passengers" />,
        );
        fireEvent.press(getByTestId('passengers-increment'));
        expect(onChange).toHaveBeenCalledWith(1);
    });

    it('increment past max does not fire onChange', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <Counter label="Passengers" value={8} min={1} max={8} onChange={onChange} testID="passengers" />,
        );
        fireEvent.press(getByTestId('passengers-increment'));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('decrement at min returns to undefined', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <Counter label="Passengers" value={1} min={1} max={8} onChange={onChange} testID="passengers" />,
        );
        fireEvent.press(getByTestId('passengers-decrement'));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it('decrement above min decreases value', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <Counter label="Passengers" value={4} min={1} max={8} onChange={onChange} testID="passengers" />,
        );
        fireEvent.press(getByTestId('passengers-decrement'));
        expect(onChange).toHaveBeenCalledWith(3);
    });

    it('decrement when undefined does nothing', () => {
        const onChange = jest.fn();
        const { getByTestId } = renderWithProviders(
            <Counter label="Passengers" min={1} max={8} onChange={onChange} testID="passengers" />,
        );
        fireEvent.press(getByTestId('passengers-decrement'));
        expect(onChange).not.toHaveBeenCalled();
    });
});
