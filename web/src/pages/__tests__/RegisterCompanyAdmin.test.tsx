import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import RegisterCompanyAdmin from '../RegisterCompanyAdmin';
import { authService } from '../../services/auth/authService';
import { companyService } from '../../services/company/companyService';

vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({ login: vi.fn() }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../services/auth/authService', () => ({
    authService: { register: vi.fn() },
}));

vi.mock('../../services/company/companyService', () => ({
    companyService: {
        createCompany: vi.fn(),
        joinCompany: vi.fn(),
    },
    COMPANY_TYPES: ['TAXI', 'LOGISTICS', 'AMBULANCE', 'RENTAL', 'FUNERAL', 'PROM'],
}));

vi.mock('../../utils/jwt', () => ({
    decodeJWT: (token: string) =>
        token === 'bad-token'
            ? null
            : { sub: 'user@example.com', authorities: ['ROLE_COMPANY_ADMIN'], companyId: 1 },
}));

const VALID_JWT = 'header.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DT01QQU5ZX0FETUlOIl0sImNvbXBhbnlJZCI6MX0.sig';

function renderPage() {
    return render(
        <MemoryRouter>
            <RegisterCompanyAdmin />
        </MemoryRouter>
    );
}

async function fillStepOne(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/^email$/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /continue/i }));
}

async function fillStepTwo(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/company name/i), 'Acme Co');
    await user.type(screen.getByLabelText(/phone/i), '+359888123456');
    await user.type(screen.getByLabelText(/address/i), '1 Main St, Sofia');
}

describe('RegisterCompanyAdmin — step 1', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders step 1 heading', () => {
        renderPage();
        expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument();
    });

    it('shows password mismatch error without proceeding', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.type(screen.getByLabelText(/^email$/i), 'a@b.com');
        await user.type(screen.getByLabelText(/^password$/i), 'Password1');
        await user.type(screen.getByLabelText(/confirm password/i), 'Different1');
        await user.click(screen.getByRole('button', { name: /continue/i }));
        expect(screen.getByRole('alert')).toHaveTextContent(/passwords do not match/i);
        expect(screen.queryByText(/step 2 of 2/i)).not.toBeInTheDocument();
    });

    it('shows weak password error', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.type(screen.getByLabelText(/^email$/i), 'a@b.com');
        await user.type(screen.getByLabelText(/^password$/i), 'short');
        await user.type(screen.getByLabelText(/confirm password/i), 'short');
        await user.click(screen.getByRole('button', { name: /continue/i }));
        expect(screen.getByRole('alert')).toHaveTextContent(/8 characters/i);
    });

    it('advances to step 2 with valid credentials', async () => {
        const user = userEvent.setup();
        renderPage();
        await fillStepOne(user);
        expect(screen.getByText(/step 2 of 2/i)).toBeInTheDocument();
    });
});

describe('RegisterCompanyAdmin — step 2 / submit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls register, createCompany, joinCompany in sequence and navigates', async () => {
        vi.mocked(authService.register).mockResolvedValue({ token: VALID_JWT });
        vi.mocked(companyService.createCompany).mockResolvedValue({ id: 1, name: 'Acme Co' });
        vi.mocked(companyService.joinCompany).mockResolvedValue({ token: VALID_JWT });

        const user = userEvent.setup();
        renderPage();
        await fillStepOne(user);
        await fillStepTwo(user);
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({
                email: 'admin@example.com',
                password: 'Password1',
            });
            expect(companyService.createCompany).toHaveBeenCalled();
            expect(companyService.joinCompany).toHaveBeenCalledWith(1);
            expect(mockNavigate).toHaveBeenCalledWith('/companies');
        });
    });

    it('shows an error when register fails', async () => {
        const axiosError = new axios.AxiosError(
            'Email already exists',
            '400',
            undefined,
            undefined,
            { status: 400, data: { message: 'Email already exists' }, statusText: 'Bad Request', headers: {}, config: {} as never }
        );
        vi.mocked(authService.register).mockRejectedValue(axiosError);

        const user = userEvent.setup();
        renderPage();
        await fillStepOne(user);
        await fillStepTwo(user);
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(/email already exists/i);
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('back button returns to step 1', async () => {
        const user = userEvent.setup();
        renderPage();
        await fillStepOne(user);
        expect(screen.getByText(/step 2 of 2/i)).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /back/i }));
        expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument();
    });
});
