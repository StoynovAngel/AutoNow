import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';

const Boom = () => {
    throw new Error('kaboom');
};

describe('ErrorBoundary', () => {
    it('renders children when no error is thrown', () => {
        const { getByText } = render(
            <ErrorBoundary>
                <Text>safe content</Text>
            </ErrorBoundary>,
        );
        expect(getByText('safe content')).toBeTruthy();
    });

    it('renders the fallback UI and the error message when a child throws', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByText } = render(
            <ErrorBoundary>
                <View>
                    <Boom />
                </View>
            </ErrorBoundary>,
        );

        expect(getByText('Something went wrong')).toBeTruthy();
        expect(getByText(/kaboom/)).toBeTruthy();

        errorSpy.mockRestore();
    });
});
