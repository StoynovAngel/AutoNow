import { VehicleType, VehicleOption } from '../types/vehicle';

export const getVehicleOptions = (t: (key: string) => string): VehicleOption[] => [
    {
        type: VehicleType.AMBULANCE,
        label: t("ambulance"),
        icon: 'medical-services',
        color: '#EF4444',
        description: t("medical-transport")
    },
    {
        type: VehicleType.LOGISTICS,
        label: t("logistics"),
        icon: 'local-shipping',
        color: '#3B82F6',
        description: t("logistics-transport")
    },
    {
        type: VehicleType.TAXI,
        label: t("taxi"),
        icon: 'local-taxi',
        color: '#F59E0B',
        description: t("taxi-transport")
    },
    {
        type: VehicleType.RENTAL,
        label: t("rental"),
        icon: 'car-rental',
        color: '#10B981',
        description: t("rental-transport")
    },
    {
        type: VehicleType.FUNERAL,
        label: t("funeral"),
        icon: 'church',
        color: '#6B7280',
        description: t("funeral-transport")
    },
    {
        type: VehicleType.PROM,
        label: t("prom"),
        icon: 'celebration',
        color: '#800080',
        description: t("prom-transport")
    }
];
