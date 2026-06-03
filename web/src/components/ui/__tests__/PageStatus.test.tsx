import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageStatus from '../PageStatus';

vi.mock('../Navigation', () => ({
    default: () => <nav data-testid="nav" />,
}));

describe('PageStatus', () => {
    it('renders spinner and Loading text in loading state', () => {
        render(<PageStatus state="loading" />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByTestId('nav')).toBeInTheDocument();
    });

    it('renders title, message, and retry button in error state', async () => {
        const user = userEvent.setup();
        const onRetry = vi.fn();
        render(<PageStatus state="error" title="Error Loading Drivers" message="Network down" onRetry={onRetry} />);

        expect(screen.getByText('Error Loading Drivers')).toBeInTheDocument();
        expect(screen.getByText('Network down')).toBeInTheDocument();
        const retryBtn = screen.getByRole('button', { name: /retry/i });
        await user.click(retryBtn);
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('omits retry button when onRetry not provided', () => {
        render(<PageStatus state="error" message="oops" />);
        expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
    });

    it('uses default title when none provided in error state', () => {
        render(<PageStatus state="error" message="oops" />);
        expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
    });

    it('error card has assertive alert role for screen readers', () => {
        render(<PageStatus state="error" message="oops" />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
});
