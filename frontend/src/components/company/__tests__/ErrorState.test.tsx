import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
    it('renders the error message and the retry button', () => {
        const { getByText, getByTestId } = renderWithProviders(
            <ErrorState error="Network down" onRetry={jest.fn()} />,
        );

        expect(getByText('Network down')).toBeTruthy();
        expect(getByText('error-loading')).toBeTruthy();
        expect(getByText('retry')).toBeTruthy();
        expect(getByTestId('icon-error-outline')).toBeTruthy();
    });

    it('calls onRetry when the retry button is pressed', () => {
        const onRetry = jest.fn();
        const { getByText } = renderWithProviders(<ErrorState error="boom" onRetry={onRetry} />);

        fireEvent.press(getByText('retry'));

        expect(onRetry).toHaveBeenCalledTimes(1);
    });
});
