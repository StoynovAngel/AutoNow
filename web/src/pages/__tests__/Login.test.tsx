import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({ login: mockLogin }),
}));

vi.mock('../../components/auth/AuthLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../components/auth/LoginForm', () => ({
    default: ({ formData, errorMessage, onSubmit, onChange }: {
        formData: { email: string; password: string };
        errorMessage: string;
        onSubmit: (e: React.FormEvent) => void;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
        <form onSubmit={onSubmit}>
            <input name="email" value={formData.email} onChange={onChange} data-testid="email" />
            <input name="password" value={formData.password} onChange={onChange} data-testid="password" />
            {errorMessage && <div data-testid="error">{errorMessage}</div>}
            <button type="submit">Login</button>
        </form>
    ),
}));

vi.mock('../../services/auth/authService', () => ({
    authService: {
        login: vi.fn(),
    },
}));

vi.mock('../../utils/jwt', () => ({
    decodeJWT: vi.fn(),
}));

vi.mock('../../utils/errors', () => ({
    getErrorMessage: (_err: unknown, fallback: string) => fallback,
}));

import { authService } from '../../services/auth/authService';
import { decodeJWT } from '../../utils/jwt';

const mockAuthService = vi.mocked(authService.login);
const mockDecodeJWT = vi.mocked(decodeJWT);

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Login page — role guard', () => {
    it('blocks ROLE_CUSTOMER from accessing the panel', async () => {
        mockAuthService.mockResolvedValue({ token: 'fake.jwt.token' });
        mockDecodeJWT.mockReturnValue({
            sub: '1',
            authorities: ['ROLE_CUSTOMER'],
            companyId: null,
            companyType: null,
        } as never);

        render(<Login />);
        await userEvent.type(screen.getByTestId('email'), 'john.doe@example.com');
        await userEvent.type(screen.getByTestId('password'), 'Password123');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Access denied');
        });
        expect(mockLogin).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('allows ROLE_ADMIN to access the panel', async () => {
        mockAuthService.mockResolvedValue({ token: 'fake.jwt.token' });
        mockDecodeJWT.mockReturnValue({
            sub: '1',
            authorities: ['ROLE_ADMIN'],
            companyId: null,
            companyType: null,
        } as never);

        render(<Login />);
        await userEvent.type(screen.getByTestId('email'), 'admin@autonow.com');
        await userEvent.type(screen.getByTestId('password'), 'Password123');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/companies');
        });
    });

    it('allows ROLE_COMPANY_ADMIN to access the panel', async () => {
        mockAuthService.mockResolvedValue({ token: 'fake.jwt.token' });
        mockDecodeJWT.mockReturnValue({
            sub: '2',
            authorities: ['ROLE_COMPANY_ADMIN'],
            companyId: 5,
            companyType: 'TAXI',
        } as never);

        render(<Login />);
        await userEvent.type(screen.getByTestId('email'), 'admin@taxi-sofia.bg');
        await userEvent.type(screen.getByTestId('password'), 'Password123');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/companies');
        });
    });
});
