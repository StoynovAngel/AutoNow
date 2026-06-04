import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import BookingWaitingBody from './BookingWaitingBody';

const mockReplace = jest.fn();
const mockReset = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ replace: mockReplace, reset: mockReset, navigate: mockNavigate }),
    useRoute: () => ({ params: { orderId: 42 } }),
}));

jest.mock('../../services/orderService', () => ({
    getOrderById: jest.fn(),
    cancelOrder: jest.fn(),
}));

import { getOrderById, cancelOrder } from '../../services/orderService';

const mockGetOrder = getOrderById as jest.Mock;
const mockCancel = cancelOrder as jest.Mock;

const baseOrder = {
    id: 42,
    userId: 1,
    vehicleType: 'TAXI' as const,
    pickupAddress: 'A',
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffAddress: 'B',
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    status: 'CREATED' as const,
};

const driverInfo = {
    id: 5,
    firstName: 'Иван',
    lastName: 'Петров',
    phoneNumber: '+359888123456',
};

const vehicleInfo = {
    id: 7,
    licensePlate: 'CA1234AB',
    brand: 'Toyota',
    model: 'Corolla',
};

describe('BookingWaitingBody', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows the searching state for CREATED orders', async () => {
        mockGetOrder.mockResolvedValue({ ...baseOrder, status: 'CREATED' });

        const { findByTestId } = renderWithProviders(<BookingWaitingBody />);

        const title = await findByTestId('waiting-status-title');
        expect(title.props.children).toBe('booking-waiting-searching');
    });

    it('shows driver info and call button when ACCEPTED', async () => {
        mockGetOrder.mockResolvedValue({
            ...baseOrder,
            status: 'ACCEPTED',
            driver: driverInfo,
            vehicle: vehicleInfo,
        });

        const { findByTestId } = renderWithProviders(<BookingWaitingBody />);

        await findByTestId('waiting-driver');
        const callBtn = await findByTestId('waiting-call');

        const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        fireEvent.press(callBtn);
        expect(openSpy).toHaveBeenCalledWith('tel:+359888123456');
        openSpy.mockRestore();
    });

    it('hides cancel button while IN_PROGRESS', async () => {
        mockGetOrder.mockResolvedValue({
            ...baseOrder,
            status: 'IN_PROGRESS',
            driver: driverInfo,
            vehicle: vehicleInfo,
        });

        const { findByTestId, queryByTestId } = renderWithProviders(<BookingWaitingBody />);

        await findByTestId('waiting-driver');
        expect(queryByTestId('waiting-cancel')).toBeNull();
    });

    it('navigates to bookingComplete when status becomes COMPLETED', async () => {
        mockGetOrder.mockResolvedValue({
            ...baseOrder,
            status: 'COMPLETED',
            driver: driverInfo,
        });

        renderWithProviders(<BookingWaitingBody />);

        await waitFor(() =>
            expect(mockReplace).toHaveBeenCalledWith('bookingComplete', { orderId: 42 }),
        );
    });

    it('resets to home when status becomes CANCELED', async () => {
        mockGetOrder.mockResolvedValue({ ...baseOrder, status: 'CANCELED' });

        renderWithProviders(<BookingWaitingBody />);

        await waitFor(() =>
            expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'home' }] }),
        );
    });

    it('shows the poll error message when fetching fails', async () => {
        mockGetOrder.mockRejectedValue(new Error('network'));

        const { findByTestId } = renderWithProviders(<BookingWaitingBody />);

        await findByTestId('waiting-error');
    });

    it('calls cancelOrder and navigates home when user cancels', async () => {
        mockGetOrder.mockResolvedValue({ ...baseOrder, status: 'CREATED' });
        mockCancel.mockResolvedValue({ ...baseOrder, status: 'CANCELED' });

        const { findByTestId } = renderWithProviders(<BookingWaitingBody />);

        const cancelBtn = await findByTestId('waiting-cancel');
        await act(async () => {
            fireEvent.press(cancelBtn);
        });

        expect(mockCancel).toHaveBeenCalledWith(42);
        await waitFor(() =>
            expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'home' }] }),
        );
    });

    it('shows the re-assignment banner when the driver changes between polls', async () => {
        mockGetOrder.mockReset();
        const driverA = { ...driverInfo, id: 5 };
        const driverB = { ...driverInfo, id: 9, firstName: 'Георги' };

        mockGetOrder
            .mockResolvedValueOnce({ ...baseOrder, status: 'ACCEPTED', driver: driverA })
            .mockResolvedValue({ ...baseOrder, status: 'ACCEPTED', driver: driverB });

        const { findByTestId, queryByTestId } = renderWithProviders(<BookingWaitingBody />);

        await findByTestId('waiting-driver');
        expect(queryByTestId('waiting-reassigned')).toBeNull();

        await waitFor(
            () => expect(mockGetOrder).toHaveBeenCalledTimes(2),
            { timeout: 6500, interval: 100 },
        );
        await findByTestId('waiting-reassigned');
    }, 10000);

    it('does not show the banner on the very first poll (no previous driver)', async () => {
        mockGetOrder.mockResolvedValue({
            ...baseOrder,
            status: 'ACCEPTED',
            driver: driverInfo,
        });

        const { findByTestId, queryByTestId } = renderWithProviders(<BookingWaitingBody />);

        await findByTestId('waiting-driver');
        expect(queryByTestId('waiting-reassigned')).toBeNull();
    });
});
