import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DriverRatingsInfo from '../DriverRatingsInfo';
import type { Rating } from '../../../services/rating/ratingService';

const rating = (id: number, value = 5, comment?: string): Rating => ({
    id,
    orderId: id * 10,
    rating: value,
    comment,
    createdAt: '2026-06-01T00:00:00Z',
});

describe('DriverRatingsInfo', () => {
    it('shows no-driver state when hasDriver is false', () => {
        render(<DriverRatingsInfo ratings={[]} hasDriver={false} />);
        expect(screen.getByText('Select a driver to view reviews')).toBeInTheDocument();
    });

    it('shows empty state when driver has no ratings', () => {
        render(<DriverRatingsInfo ratings={[]} hasDriver={true} />);
        expect(screen.getByText('No reviews yet')).toBeInTheDocument();
        expect(screen.getByText("This driver hasn't received any reviews")).toBeInTheDocument();
    });

    it('renders the rating count badge and average', () => {
        render(<DriverRatingsInfo ratings={[rating(1, 5), rating(2, 3)]} hasDriver={true} />);
        expect(screen.getByText('Reviews')).toBeInTheDocument();
        expect(screen.getByText('4.0')).toBeInTheDocument();
        expect(screen.getByText('2 reviews')).toBeInTheDocument();
    });

    it('uses singular form for a single review', () => {
        render(<DriverRatingsInfo ratings={[rating(1, 5)]} hasDriver={true} />);
        expect(screen.getByText('1 review')).toBeInTheDocument();
    });

    it('renders comments when provided', () => {
        render(<DriverRatingsInfo ratings={[rating(1, 5, 'Excellent driver')]} hasDriver={true} />);
        expect(screen.getByText('Excellent driver')).toBeInTheDocument();
    });

    it('does not render a comment paragraph when comment is missing', () => {
        const { container } = render(<DriverRatingsInfo ratings={[rating(1, 5)]} hasDriver={true} />);
        expect(container.querySelectorAll('p').length).toBeLessThan(3);
    });

    it('formats createdAt as a locale date', () => {
        render(<DriverRatingsInfo ratings={[rating(1, 5)]} hasDriver={true} />);
        const expected = new Date('2026-06-01T00:00:00Z').toLocaleDateString();
        expect(screen.getByText(expected)).toBeInTheDocument();
    });

    it('computes average across multiple ratings', () => {
        render(<DriverRatingsInfo ratings={[rating(1, 5), rating(2, 4), rating(3, 3)]} hasDriver={true} />);
        expect(screen.getByText('4.0')).toBeInTheDocument();
    });
});
