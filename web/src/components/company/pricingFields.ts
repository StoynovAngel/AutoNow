import type { CompanyType } from '../../services/company/companyService';
import type { CompanyPricing, PricingPayload } from '../../services/company/pricingService';

export type PricingFieldKey = keyof Omit<PricingPayload, never>;

export interface PricingFieldDef {
    key: PricingFieldKey;
    label: string;
    required: boolean;
    step?: string;
}

const TAXI_FIELDS: PricingFieldDef[] = [
    { key: 'baseFare', label: 'Base Fare (€)', required: true },
    { key: 'ratePerKm', label: 'Rate / km (€)', required: true },
    { key: 'nightMultiplier', label: 'Night Multiplier', required: true },
    { key: 'nightStartHour', label: 'Night Start Hour', required: true, step: '1' },
    { key: 'nightEndHour', label: 'Night End Hour', required: true, step: '1' },
];

const AMBULANCE_FIELDS: PricingFieldDef[] = [
    { key: 'ambulanceBaseFare', label: 'Base Fare (€)', required: true },
    { key: 'ratePerKm', label: 'Rate / km (€)', required: true },
    { key: 'nightMultiplier', label: 'Night Multiplier', required: true },
    { key: 'nightStartHour', label: 'Night Start Hour', required: true, step: '1' },
    { key: 'nightEndHour', label: 'Night End Hour', required: true, step: '1' },
];

const LOGISTICS_FIELDS: PricingFieldDef[] = [
    { key: 'logisticsBaseFare', label: 'Base Fare (€)', required: true },
    { key: 'logisticsRatePerKg', label: 'Rate / kg (€)', required: false },
];

export const fieldsForType = (companyType: CompanyType): PricingFieldDef[] => {
    switch (companyType) {
        case 'TAXI': return TAXI_FIELDS;
        case 'AMBULANCE': return AMBULANCE_FIELDS;
        case 'LOGISTICS': return LOGISTICS_FIELDS;
        default: return [];
    }
};

export const isPricingType = (companyType: CompanyType): boolean =>
    companyType === 'TAXI' || companyType === 'AMBULANCE' || companyType === 'LOGISTICS';

export const fieldValue = (pricing: CompanyPricing, key: PricingFieldKey): number | undefined =>
    pricing[key] as number | undefined;
