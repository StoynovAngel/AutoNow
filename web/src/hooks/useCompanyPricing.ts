import { useState, useEffect } from 'react';
import { pricingService, type CompanyPricing, type PricingPayload } from '../services/company/pricingService';
import type { CompanyType } from '../services/company/companyService';
import { getErrorMessage } from '../utils/errors';

const PRICING_TYPES: CompanyType[] = ['TAXI', 'AMBULANCE', 'LOGISTICS'];

export const useCompanyPricing = (companyId: number | null, companyType: CompanyType | undefined) => {
    const [pricing, setPricing] = useState<CompanyPricing | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supported = companyType !== undefined && PRICING_TYPES.includes(companyType);

    useEffect(() => {
        if (!companyId || !supported) {
            setPricing(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);
        pricingService.getPricing(companyId)
            .then((data) => { if (!cancelled) setPricing(data); })
            .catch((err: unknown) => { if (!cancelled) setError(getErrorMessage(err, 'Failed to load pricing')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [companyId, companyType]);

    const savePricing = async (id: number, payload: PricingPayload): Promise<void> => {
        const saved = pricing?.id !== undefined
            ? await pricingService.updatePricing(id, payload)
            : await pricingService.createPricing(id, payload);
        setPricing(saved);
    };

    return { pricing, loading, error, savePricing, supported };
};
