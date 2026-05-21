import { useState, useRef } from 'react';
import axios from 'axios';
import type { Vehicle } from '../company/VehicleInfo';
import type { VehiclePayload } from '../../services/company/vehicleService';

const CLOUDINARY_CLOUD = 'dtrnkpgmp';
const CLOUDINARY_PRESET = 'autonow';

const VEHICLE_TYPES = ['TAXI', 'SEMI', 'AMBULANCE', 'RENTAL', 'PROM', 'FUNERAL'] as const;

interface AddVehicleFormProps {
    onSubmit: (payload: VehiclePayload) => Promise<void>;
    onCancel: () => void;
    initialData?: Vehicle;
    defaultCompanyId?: number;
}

const AddVehicleForm = ({ onSubmit, onCancel, initialData, defaultCompanyId }: AddVehicleFormProps) => {
    const [brand, setBrand] = useState(initialData?.brand ?? '');
    const [model, setModel] = useState(initialData?.model ?? '');
    const [imageURL, setImageURL] = useState(initialData?.imageURL ?? '');
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageURL ?? null);
    const [uploading, setUploading] = useState(false);
    const [airConditioning, setAirConditioning] = useState(initialData?.airConditioning ?? false);
    const [numberOfSeats, setNumberOfSeats] = useState(initialData?.numberOfSeats ? String(initialData.numberOfSeats) : '');
    const [trunkCapacity, setTrunkCapacity] = useState(initialData?.trunkCapacity ? String(initialData.trunkCapacity) : '');
    const [vehicleType, setVehicleType] = useState<string>(initialData?.vehicleType ?? 'TAXI');
    const [companyId, setCompanyId] = useState(
        initialData?.companyId ? String(initialData.companyId) : defaultCompanyId ? String(defaultCompanyId) : ''
    );
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!initialData;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            const { data } = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
                formData,
            );
            setImageURL(data.secure_url);
        } catch {
            setError('Image upload failed. Please try again.');
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageURL('');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const seats = parseInt(numberOfSeats, 10);
        const trunk = parseFloat(trunkCapacity);

        if (!brand.trim() || !model.trim()) {
            setError('Brand and model are required.');
            return;
        }
        if (!Number.isInteger(seats) || seats <= 0) {
            setError('Number of seats must be a positive integer.');
            return;
        }
        if (trunkCapacity && (isNaN(trunk) || trunk <= 0)) {
            setError('Trunk capacity must be a positive number.');
            return;
        }

        const payload: VehiclePayload = {
            brand: brand.trim(),
            model: model.trim(),
            imageURL: imageURL || undefined,
            airConditioning,
            numberOfSeats: seats,
            trunkCapacity: trunk || undefined,
            vehicleType,
            companyId: companyId ? Number(companyId) : undefined,
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
                <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Image</label>
                    <input
                        ref={fileInputRef}
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {imagePreview ? (
                        <div className="relative w-1/2 h-48 rounded-lg overflow-hidden border border-gray-200 mx-auto">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            {uploading ? (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                                    <span className="text-white text-sm font-medium">Uploading...</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                                    aria-label="Remove image"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-50 transition-colors cursor-pointer"
                        >
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-500">Click to upload image</span>
                            <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
                        </button>
                    )}
                </div>

                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="brand"
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="e.g. Toyota"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        Model <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="model"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="e.g. Camry"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="vehicleType"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {VEHICLE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Seats <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="numberOfSeats"
                        type="number"
                        min={1}
                        value={numberOfSeats}
                        onChange={(e) => setNumberOfSeats(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="e.g. 5"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="trunkCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Trunk Capacity (L)
                    </label>
                    <input
                        id="trunkCapacity"
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={trunkCapacity}
                        onChange={(e) => setTrunkCapacity(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="e.g. 400"
                    />
                </div>
                <div>
                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
                        Company ID
                    </label>
                    <input
                        id="companyId"
                        type="number"
                        min={1}
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Optional"
                    />
                </div>
                <div className="col-span-3 flex items-center gap-3 pt-1">
                    <input
                        id="airConditioning"
                        type="checkbox"
                        checked={airConditioning}
                        onChange={(e) => setAirConditioning(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="airConditioning" className="text-sm font-medium text-gray-700">
                        Air Conditioning
                    </label>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Vehicle'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting || uploading}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddVehicleForm;
