import { useState, type FormEvent } from 'react';
import { Alert, Button, Label, Select, Textarea, TextInput } from 'flowbite-react';
import type { Company } from './CompanyInfo';
import {
    COMPANY_TYPES,
    type CompanyPayload,
    type CompanyType,
} from '../../services/company/companyService';

interface CompanyFormProps {
    initialData?: Company;
    submitLabel: string;
    submittingLabel: string;
    onSubmit: (payload: CompanyPayload) => Promise<void>;
    onCancel: () => void;
}

interface FormFields {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    companyType: CompanyType;
}

const buildInitialFields = (initialData?: Company): FormFields => ({
    name: initialData?.name ?? '',
    address: initialData?.address ?? '',
    phone: initialData?.phone ?? '',
    email: initialData?.email ?? '',
    description: initialData?.description ?? '',
    companyType: initialData?.companyType ?? 'TAXI',
});

const formatTypeLabel = (type: CompanyType): string =>
    type.charAt(0) + type.slice(1).toLowerCase();

const CompanyForm = ({ initialData, submitLabel, submittingLabel, onSubmit, onCancel }: CompanyFormProps) => {
    const [fields, setFields] = useState<FormFields>(() => buildInitialFields(initialData));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
        setFields((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload: CompanyPayload = {
            name: fields.name.trim(),
            address: fields.address.trim(),
            phone: fields.phone.trim(),
            email: fields.email.trim(),
            companyType: fields.companyType,
            description: fields.description.trim() || undefined,
        };

        setSubmitting(true);
        try {
            await onSubmit(payload);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save company.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert color="failure" role="alert" aria-live="assertive">
                    {error}
                </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label htmlFor="company-name" className="mb-1 block">
                        Company Name <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        id="company-name"
                        type="text"
                        value={fields.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="e.g. Sofia Taxi Co."
                        required
                        maxLength={255}
                    />
                </div>

                <div>
                    <Label htmlFor="company-email" className="mb-1 block">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        id="company-email"
                        type="email"
                        value={fields.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="contact@example.com"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="company-phone" className="mb-1 block">
                        Phone <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        id="company-phone"
                        type="tel"
                        value={fields.phone}
                        onChange={(e) => set('phone', e.target.value)}
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
                        value={fields.address}
                        onChange={(e) => set('address', e.target.value)}
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
                        value={fields.companyType}
                        onChange={(e) => set('companyType', e.target.value as CompanyType)}
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
                        value={fields.description}
                        onChange={(e) => set('description', e.target.value)}
                        rows={3}
                        maxLength={1000}
                        placeholder="Brief description of the company"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? submittingLabel : submitLabel}
                </Button>
                <Button
                    type="button"
                    color="gray"
                    onClick={onCancel}
                    disabled={submitting}
                    className="flex-1"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default CompanyForm;
