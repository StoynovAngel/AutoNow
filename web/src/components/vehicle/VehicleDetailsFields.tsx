import { Checkbox, Label, TextInput } from 'flowbite-react';

interface VehicleDetailsFieldsProps {
    numberOfSeats: string;
    trunkCapacity: string;
    companyId: string;
    airConditioning: boolean;
    hideCompanyId?: boolean;
    showRentalPrice?: boolean;
    rentalPricePerDay?: string;
    securityDepositAmount?: string;
    onNumberOfSeatsChange: (v: string) => void;
    onTrunkCapacityChange: (v: string) => void;
    onCompanyIdChange: (v: string) => void;
    onAirConditioningChange: (v: boolean) => void;
    onRentalPricePerDayChange?: (v: string) => void;
    onSecurityDepositAmountChange?: (v: string) => void;
}

const VehicleDetailsFields = ({
    numberOfSeats,
    trunkCapacity,
    companyId,
    airConditioning,
    hideCompanyId = false,
    showRentalPrice = false,
    rentalPricePerDay = '',
    securityDepositAmount = '',
    onNumberOfSeatsChange,
    onTrunkCapacityChange,
    onCompanyIdChange,
    onAirConditioningChange,
    onRentalPricePerDayChange,
    onSecurityDepositAmountChange,
}: VehicleDetailsFieldsProps) => (
    <>
        <div>
            <Label htmlFor="numberOfSeats" className="mb-1 block">
                Number of Seats <span className="text-red-500">*</span>
            </Label>
            <TextInput
                id="numberOfSeats"
                type="number"
                min={1}
                value={numberOfSeats}
                onChange={(e) => onNumberOfSeatsChange(e.target.value)}
                placeholder="e.g. 5"
                required
            />
        </div>
        <div>
            <Label htmlFor="trunkCapacity" className="mb-1 block">
                Trunk Capacity (L)
            </Label>
            <TextInput
                id="trunkCapacity"
                type="number"
                min={0.1}
                step={0.1}
                value={trunkCapacity}
                onChange={(e) => onTrunkCapacityChange(e.target.value)}
                placeholder="e.g. 400"
            />
        </div>
        {!hideCompanyId && (
            <div>
                <Label htmlFor="companyId" className="mb-1 block">
                    Company ID
                </Label>
                <TextInput
                    id="companyId"
                    type="number"
                    min={1}
                    value={companyId}
                    onChange={(e) => onCompanyIdChange(e.target.value)}
                    placeholder="Optional"
                />
            </div>
        )}
        {showRentalPrice && (
            <div>
                <Label htmlFor="rentalPricePerDay" className="mb-1 block">
                    Rental Price per Day (EUR)
                </Label>
                <TextInput
                    id="rentalPricePerDay"
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={rentalPricePerDay}
                    onChange={(e) => onRentalPricePerDayChange?.(e.target.value)}
                    placeholder="e.g. 60"
                />
            </div>
        )}
        {showRentalPrice && (
            <div>
                <Label htmlFor="securityDepositAmount" className="mb-1 block">
                    Security Deposit (EUR)
                </Label>
                <TextInput
                    id="securityDepositAmount"
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={securityDepositAmount}
                    onChange={(e) => onSecurityDepositAmountChange?.(e.target.value)}
                    placeholder="e.g. 500"
                />
            </div>
        )}
        <div className="col-span-3 flex items-center gap-3 pt-1">
            <Checkbox
                id="airConditioning"
                checked={airConditioning}
                onChange={(e) => onAirConditioningChange(e.target.checked)}
            />
            <Label htmlFor="airConditioning">Air Conditioning</Label>
        </div>
    </>
);

export default VehicleDetailsFields;
