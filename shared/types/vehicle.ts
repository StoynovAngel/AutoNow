export enum VehicleType {
  AMBULANCE = 'AMBULANCE',
  LOGISTICS = 'LOGISTICS',
  TAXI = 'TAXI',
  RENTAL = 'RENTAL',
  FUNERAL = 'FUNERAL',
  PROM = 'PROM',
}

export interface VehicleOption {
  type: VehicleType;
  label: string;
  icon: string;
  color: string;
  description: string;
}
