import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyForm from '../CompanyForm';
import type { Company } from '../CompanyInfo';

const buildCompany = (overrides: Partial<Company> = {}): Company => ({
    id: 1,
    name: 'Old Co',
    address: '1 Old St',
    phone: '+359888000111',
    email: 'old@example.com',
    description: 'old desc',
    companyType: 'TAXI',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ...overrides,
});

describe('CompanyForm', () => {
    it('submits trimmed payload on valid form fill', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        const onCancel = vi.fn();

        render(<CompanyForm submitLabel="Add" submittingLabel="Adding..." onSubmit={onSubmit} onCancel={onCancel} />);

        fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: '  New Co  ' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '+359888123456' } });
        fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Sofia' } });
        fireEvent.change(screen.getByLabelText(/Company Type/i), { target: { value: 'LOGISTICS' } });

        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'New Co',
                email: 'new@example.com',
                phone: '+359888123456',
                address: 'Sofia',
                companyType: 'LOGISTICS',
                description: undefined,
            });
        });
    });

    it('pre-fills fields from initialData', () => {
        render(
            <CompanyForm
                initialData={buildCompany({ name: 'Editable', companyType: 'AMBULANCE' })}
                submitLabel="Save"
                submittingLabel="Saving..."
                onSubmit={vi.fn()}
                onCancel={vi.fn()}
            />,
        );

        expect((screen.getByLabelText(/Company Name/i) as HTMLInputElement).value).toBe('Editable');
        expect((screen.getByLabelText(/Company Type/i) as HTMLSelectElement).value).toBe('AMBULANCE');
    });

    it('renders an error alert when onSubmit rejects', async () => {
        const onSubmit = vi.fn().mockRejectedValue(new Error('Server says no'));

        render(
            <CompanyForm
                initialData={buildCompany()}
                submitLabel="Save"
                submittingLabel="Saving..."
                onSubmit={onSubmit}
                onCancel={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Server says no');
        });
    });

    it('calls onCancel when Cancel is clicked', () => {
        const onCancel = vi.fn();
        render(<CompanyForm submitLabel="Add" submittingLabel="Adding..." onSubmit={vi.fn()} onCancel={onCancel} />);

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
