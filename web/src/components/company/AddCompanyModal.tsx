import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Alert, Button, Label, Modal, ModalBody, ModalHeader, Select, Textarea, TextInput } from 'flowbite-react';
import { authService } from '../../services/auth/authService';
import { companyService, COMPANY_TYPES, type CompanyPayload, type CompanyType } from '../../services/company/companyService';
import { getErrorMessage } from '../../utils/errors';

interface AddCompanyModalProps {
    show: boolean;
    onClose: () => void;
    onCreated: () => void;
}

interface FormFields {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    companyType: CompanyType;
    adminEmail: string;
    adminPassword: string;
}

const formatTypeLabel = (type: CompanyType) =>
    type.charAt(0) + type.slice(1).toLowerCase();

interface Credentials {
    email: string;
    password: string;
}

const AddCompanyModal = ({ show, onClose, onCreated }: AddCompanyModalProps) => {
    const [fields, setFields] = useState<FormFields>({
        name: '', address: '', phone: '', email: '',
        description: '', companyType: 'TAXI', adminEmail: '', adminPassword: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [copied, setCopied] = useState(false);

    const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
        setFields((f) => ({ ...f, [key]: value }));

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFields((f) => ({ ...f, [name]: value }));
        setError('');
        if (name === 'email' && !fields.adminEmail) {
            setFields((f) => ({ ...f, email: value, adminEmail: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const { token: registerToken } = await authService.register({
                email: fields.adminEmail,
                password: fields.adminPassword,
            });

            localStorage.setItem('accessToken', registerToken);

            const payload: CompanyPayload = {
                name: fields.name.trim(),
                address: fields.address.trim(),
                phone: fields.phone.trim(),
                email: fields.email.trim(),
                companyType: fields.companyType,
                description: fields.description.trim() || undefined,
            };

            const created = await companyService.createCompany(payload);
            await companyService.joinCompany(created.id);

            localStorage.removeItem('accessToken');

            setCredentials({ email: fields.adminEmail, password: fields.adminPassword });
            onCreated();
        } catch (err: unknown) {
            localStorage.removeItem('accessToken');
            setError(getErrorMessage(err, 'Failed to create company. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopy = () => {
        if (!credentials) return;
        navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setFields({ name: '', address: '', phone: '', email: '', description: '', companyType: 'TAXI', adminEmail: '', adminPassword: '' });
        setError('');
        setCredentials(null);
        setCopied(false);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} size="2xl" dismissible>
            <ModalHeader>{credentials ? 'Company Created' : 'Add Company'}</ModalHeader>
            <ModalBody>
                {credentials ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            The company and its admin account have been created. Share these credentials with the company admin.
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 font-mono text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-xs font-sans font-semibold uppercase tracking-wide">Email</span>
                                <span className="text-gray-900 font-medium">{credentials.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-xs font-sans font-semibold uppercase tracking-wide">Password</span>
                                <span className="text-gray-900 font-bold tracking-widest">{credentials.password}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleCopy} color="gray" className="flex-1">
                                {copied ? 'Copied!' : 'Copy credentials'}
                            </Button>
                            <Button onClick={handleClose} className="flex-1">Done</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert color="failure" role="alert" aria-live="assertive">
                                {error}
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label htmlFor="ac-name" className="mb-1 block">
                                    Company Name <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="ac-name"
                                    name="name"
                                    value={fields.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Sofia Taxi Co."
                                    required
                                    maxLength={255}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ac-email" className="mb-1 block">
                                    Company Email <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="ac-email"
                                    type="email"
                                    name="email"
                                    value={fields.email}
                                    onChange={handleChange}
                                    placeholder="contact@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="ac-phone" className="mb-1 block">
                                    Phone <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="ac-phone"
                                    type="tel"
                                    name="phone"
                                    value={fields.phone}
                                    onChange={handleChange}
                                    placeholder="+359888123456"
                                    pattern="^\+?[0-9]{10,15}$"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="ac-address" className="mb-1 block">
                                    Address <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="ac-address"
                                    name="address"
                                    value={fields.address}
                                    onChange={handleChange}
                                    placeholder="Street, City"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="ac-type" className="mb-1 block">
                                    Company Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    id="ac-type"
                                    name="companyType"
                                    value={fields.companyType}
                                    onChange={handleChange}
                                    required
                                >
                                    {COMPANY_TYPES.map((t) => (
                                        <option key={t} value={t}>{formatTypeLabel(t)}</option>
                                    ))}
                                </Select>
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="ac-description" className="mb-1 block">Description</Label>
                                <Textarea
                                    id="ac-description"
                                    name="description"
                                    value={fields.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Brief description of the company"
                                />
                            </div>

                            <div className="col-span-2 border-t border-gray-100 pt-4">
                                <Label htmlFor="ac-admin-email" className="mb-1 block">
                                    Admin Account Email <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="ac-admin-email"
                                    type="email"
                                    name="adminEmail"
                                    value={fields.adminEmail}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="ac-admin-password" className="mb-1 block">
                                    Admin Account Password <span className="text-red-500">*</span>
                                </Label>
                                <TextInput
                                    id="ac-admin-password"
                                    type="password"
                                    name="adminPassword"
                                    value={fields.adminPassword}
                                    onChange={handleChange}
                                    placeholder="Min. 8 chars, uppercase, lowercase, digit"
                                    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                                    title="At least 8 characters with an uppercase letter, a lowercase letter, and a digit"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="button" color="gray" onClick={handleClose} disabled={submitting} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? 'Creating…' : 'Create Company'}
                            </Button>
                        </div>
                    </form>
                )}
            </ModalBody>
        </Modal>
    );
};

export default AddCompanyModal;
