export enum VehicleType {
    AMBULANCE = 'AMBULANCE',
    LOGISTICS = 'LOGISTICS',
    TAXI = 'TAXI',
    RENTAL = 'RENTAL',
    FUNERAL = 'FUNERAL',
    PROM = 'PROM'
}

export interface VehicleOption {
    type: VehicleType;
    label: string;
    icon: string;
    color: string;
    description: string;
}

export interface PublicVehicle {
    id: number;
    brand: string;
    model: string;
    licensePlate: string;
    imageUrl?: string;
    numberOfSeats?: number;
    vehicleType: VehicleType;
    companyId?: number;
    driverPhoneNumber?: string;
}
