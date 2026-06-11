import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import LoadingState from '../LoadingState';

describe('LoadingState', () => {
    it('renders the spinner label', () => {
        const { getByText } = renderWithProviders(<LoadingState />);
        expect(getByText('loading-companies')).toBeTruthy();
    });
});
