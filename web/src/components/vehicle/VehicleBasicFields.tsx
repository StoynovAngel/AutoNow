import { Label, Select, TextInput } from 'flowbite-react';

const VEHICLE_TYPES = ['TAXI', 'SEMI', 'AMBULANCE', 'RENTAL', 'PROM', 'FUNERAL'] as const;

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
            <Label htmlFor="licensePlate" className="mb-1 block">
                License Plate <span className="text-red-500">*</span>
            </Label>
            <TextInput
                id="licensePlate"
                type="text"
                value={licensePlate}
                onChange={(e) => onLicensePlateChange(e.target.value)}
                placeholder="e.g. CB1234AB"
                required
            />
        </div>
        <div>
            <Label htmlFor="brand" className="mb-1 block">
                Brand <span className="text-red-500">*</span>
            </Label>
            <TextInput
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => onBrandChange(e.target.value)}
                placeholder="e.g. Toyota"
                required
            />
        </div>
        <div>
            <Label htmlFor="model" className="mb-1 block">
                Model <span className="text-red-500">*</span>
            </Label>
            <TextInput
                id="model"
                type="text"
                value={model}
                onChange={(e) => onModelChange(e.target.value)}
                placeholder="e.g. Camry"
                required
            />
        </div>
        <div>
            <Label htmlFor="vehicleType" className="mb-1 block">
                Vehicle Type <span className="text-red-500">*</span>
            </Label>
            <Select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => onVehicleTypeChange(e.target.value)}
            >
                {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </Select>
        </div>
    </>
);

export default VehicleBasicFields;
