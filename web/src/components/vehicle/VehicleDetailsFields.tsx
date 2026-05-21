const INPUT_CLASS = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500';

interface VehicleDetailsFieldsProps {
    numberOfSeats: string;
    trunkCapacity: string;
    companyId: string;
    airConditioning: boolean;
    onNumberOfSeatsChange: (v: string) => void;
    onTrunkCapacityChange: (v: string) => void;
    onCompanyIdChange: (v: string) => void;
    onAirConditioningChange: (v: boolean) => void;
}

const VehicleDetailsFields = ({
    numberOfSeats,
    trunkCapacity,
    companyId,
    airConditioning,
    onNumberOfSeatsChange,
    onTrunkCapacityChange,
    onCompanyIdChange,
    onAirConditioningChange,
}: VehicleDetailsFieldsProps) => (
    <>
        <div>
            <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Seats <span className="text-red-500">*</span>
            </label>
            <input
                id="numberOfSeats"
                type="number"
                min={1}
                value={numberOfSeats}
                onChange={(e) => onNumberOfSeatsChange(e.target.value)}
                className={INPUT_CLASS}
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
                onChange={(e) => onTrunkCapacityChange(e.target.value)}
                className={INPUT_CLASS}
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
                onChange={(e) => onCompanyIdChange(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Optional"
            />
        </div>
        <div className="col-span-3 flex items-center gap-3 pt-1">
            <input
                id="airConditioning"
                type="checkbox"
                checked={airConditioning}
                onChange={(e) => onAirConditioningChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <label htmlFor="airConditioning" className="text-sm font-medium text-gray-700">
                Air Conditioning
            </label>
        </div>
    </>
);

export default VehicleDetailsFields;
