import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import BookingCompleteBody from '../BookingCompleteBody';

const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ reset: mockReset }),
    useRoute: () => ({ params: { orderId: 99 } }),
}));

jest.mock('../../../services/orderService', () => ({
    getOrderById: jest.fn(),
}));

jest.mock('../../../services/ratingService', () => ({
    submitRating: jest.fn(),
}));

import { getOrderById } from '../../../services/orderService';
import { submitRating } from '../../../services/ratingService';

const mockGetOrder = getOrderById as jest.Mock;
const mockSubmit = submitRating as jest.Mock;

const driverInfo = {
    id: 5,
    firstName: 'Иван',
    lastName: 'Петров',
    phoneNumber: '+359888123456',
};

const completedOrder = {
    id: 99,
    userId: 1,
    vehicleType: 'TAXI' as const,
    pickupAddress: 'Sofia Center',
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffAddress: 'Sofia Airport',
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    status: 'COMPLETED' as const,
    distanceKm: 12.4,
    finalPrice: 18.75,
    driver: driverInfo,
};

describe('BookingCompleteBody', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows the order summary with final price', async () => {
        mockGetOrder.mockResolvedValue(completedOrder);

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        await findByTestId('complete-summary');
        const price = await findByTestId('complete-price');
        expect(price.props.children.join('')).toContain('18.75');
    });

    it('falls back to estimatedPrice when finalPrice is missing', async () => {
        mockGetOrder.mockResolvedValue({
            ...completedOrder,
            finalPrice: undefined,
            estimatedPrice: 14.2,
        });

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        const price = await findByTestId('complete-price');
        expect(price.props.children.join('')).toContain('14.20');
    });

    it('disables submit until at least one star is selected', async () => {
        mockGetOrder.mockResolvedValue(completedOrder);

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        const submit = await findByTestId('complete-submit');
        expect(submit.props.accessibilityState?.disabled).toBe(true);

        fireEvent.press(await findByTestId('star-4'));
        expect(submit.props.accessibilityState?.disabled).toBe(false);
    });

    it('submits the rating with stars and trimmed comment, then navigates home', async () => {
        mockGetOrder.mockResolvedValue(completedOrder);
        mockSubmit.mockResolvedValue({ id: 1, orderId: 99, rating: 5 });

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        fireEvent.press(await findByTestId('star-5'));
        fireEvent.changeText(await findByTestId('rating-comment'), '  great driver  ');

        await act(async () => {
            fireEvent.press(await findByTestId('complete-submit'));
        });

        expect(mockSubmit).toHaveBeenCalledWith({
            orderId: 99,
            rating: 5,
            comment: 'great driver',
        });
        await waitFor(() =>
            expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'home' }] }),
        );
    });

    it('omits comment when empty / whitespace', async () => {
        mockGetOrder.mockResolvedValue(completedOrder);
        mockSubmit.mockResolvedValue({ id: 1, orderId: 99, rating: 4 });

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        fireEvent.press(await findByTestId('star-4'));
        fireEvent.changeText(await findByTestId('rating-comment'), '   ');

        await act(async () => {
            fireEvent.press(await findByTestId('complete-submit'));
        });

        expect(mockSubmit).toHaveBeenCalledWith({ orderId: 99, rating: 4 });
    });

    it('skip navigates home without calling submitRating', async () => {
        mockGetOrder.mockResolvedValue(completedOrder);

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        fireEvent.press(await findByTestId('complete-skip'));
        expect(mockSubmit).not.toHaveBeenCalled();
        expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'home' }] });
    });

    it('shows the rating error and stays on screen when submission fails', async () => {
        mockGetOrder.mockResolvedValue(completedOrder);
        mockSubmit.mockRejectedValue(new Error('boom'));

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        fireEvent.press(await findByTestId('star-3'));
        await act(async () => {
            fireEvent.press(await findByTestId('complete-submit'));
        });

        await findByTestId('rating-error');
        expect(mockReset).not.toHaveBeenCalled();
    });

    it('shows the load error when the order cannot be fetched', async () => {
        mockGetOrder.mockRejectedValue(new Error('nope'));

        const { findByTestId } = renderWithProviders(<BookingCompleteBody />);

        await findByTestId('complete-load-error');
    });

    it('hides the rating block when no driver is on the order', async () => {
        mockGetOrder.mockResolvedValue({ ...completedOrder, driver: undefined });

        const { findByTestId, queryByTestId } = renderWithProviders(<BookingCompleteBody />);

        await findByTestId('complete-summary');
        expect(queryByTestId('complete-rate')).toBeNull();
        expect(queryByTestId('complete-submit')).toBeNull();
    });
});
