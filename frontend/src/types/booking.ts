export type VehicleClass = 'STANDARD' | 'XL';

export const VEHICLE_CLASSES: VehicleClass[] = ['STANDARD', 'XL'];

export interface BookingPreferences {
    vehicleClass?: VehicleClass;
    weightKg?: number;
}
