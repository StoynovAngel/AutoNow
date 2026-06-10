import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import AddressSearch from '../AddressSearch';

jest.mock('../../../services/mapboxService', () => ({
    searchAddress: jest.fn(),
}));

import { searchAddress } from '../../../services/mapboxService';
const mockSearch = searchAddress as jest.Mock;

const sampleSuggestion = {
    id: 'place.1',
    placeName: 'Vitosha Blvd 100, Sofia, Bulgaria',
    coordinate: { latitude: 42.69, longitude: 23.32 },
};

describe('AddressSearch', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockSearch.mockReset();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it('does not call the API for queries shorter than 2 characters', async () => {
        const { getByTestId } = renderWithProviders(
            <AddressSearch onSelect={jest.fn()} onClear={jest.fn()} debounceMs={100} />,
        );
        fireEvent.changeText(getByTestId('address-input'), 'a');
        await act(async () => {
            jest.advanceTimersByTime(150);
        });
        expect(mockSearch).not.toHaveBeenCalled();
    });

    it('debounces calls — only one request after rapid typing', async () => {
        mockSearch.mockResolvedValue([]);
        const { getByTestId } = renderWithProviders(
            <AddressSearch onSelect={jest.fn()} onClear={jest.fn()} debounceMs={300} />,
        );
        const input = getByTestId('address-input');
        fireEvent.changeText(input, 'Vi');
        fireEvent.changeText(input, 'Vit');
        fireEvent.changeText(input, 'Vito');
        fireEvent.changeText(input, 'Vitosha');

        await act(async () => {
            jest.advanceTimersByTime(150);
        });
        expect(mockSearch).not.toHaveBeenCalled();

        await act(async () => {
            jest.advanceTimersByTime(200);
        });
        expect(mockSearch).toHaveBeenCalledTimes(1);
        expect(mockSearch).toHaveBeenCalledWith('Vitosha', undefined);
    });

    it('renders suggestions returned by the service', async () => {
        mockSearch.mockResolvedValue([sampleSuggestion]);
        const { getByTestId, findByTestId } = renderWithProviders(
            <AddressSearch onSelect={jest.fn()} onClear={jest.fn()} debounceMs={100} />,
        );
        fireEvent.changeText(getByTestId('address-input'), 'Vitosha');

        await act(async () => {
            jest.advanceTimersByTime(150);
        });
        jest.useRealTimers();
        const suggestion = await findByTestId('address-suggestion-place.1');
        expect(suggestion).toBeTruthy();
    });

    it('calls onSelect with the chosen suggestion', async () => {
        mockSearch.mockResolvedValue([sampleSuggestion]);
        const onSelect = jest.fn();
        const { getByTestId, findByTestId } = renderWithProviders(
            <AddressSearch onSelect={onSelect} onClear={jest.fn()} debounceMs={100} />,
        );
        fireEvent.changeText(getByTestId('address-input'), 'Vitosha');
        await act(async () => {
            jest.advanceTimersByTime(150);
        });
        jest.useRealTimers();
        const suggestion = await findByTestId('address-suggestion-place.1');
        fireEvent.press(suggestion);
        expect(onSelect).toHaveBeenCalledWith(sampleSuggestion);
    });

    it('shows the selected address with a clear button when one is selected', () => {
        const onClear = jest.fn();
        const { getByTestId, getByText } = renderWithProviders(
            <AddressSearch
                selected={sampleSuggestion}
                onSelect={jest.fn()}
                onClear={onClear}
            />,
        );
        expect(getByText(sampleSuggestion.placeName)).toBeTruthy();
        fireEvent.press(getByTestId('address-clear'));
        expect(onClear).toHaveBeenCalled();
    });

    it('forwards proximity bias to the search service', async () => {
        mockSearch.mockResolvedValue([]);
        const proximity = { latitude: 42.7, longitude: 23.3 };
        const { getByTestId } = renderWithProviders(
            <AddressSearch
                proximity={proximity}
                onSelect={jest.fn()}
                onClear={jest.fn()}
                debounceMs={50}
            />,
        );
        fireEvent.changeText(getByTestId('address-input'), 'park');
        await act(async () => {
            jest.advanceTimersByTime(80);
        });
        expect(mockSearch).toHaveBeenCalledWith('park', proximity);
    });
});
