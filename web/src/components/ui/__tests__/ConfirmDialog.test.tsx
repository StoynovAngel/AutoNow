import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../ConfirmDialog';

const baseProps = {
    title: 'Delete Driver',
    message: 'Are you sure?',
    onConfirm: () => {},
    onCancel: () => {},
};

describe('ConfirmDialog', () => {
    it('renders nothing when open is false', () => {
        render(<ConfirmDialog open={false} {...baseProps} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders title, message, and default buttons when open', () => {
        render(<ConfirmDialog open {...baseProps} />);
        expect(screen.getByText('Delete Driver')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('calls onConfirm when confirm button clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(<ConfirmDialog open {...baseProps} onConfirm={onConfirm} />);
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<ConfirmDialog open {...baseProps} onCancel={onCancel} />);
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('uses custom confirmLabel and cancelLabel when provided', () => {
        render(<ConfirmDialog open {...baseProps} confirmLabel="Remove" cancelLabel="Keep" />);
        expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    });
});
