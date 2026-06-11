import type { CompanyType } from '../../services/company/companyService';
import type { CompanyPricing } from '../../services/company/pricingService';
import { fieldsForType, fieldValue, isPricingType } from './pricingFields';

interface CompanyPricingInfoProps {
    pricing: CompanyPricing | null;
    companyType: CompanyType;
    canEdit?: boolean;
    onEdit?: () => void;
}

const Field = ({ label, value, required }: { label: string; value: number | undefined; required?: boolean }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <p className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            {value !== undefined && value !== null ? value : <span className="text-gray-400 italic">not set</span>}
        </p>
    </div>
);

const CompanyPricingInfo = ({ pricing, companyType, canEdit = false, onEdit }: CompanyPricingInfoProps) => {
    if (!isPricingType(companyType)) return null;

    const fields = fieldsForType(companyType);

    return (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Pricing</h2>
                {canEdit && onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="px-2 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
                    >
                        Edit
                    </button>
                )}
            </div>

            {!pricing ? (
                <p className="text-sm text-gray-400 italic">No pricing configured</p>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {fields.map(f => (
                        <Field
                            key={f.key}
                            label={f.label}
                            value={fieldValue(pricing, f.key)}
                            required={f.required}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyPricingInfo;
