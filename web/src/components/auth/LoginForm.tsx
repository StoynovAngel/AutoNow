import {type FormEvent, type ChangeEvent} from "react";

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
                <div
                    id="login-error"
                    role="alert"
                    aria-live="assertive"
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                >
                    {errorMessage}
                </div>
            )}

            <div className="mb-4 text-black">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={errorMessage ? "login-error" : undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            <div className="mb-6 text-black">
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={errorMessage ? "login-error" : undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
