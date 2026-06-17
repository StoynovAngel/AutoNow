import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddDriverForm from '../AddDriverForm';

vi.mock('../../vehicle/VehicleImageUpload', () => ({
    default: () => <div data-testid="image-upload" />,
}));

const noop = vi.fn();

describe('AddDriverForm — hideCompanyId prop', () => {
    it('shows Company ID field by default', () => {
        render(<AddDriverForm onSubmit={noop} onCancel={noop} />);
        expect(screen.getByLabelText(/company id/i)).toBeInTheDocument();
    });

    it('hides Company ID field when hideCompanyId is true', () => {
        render(<AddDriverForm onSubmit={noop} onCancel={noop} hideCompanyId />);
        expect(screen.queryByLabelText(/company id/i)).not.toBeInTheDocument();
    });
});
