import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm';

const renderForm = () =>
    render(
        <LoginForm
            formData={{ email: '', password: '' }}
            errorMessage=""
            onSubmit={vi.fn()}
            onChange={vi.fn()}
        />,
    );

describe('LoginForm — required guards', () => {
    it('marks email as required with type email', () => {
        renderForm();
        const email = screen.getByLabelText(/email/i) as HTMLInputElement;
        expect(email.required).toBe(true);
        expect(email.type).toBe('email');
    });

    it('marks password as required', () => {
        renderForm();
        const password = screen.getByLabelText(/password/i) as HTMLInputElement;
        expect(password.required).toBe(true);
        expect(password.type).toBe('password');
    });

    it('shows the error alert when errorMessage is set', () => {
        render(
            <LoginForm
                formData={{ email: '', password: '' }}
                errorMessage="Bad credentials"
                onSubmit={vi.fn()}
                onChange={vi.fn()}
            />,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('Bad credentials');
    });
});
