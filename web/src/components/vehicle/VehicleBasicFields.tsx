const VEHICLE_TYPES = ['TAXI', 'SEMI', 'AMBULANCE', 'RENTAL', 'PROM', 'FUNERAL'] as const;

const INPUT_CLASS = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500';

interface VehicleBasicFieldsProps {
    licensePlate: string;
    brand: string;
    model: string;
    vehicleType: string;
    onLicensePlateChange: (v: string) => void;
    onBrandChange: (v: string) => void;
    onModelChange: (v: string) => void;
    onVehicleTypeChange: (v: string) => void;
}

const VehicleBasicFields = ({ licensePlate, brand, model, vehicleType, onLicensePlateChange, onBrandChange, onModelChange, onVehicleTypeChange }: VehicleBasicFieldsProps) => (
    <>
        <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                License Plate <span className="text-red-500">*</span>
            </label>
            <input
                id="licensePlate"
                type="text"
                value={licensePlate}
                onChange={(e) => onLicensePlateChange(e.target.value)}
                className={INPUT_CLASS}
                placeholder="e.g. CB1234AB"
                required
            />
        </div>
        <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand <span className="text-red-500">*</span>
            </label>
            <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => onBrandChange(e.target.value)}
                className={INPUT_CLASS}
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
                onChange={(e) => onModelChange(e.target.value)}
                className={INPUT_CLASS}
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
                onChange={(e) => onVehicleTypeChange(e.target.value)}
                className={INPUT_CLASS}
            >
                {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>
        </div>
    </>
);

export default VehicleBasicFields;
