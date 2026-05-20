import { renderWithProviders } from '../../test-utils/renderWithProviders';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
    it('renders the title and the search-off icon', () => {
        const { getByText, getByTestId } = renderWithProviders(<EmptyState serviceName="Taxi" />);

        expect(getByText('no-companies-found')).toBeTruthy();
        expect(getByTestId('icon-search-off')).toBeTruthy();
    });

    it('renders the description (passes serviceName as interpolation arg)', () => {
        const { getByText } = renderWithProviders(<EmptyState serviceName="Taxi" />);
        // The mock t() returns the key itself; we just confirm the line renders without throwing.
        expect(getByText('no-companies-description')).toBeTruthy();
    });

    it('renders even when serviceName is undefined', () => {
        const { getByText } = renderWithProviders(<EmptyState serviceName={undefined} />);
        expect(getByText('no-companies-found')).toBeTruthy();
    });
});
