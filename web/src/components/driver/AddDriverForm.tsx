import { useState } from 'react';
import type { Driver } from '../company/DriverInfo';
import type { DriverPayload } from '../../services/company/driverService';
import VehicleImageUpload from '../vehicle/VehicleImageUpload';

const EXPERTISE_TYPES = ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'Tkt'] as const;
const INPUT_CLASS = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500';

interface AddDriverFormProps {
    onSubmit: (payload: DriverPayload) => Promise<void>;
    onCancel: () => void;
    initialData?: Driver;
}

interface FormFields {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    expertiseType: string[];
    available: boolean;
    companyId: string;
    imageUrl: string;
    imagePreview: string | null;
    uploading: boolean;
}

const buildInitialFields = (initialData?: Driver): FormFields => ({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    expertiseType: initialData?.expertiseType ?? [],
    available: initialData?.available ?? true,
    companyId: initialData?.companyId ? String(initialData.companyId) : '',
    imageUrl: initialData?.imageUrl ?? '',
    imagePreview: initialData?.imageUrl ?? null,
    uploading: false,
});

const AddDriverForm = ({ onSubmit, onCancel, initialData }: AddDriverFormProps) => {
    const [fields, setFields] = useState<FormFields>(() => buildInitialFields(initialData));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
        setFields(f => ({ ...f, [key]: value }));

    const isEditing = !!initialData;

    const handleUpload = (url: string, preview: string) => {
        setFields(f => ({ ...f, imageUrl: url, imagePreview: preview, uploading: url === preview }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fields.firstName.trim() || !fields.lastName.trim()) {
            setError('First and last name are required.');
            return;
        }
        if (!fields.phoneNumber.trim()) {
            setError('Phone number is required.');
            return;
        }
        if (fields.expertiseType.length === 0) {
            setError('Select at least one license category.');
            return;
        }

        const payload: DriverPayload = {
            firstName: fields.firstName.trim(),
            lastName: fields.lastName.trim(),
            phoneNumber: fields.phoneNumber.trim(),
            expertiseType: fields.expertiseType,
            available: fields.available,
            imageUrl: fields.imageUrl || undefined,
            companyId: fields.companyId ? Number(fields.companyId) : undefined,
        };

        setSubmitting(true);
        try {
            await onSubmit(payload);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save driver.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{isEditing ? 'Edit Driver' : 'Add Driver'}</h2>

            {error && (
                <div role="alert" aria-live="assertive" className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                <VehicleImageUpload
                    imagePreview={fields.imagePreview}
                    uploading={fields.uploading}
                    onUpload={handleUpload}
                    onRemove={() => setFields(f => ({ ...f, imageUrl: '', imagePreview: null }))}
                    onError={setError}
                    label="Driver Photo"
                    previewHeightClass="h-72"
                />

                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input id="firstName" type="text" value={fields.firstName} onChange={e => set('firstName', e.target.value)} className={INPUT_CLASS} placeholder="e.g. John" required />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input id="lastName" type="text" value={fields.lastName} onChange={e => set('lastName', e.target.value)} className={INPUT_CLASS} placeholder="e.g. Doe" required />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input id="phoneNumber" type="text" value={fields.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} className={INPUT_CLASS} placeholder="e.g. +359888123456" required />
                </div>
                <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                        License Categories <span className="text-red-500">*</span>
                    </span>
                    <div className="flex gap-3 pt-2">
                        {EXPERTISE_TYPES.map(t => (
                            <label key={t} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={fields.expertiseType.includes(t)}
                                    onChange={e => {
                                        const next = e.target.checked
                                            ? [...fields.expertiseType, t]
                                            : fields.expertiseType.filter(x => x !== t);
                                        set('expertiseType', next);
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                />
                                <span className="font-mono">{t}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                    <input id="companyId" type="number" min={1} value={fields.companyId} onChange={e => set('companyId', e.target.value)} className={INPUT_CLASS} placeholder="Optional" />
                </div>
                <div className="col-span-3 flex items-center gap-3 pt-1">
                    <input
                        id="available"
                        type="checkbox"
                        checked={fields.available}
                        onChange={e => set('available', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="available" className="text-sm font-medium text-gray-700">Available</label>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    disabled={submitting || fields.uploading}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Driver'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting || fields.uploading}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddDriverForm;
