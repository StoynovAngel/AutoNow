import { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import type { CompanyPricing, PricingPayload } from '@/services/company/pricingService.ts';
import type { CompanyType } from '@/services/company/companyService.ts';
import { getErrorMessage } from '@/utils/errors.ts';
import { fieldsForType, type PricingFieldKey } from './pricingFields';

interface EditPricingModalProps {
    show: boolean;
    pricing: CompanyPricing | null;
    companyType: CompanyType;
    onClose: () => void;
    onSubmit: (payload: PricingPayload) => Promise<void>;
}

const toNum = (v: string) => (v === '' ? undefined : Number(v));

const EditPricingModal = ({ show, pricing, companyType, onClose, onSubmit }: EditPricingModalProps) => {
    const fields = fieldsForType(companyType);

    const [form, setForm] = useState<Record<PricingFieldKey, string>>(() => {
        const initial = {} as Record<PricingFieldKey, string>;
        fields.forEach(f => {
            const v = pricing?.[f.key];
            initial[f.key] = v !== undefined && v !== null ? String(v) : '';
        });
        return initial;
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = (field: PricingFieldKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload: PricingPayload = {};
            fields.forEach(f => {
                payload[f.key] = toNum(form[f.key]);
            });
            await onSubmit(payload);
            onClose();
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to save pricing'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} size="2xl" dismissible>
            <ModalHeader>Edit Pricing</ModalHeader>
            <ModalBody>
                {error && (
                    <div role="alert" aria-live="assertive" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {fields.map(f => (
                        <div key={f.key}>
                            <label htmlFor={f.key} className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
                            </label>
                            <input
                                id={f.key}
                                type="number"
                                step={f.step ?? 'any'}
                                required={f.required}
                                value={form[f.key]}
                                onChange={set(f.key)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    ))}
                    <div className="col-span-2 flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default EditPricingModal;
