import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Label, Select, Textarea, TextInput } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth/authService';
import {
    companyService,
    COMPANY_TYPES,
    type CompanyPayload,
    type CompanyType,
} from '../services/company/companyService';
import { decodeJWT } from '../utils/jwt';
import { getErrorMessage } from '../utils/errors';
import AuthLayout from '../components/auth/AuthLayout';

interface AccountFields {
    email: string;
    password: string;
    confirmPassword: string;
}

interface CompanyFields {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    companyType: CompanyType;
}

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const formatTypeLabel = (type: CompanyType) =>
    type.charAt(0) + type.slice(1).toLowerCase();

const RegisterCompanyAdmin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState<1 | 2>(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [account, setAccount] = useState<AccountFields>({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [company, setCompany] = useState<CompanyFields>({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        companyType: 'TAXI',
    });

    const passwordValid = PASSWORD_PATTERN.test(account.password);
    const passwordsMatch = account.password === account.confirmPassword;

    const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccount((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleCompanyChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCompany((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleStepOneSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!passwordValid) {
            setError('Password must be at least 8 characters with an uppercase letter, a lowercase letter, and a digit.');
            return;
        }
        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setCompany((prev) => ({ ...prev, email: account.email }));
        setStep(2);
    };

    const handleFinalSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const { token: registerToken } = await authService.register({
                email: account.email,
                password: account.password,
            });

            const decoded = decodeJWT(registerToken);
            if (!decoded) {
                setError('Registration failed: invalid token received.');
                return;
            }

            localStorage.setItem('accessToken', registerToken);

            const companyPayload: CompanyPayload = {
                name: company.name.trim(),
                address: company.address.trim(),
                phone: company.phone.trim(),
                email: company.email.trim(),
                companyType: company.companyType,
                description: company.description.trim() || undefined,
            };

            const createdCompany = await companyService.createCompany(companyPayload);

            const { token: joinToken } = await companyService.joinCompany(createdCompany.id);

            const joinDecoded = decodeJWT(joinToken);
            if (!joinDecoded) {
                setError('Failed to assign company: invalid token received.');
                return;
            }

            login(
                {
                    id: joinDecoded.sub,
                    email: account.email,
                    authorities: joinDecoded.authorities,
                    companyId: joinDecoded.companyId ?? null,
                },
                joinToken
            );

            navigate('/companies');
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Registration failed. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <div className="flex flex-col mx-auto px-8">
                <h1 className="text-3xl font-bold text-black mb-1">Register</h1>
                <p className="text-sm text-gray-500 mb-6">
                    {step === 1 ? 'Step 1 of 2 — Your account' : 'Step 2 of 2 — Your company'}
                </p>

                <div className="flex mb-6 gap-1">
                    <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                </div>

                {error && (
                    <Alert color="failure" role="alert" aria-live="assertive" className="mb-4">
                        {error}
                    </Alert>
                )}

                {step === 1 && (
                    <form onSubmit={handleStepOneSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="mb-1 block">Email</Label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={account.email}
                                onChange={handleAccountChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-1 block">Password</Label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={account.password}
                                onChange={handleAccountChange}
                                placeholder="Min. 8 chars, uppercase, digit"
                                required
                            />
                            {account.password.length > 0 && (
                                <p className={`mt-1 text-xs ${passwordValid ? 'text-green-600' : 'text-red-500'}`}>
                                    {passwordValid
                                        ? 'Password meets requirements'
                                        : 'Must be 8+ chars with uppercase, lowercase, and a digit'}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="mb-1 block">Confirm Password</Label>
                            <TextInput
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={account.confirmPassword}
                                onChange={handleAccountChange}
                                placeholder="Repeat your password"
                                required
                            />
                            {account.confirmPassword.length > 0 && (
                                <p className={`mt-1 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Continue
                        </Button>

                        <p className="text-center text-sm text-gray-600 pt-1">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleFinalSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label htmlFor="company-name" className="mb-1 block">
                                    Company Name <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="company-name"
                                    type="text"
                                    name="name"
                                    value={company.name}
                                    onChange={handleCompanyChange}
                                    placeholder="e.g. Sofia Taxi Co."
                                    required
                                    maxLength={255}
                                />
                            </div>

                            <div>
                                <Label htmlFor="company-email" className="mb-1 block">
                                    Company Email <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="company-email"
                                    type="email"
                                    name="email"
                                    value={company.email}
                                    readOnly
                                    disabled
                                />
                            </div>

                            <div>
                                <Label htmlFor="company-phone" className="mb-1 block">
                                    Phone <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="company-phone"
                                    type="tel"
                                    name="phone"
                                    value={company.phone}
                                    onChange={handleCompanyChange}
                                    placeholder="+359888123456"
                                    pattern="^\+?[0-9]{10,15}$"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="company-address" className="mb-1 block">
                                    Address <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="company-address"
                                    type="text"
                                    name="address"
                                    value={company.address}
                                    onChange={handleCompanyChange}
                                    placeholder="Street, City"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="company-type" className="mb-1 block">
                                    Company Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    id="company-type"
                                    name="companyType"
                                    value={company.companyType}
                                    onChange={handleCompanyChange}
                                    required
                                >
                                    {COMPANY_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {formatTypeLabel(t)}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="company-description" className="mb-1 block">
                                    Description
                                </Label>
                                <Textarea
                                    id="company-description"
                                    name="description"
                                    value={company.description}
                                    onChange={handleCompanyChange}
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Brief description of the company"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                color="gray"
                                onClick={() => { setStep(1); setError(''); }}
                                disabled={submitting}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? 'Creating account…' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default RegisterCompanyAdmin;
