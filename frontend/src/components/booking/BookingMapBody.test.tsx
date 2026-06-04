import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import BookingMapBody from './BookingMapBody';
import { AuthContext } from '../../services/AuthContext';
import type { AuthContextType, User } from '../../types/auth';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockPopToTop = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack, popToTop: mockPopToTop }),
    useRoute: () => ({
        params: {
            companyId: 1,
            vehicleType: 'TAXI',
            preferences: { vehicleClass: 'STANDARD' },
        },
    }),
}));

jest.mock('../../services/mapboxService', () => ({
    getRoute: jest.fn(),
    searchAddress: jest.fn(),
}));

jest.mock('../../services/orderService', () => ({
    createOrder: jest.fn(),
    estimateOrder: jest.fn(),
}));

const pickup = {
    id: 'p',
    placeName: 'Pickup',
    coordinate: { latitude: 42.69, longitude: 23.32 },
};
const destination = {
    id: 'd',
    placeName: 'Destination',
    coordinate: { latitude: 42.71, longitude: 23.33 },
};

jest.mock('./AddressSearch', () => {
    const ReactImpl = jest.requireActual('react');
    const RN = jest.requireActual('react-native');
    const Mock = ({ onSelect, testID }: { onSelect: (s: typeof pickup) => void; testID?: string }) =>
        ReactImpl.createElement(
            RN.Pressable,
            {
                testID: `${testID}-select`,
                onPress: () => onSelect(testID === 'pickup-search' ? pickup : destination),
            },
            ReactImpl.createElement(RN.Text, null, 'select'),
        );
    return { __esModule: true, default: Mock };
});

import { getRoute } from '../../services/mapboxService';
import { estimateOrder } from '../../services/orderService';

const mockGetRoute = getRoute as jest.Mock;
const mockEstimate = estimateOrder as jest.Mock;

const renderWithAuth = (user: User | null = { id: 1, username: 'a@b.c', sub: 'a@b.c', roles: [] }) => {
    const auth: AuthContextType = {
        user,
        loading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
    };
    return renderWithProviders(
        <AuthContext.Provider value={auth}>
            <BookingMapBody />
        </AuthContext.Provider>,
    );
};

const selectBothAddresses = (getByTestId: (id: string) => ReturnType<typeof fireEvent>) => {
    fireEvent.press(getByTestId('pickup-search-select'));
    fireEvent.press(getByTestId('destination-search-select'));
};

describe('BookingMapBody — estimate display', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not call estimate before pickup+destination are selected', () => {
        renderWithAuth();
        expect(mockEstimate).not.toHaveBeenCalled();
    });

    it('fetches and displays the estimate once route is available', async () => {
        mockGetRoute.mockResolvedValue({
            distanceKm: 5.2,
            durationMinutes: 12,
            geometry: { type: 'LineString', coordinates: [] },
        });
        mockEstimate.mockResolvedValue({ estimatedPrice: 14.5, currency: 'EUR', distanceKm: 5.2 });

        const { getByTestId } = renderWithAuth();
        await act(async () => {
            selectBothAddresses(getByTestId as never);
        });

        await waitFor(() =>
            expect(mockEstimate).toHaveBeenCalledWith({
                vehicleType: 'TAXI',
                distanceKm: 5.2,
                vehicleClass: 'STANDARD',
            }),
        );
        await waitFor(() => {
            expect(getByTestId('estimate-price').props.children.join('')).toContain('14.50');
        });
    });

    it('shows the failure message when estimateOrder rejects', async () => {
        mockGetRoute.mockResolvedValue({
            distanceKm: 3,
            durationMinutes: 8,
            geometry: { type: 'LineString', coordinates: [] },
        });
        mockEstimate.mockRejectedValue(new Error('boom'));

        const { getByTestId } = renderWithAuth();
        await act(async () => {
            selectBothAddresses(getByTestId as never);
        });

        await waitFor(() => expect(getByTestId('estimate-error')).toBeTruthy());
    });

    it('does not call estimate when the route fails', async () => {
        mockGetRoute.mockRejectedValue(new Error('no route'));

        const { getByTestId, queryByTestId } = renderWithAuth();
        await act(async () => {
            selectBothAddresses(getByTestId as never);
        });

        await waitFor(() => expect(mockGetRoute).toHaveBeenCalled());
        expect(mockEstimate).not.toHaveBeenCalled();
        expect(queryByTestId('estimate-price')).toBeNull();
    });
});
