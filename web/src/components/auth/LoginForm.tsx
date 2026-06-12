import {type FormEvent, type ChangeEvent} from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Label, TextInput } from 'flowbite-react';

interface LoginFormProps {
    formData: {
        email: string;
        password: string;
    };
    errorMessage: string;
    onSubmit: (e: FormEvent) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm = ({formData, errorMessage, onSubmit, onChange}: LoginFormProps) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col mx-auto px-8">
            <h1 className="text-3xl font-bold text-black mb-6">Log in</h1>

            {errorMessage && (
                <Alert
                    id="login-error"
                    color="failure"
                    aria-live="assertive"
                    className="mb-4"
                >
                    {errorMessage}
                </Alert>
            )}

            <div className="mb-4">
                <Label htmlFor="email" className="mb-1 block">Email</Label>
                <TextInput
                    id="email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={errorMessage ? "login-error" : undefined}
                />
            </div>

            <div className="mb-6">
                <Label htmlFor="password" className="mb-1 block">Password</Label>
                <TextInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={errorMessage ? "login-error" : undefined}
                />
            </div>

            <Button type="submit" className="w-full">
                Login
            </Button>

            <p className="text-center text-sm text-gray-600 pt-2">
                New here?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Register your company
                </Link>
            </p>
        </form>
    );
};

export default LoginForm;
