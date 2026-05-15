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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            <div className="mb-4 text-black">
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            <div className="mb-6 text-black">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
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
