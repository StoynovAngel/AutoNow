import { useState } from 'react';
import type { Vehicle } from '../company/VehicleInfo';
import type { VehiclePayload } from '../../services/company/vehicleService';
import VehicleImageUpload from './VehicleImageUpload';
import VehicleBasicFields from './VehicleBasicFields';
import VehicleDetailsFields from './VehicleDetailsFields';

interface AddVehicleFormProps {
    onSubmit: (payload: VehiclePayload) => Promise<void>;
    onCancel: () => void;
    initialData?: Vehicle;
    defaultCompanyId?: number;
}

interface FormFields {
    brand: string;
    model: string;
    licensePlate: string;
    vehicleType: string;
    numberOfSeats: string;
    trunkCapacity: string;
    companyId: string;
    airConditioning: boolean;
    imageURL: string;
    imagePreview: string | null;
    uploading: boolean;
}

const buildInitialFields = (initialData?: Vehicle, defaultCompanyId?: number): FormFields => ({
    brand: initialData?.brand ?? '',
    model: initialData?.model ?? '',
    licensePlate: initialData?.licensePlate ?? '',
    vehicleType: initialData?.vehicleType ?? 'TAXI',
    numberOfSeats: initialData?.numberOfSeats ? String(initialData.numberOfSeats) : '',
    trunkCapacity: initialData?.trunkCapacity ? String(initialData.trunkCapacity) : '',
    companyId: initialData?.companyId ? String(initialData.companyId) : defaultCompanyId ? String(defaultCompanyId) : '',
    airConditioning: initialData?.airConditioning ?? false,
    imageURL: initialData?.imageURL ?? '',
    imagePreview: initialData?.imageURL ?? null,
    uploading: false,
});

const AddVehicleForm = ({ onSubmit, onCancel, initialData, defaultCompanyId }: AddVehicleFormProps) => {
    const [fields, setFields] = useState<FormFields>(() => buildInitialFields(initialData, defaultCompanyId));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) => setFields(f => ({ ...f, [key]: value }));

    const isEditing = !!initialData;

    const handleUpload = (url: string, preview: string) => {
        setFields(f => ({ ...f, imageURL: url, imagePreview: preview, uploading: url === preview }));
    };

    const handleRemoveImage = () => {
        setFields(f => ({ ...f, imageURL: '', imagePreview: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const seats = parseInt(fields.numberOfSeats, 10);
        const trunk = parseFloat(fields.trunkCapacity);

        if (!fields.licensePlate.trim()) {
            setError('License plate is required.');
            return;
        }
        if (!fields.brand.trim() || !fields.model.trim()) {
            setError('Brand and model are required.');
            return;
        }
        if (!Number.isInteger(seats) || seats <= 0) {
            setError('Number of seats must be a positive integer.');
            return;
        }
        if (fields.trunkCapacity && (isNaN(trunk) || trunk <= 0)) {
            setError('Trunk capacity must be a positive number.');
            return;
        }

        const payload: VehiclePayload = {
            brand: fields.brand.trim(),
            model: fields.model.trim(),
            licensePlate: fields.licensePlate.trim(),
            imageURL: fields.imageURL || undefined,
            airConditioning: fields.airConditioning,
            numberOfSeats: seats,
            trunkCapacity: trunk || undefined,
            vehicleType: fields.vehicleType,
            companyId: fields.companyId ? Number(fields.companyId) : undefined,
        };

        setSubmitting(true);
        try {
            await onSubmit(payload);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save vehicle.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>

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
                    onRemove={handleRemoveImage}
                    onError={setError}
                />
                <VehicleBasicFields
                    licensePlate={fields.licensePlate}
                    brand={fields.brand}
                    model={fields.model}
                    vehicleType={fields.vehicleType}
                    onLicensePlateChange={v => set('licensePlate', v)}
                    onBrandChange={v => set('brand', v)}
                    onModelChange={v => set('model', v)}
                    onVehicleTypeChange={v => set('vehicleType', v)}
                />
                <VehicleDetailsFields
                    numberOfSeats={fields.numberOfSeats}
                    trunkCapacity={fields.trunkCapacity}
                    companyId={fields.companyId}
                    airConditioning={fields.airConditioning}
                    onNumberOfSeatsChange={v => set('numberOfSeats', v)}
                    onTrunkCapacityChange={v => set('trunkCapacity', v)}
                    onCompanyIdChange={v => set('companyId', v)}
                    onAirConditioningChange={v => set('airConditioning', v)}
                />
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    disabled={submitting || fields.uploading}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Vehicle'}
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

export default AddVehicleForm;
