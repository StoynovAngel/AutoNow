import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCompanyModal from '../AddCompanyModal';
import { companyService } from '../../../services/company/companyService';

vi.mock('../../../services/company/companyService', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../../services/company/companyService')>();
    return {
        ...actual,
        companyService: {
            createCompanyWithAdmin: vi.fn(),
        },
    };
});

const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText(/Company Email/i), { target: { value: 'acme@co.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '+359888123456' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Sofia' } });
    fireEvent.change(screen.getByLabelText(/Admin Account Email/i), { target: { value: 'admin@co.com' } });
    fireEvent.change(screen.getByLabelText(/Admin Account Password/i), { target: { value: 'Password1' } });
};

describe('AddCompanyModal', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
    });

    it('creates company via single with-admin call and never touches accessToken', async () => {
        localStorage.setItem('accessToken', 'admin-token');
        vi.mocked(companyService.createCompanyWithAdmin).mockResolvedValue({ id: 1, name: 'Acme' });
        const onCreated = vi.fn();

        render(<AddCompanyModal show onClose={vi.fn()} onCreated={onCreated} />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Create Company/i }));

        await waitFor(() => {
            expect(companyService.createCompanyWithAdmin).toHaveBeenCalledTimes(1);
        });

        expect(companyService.createCompanyWithAdmin).toHaveBeenCalledWith({
            name: 'Acme',
            address: 'Sofia',
            phone: '+359888123456',
            email: 'acme@co.com',
            companyType: 'TAXI',
            description: undefined,
            adminEmail: 'admin@co.com',
            adminPassword: 'Password1',
        });
        // admin session preserved — the logout bug regression guard
        expect(localStorage.getItem('accessToken')).toBe('admin-token');
        expect(onCreated).toHaveBeenCalledTimes(1);
    });

    it('shows generated credentials after success', async () => {
        vi.mocked(companyService.createCompanyWithAdmin).mockResolvedValue({ id: 1 });

        render(<AddCompanyModal show onClose={vi.fn()} onCreated={vi.fn()} />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Create Company/i }));

        await waitFor(() => {
            expect(screen.getByText('Company Created')).toBeInTheDocument();
        });
        expect(screen.getByText('admin@co.com')).toBeInTheDocument();
    });

    it('renders error alert and keeps accessToken intact when creation fails', async () => {
        localStorage.setItem('accessToken', 'admin-token');
        vi.mocked(companyService.createCompanyWithAdmin).mockRejectedValue(new Error('boom'));

        render(<AddCompanyModal show onClose={vi.fn()} onCreated={vi.fn()} />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Create Company/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Failed to create company');
        });
        expect(localStorage.getItem('accessToken')).toBe('admin-token');
    });
});
