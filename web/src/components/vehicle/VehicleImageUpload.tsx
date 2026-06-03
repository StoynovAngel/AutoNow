import { useRef } from 'react';
import axios from 'axios';

const CLOUDINARY_CLOUD = 'dtrnkpgmp';
const CLOUDINARY_PRESET = 'autonow';

interface VehicleImageUploadProps {
    imagePreview: string | null;
    uploading: boolean;
    onUpload: (url: string, preview: string) => void;
    onRemove: () => void;
    onError: (message: string) => void;
    label?: string;
    previewHeightClass?: string;
}

const VehicleImageUpload = ({ imagePreview, uploading, onUpload, onRemove, onError, label = 'Vehicle Image', previewHeightClass = 'h-48' }: VehicleImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        onUpload(preview, preview);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            const { data } = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
                formData,
            );
            onUpload(data.secure_url, preview);
        } catch {
            onError('Image upload failed. Please try again.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = () => {
        onRemove();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                ref={fileInputRef}
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            {imagePreview ? (
                <div className={`relative w-1/2 ${previewHeightClass} rounded-lg overflow-hidden border border-gray-200 mx-auto`}>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {uploading ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                            <span className="text-white text-sm font-medium">Uploading...</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleRemove}
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
                    className={`w-full ${previewHeightClass} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-brand-400 hover:bg-brand-50 transition-colors cursor-pointer`}
                >
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Click to upload image</span>
                    <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
                </button>
            )}
        </div>
    );
};

export default VehicleImageUpload;
