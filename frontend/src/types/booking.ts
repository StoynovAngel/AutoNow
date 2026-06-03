export type VehicleClass = 'STANDARD' | 'XL' | 'PREMIUM';

export const VEHICLE_CLASSES: VehicleClass[] = ['STANDARD', 'XL', 'PREMIUM'];

export interface BookingPreferences {
    passengerCount?: number;
    luggageCount?: number;
    vehicleClass?: VehicleClass;
    requiresAirConditioning?: boolean;
}
