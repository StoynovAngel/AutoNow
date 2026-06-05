import {useState, useEffect} from 'react';
import {companyService, type CompanyPayload} from '../services/company/companyService';
import type {Company} from '../components/company/CompanyInfo';
import {getErrorMessage} from '../utils/errors';

export const useCompanies = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await companyService.getAllCompanies();
            setCompanies(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to load companies'));
        } finally {
            setLoading(false);
        }
    };

    const selectCompany = async (companyId: number) => {
        setSelectedCompanyId(companyId);
        if (companyId) {
            try {
                const data = await companyService.getCompanyById(String(companyId));
                setSelectedCompany(data);
            } catch {
                setSelectedCompany(null);
            }
        } else {
            setSelectedCompany(null);
        }
    };

    const createCompany = async (payload: CompanyPayload): Promise<Company> => {
        const created: Company = await companyService.createCompany(payload);
        const refreshed: Company[] = await companyService.getAllCompanies();
        setCompanies(refreshed);
        setSelectedCompanyId(created.id);
        setSelectedCompany(created);
        return created;
    };

    const updateCompany = async (id: number, payload: CompanyPayload): Promise<Company> => {
        const updated: Company = await companyService.updateCompany(String(id), payload);
        setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        if (selectedCompanyId === updated.id) {
            setSelectedCompany(updated);
        }
        return updated;
    };

    return {
        companies,
        selectedCompanyId,
        selectedCompany,
        loading,
        error,
        selectCompany,
        createCompany,
        updateCompany,
        refreshCompanies: fetchCompanies
    };
};
