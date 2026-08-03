import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import BookingMapBody from '../BookingMapBody';
import { AuthContext } from '../../../services/AuthContext';
import type { AuthContextType, User } from '../../../types/auth';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockPopToTop = jest.fn();

const mockRouteParams: { params: Record<string, unknown> } = {
    params: {
        companyId: 1,
        vehicleType: 'TAXI',
        preferences: {},
    },
};

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack, popToTop: mockPopToTop }),
    useRoute: () => mockRouteParams,
}));

jest.mock('../../../services/mapboxService', () => ({
    getRoute: jest.fn(),
    searchAddress: jest.fn(),
}));

jest.mock('../../../services/orderService', () => ({
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

jest.mock('../AddressSearch', () => {
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

import { getRoute } from '../../../services/mapboxService';
import { estimateOrder } from '../../../services/orderService';

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

const selectBothAddresses = (getByTestId: ReturnType<typeof renderWithAuth>['getByTestId']) => {
    fireEvent.press(getByTestId('pickup-search-select'));
    fireEvent.press(getByTestId('destination-search-select'));
};

describe('BookingMapBody — logistics estimate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRouteParams.params = {
            companyId: 1,
            vehicleType: 'LOGISTICS',
            preferences: { companyAddress: '1 Depot St' },
        };
    });

    afterAll(() => {
        mockRouteParams.params = { companyId: 1, vehicleType: 'TAXI', preferences: {} };
    });

    it('fires estimate as soon as route is ready, without waiting for weight input', async () => {
        const { searchAddress } = jest.requireMock('../../../services/mapboxService');
        (searchAddress as jest.Mock).mockResolvedValue([pickup]);

        mockGetRoute.mockResolvedValue({
            distanceKm: 8.0,
            durationMinutes: 20,
            geometry: { type: 'LineString', coordinates: [] },
        });
        mockEstimate.mockResolvedValue({ estimatedPrice: 22.40, currency: 'EUR', distanceKm: 8.0 });

        const { getByTestId } = renderWithAuth();

        await act(async () => {
            fireEvent.press(getByTestId('destination-search-select'));
        });

        await waitFor(() =>
            expect(mockEstimate).toHaveBeenCalledWith({
                vehicleType: 'LOGISTICS',
                distanceKm: 8.0,
            }),
        );
        await waitFor(() => {
            expect(getByTestId('estimate-price').props.children.join('')).toContain('22.40');
        });
    });

    it('re-runs estimate with weightKg when weight is entered', async () => {
        const { searchAddress } = jest.requireMock('../../../services/mapboxService');
        (searchAddress as jest.Mock).mockResolvedValue([pickup]);

        mockGetRoute.mockResolvedValue({
            distanceKm: 8.0,
            durationMinutes: 20,
            geometry: { type: 'LineString', coordinates: [] },
        });
        mockEstimate
            .mockResolvedValueOnce({ estimatedPrice: 22.40, currency: 'EUR', distanceKm: 8.0 })
            .mockResolvedValue({ estimatedPrice: 34.90, currency: 'EUR', distanceKm: 8.0 });

        const { getByTestId } = renderWithAuth();

        await act(async () => {
            fireEvent.press(getByTestId('destination-search-select'));
        });

        await waitFor(() => expect(mockEstimate).toHaveBeenCalledTimes(1));

        await act(async () => {
            fireEvent.changeText(getByTestId('weight-input'), '50');
        });

        await waitFor(() =>
            expect(mockEstimate).toHaveBeenCalledWith({
                vehicleType: 'LOGISTICS',
                distanceKm: 8.0,
                weightKg: 50,
            }),
        );
        await waitFor(() => {
            expect(getByTestId('estimate-price').props.children.join('')).toContain('34.90');
        });
    });
});

describe('BookingMapBody — estimate display', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRouteParams.params = { companyId: 1, vehicleType: 'TAXI', preferences: {} };
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
            selectBothAddresses(getByTestId);
        });

        await waitFor(() =>
            expect(mockEstimate).toHaveBeenCalledWith({
                vehicleType: 'TAXI',
                distanceKm: 5.2,
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
            selectBothAddresses(getByTestId);
        });

        await waitFor(() => expect(getByTestId('estimate-error')).toBeTruthy());
    });

    it('does not call estimate when the route fails', async () => {
        mockGetRoute.mockRejectedValue(new Error('no route'));

        const { getByTestId, queryByTestId } = renderWithAuth();
        await act(async () => {
            selectBothAddresses(getByTestId);
        });

        await waitFor(() => expect(mockGetRoute).toHaveBeenCalled());
        expect(mockEstimate).not.toHaveBeenCalled();
        expect(queryByTestId('estimate-price')).toBeNull();
    });

    it('clears stale estimate and disables confirm while a new estimate is loading', async () => {
        mockGetRoute.mockResolvedValue({
            distanceKm: 5.2,
            durationMinutes: 12,
            geometry: { type: 'LineString', coordinates: [] },
        });

        let resolveEstimate: (v: unknown) => void = () => {};
        mockEstimate.mockImplementationOnce(
            () => new Promise((resolve) => {
                resolveEstimate = resolve;
            }),
        );

        const { getByTestId, queryByTestId } = renderWithAuth();
        await act(async () => {
            selectBothAddresses(getByTestId);
        });

        await waitFor(() => expect(getByTestId('estimate-loading')).toBeTruthy());
        expect(queryByTestId('estimate-price')).toBeNull();
        expect(getByTestId('booking-confirm').props.accessibilityState?.disabled).toBe(true);

        await act(async () => {
            resolveEstimate({ estimatedPrice: 14.5, currency: 'EUR', distanceKm: 5.2 });
        });

        await waitFor(() => {
            expect(getByTestId('estimate-price').props.children.join('')).toContain('14.50');
        });
        expect(getByTestId('booking-confirm').props.accessibilityState?.disabled).toBeFalsy();
    });
});
