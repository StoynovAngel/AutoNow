import {useState, useEffect} from 'react';
import {companyService, type CompanyPayload} from '../services/company/companyService';
import type {Company} from '../components/company/CompanyInfo';
import {getErrorMessage} from '../utils/errors';

export const useCompanies = (isCompanyAdmin: boolean = false) => {
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
            const data = isCompanyAdmin
                ? await companyService.getMyCompany()
                : await companyService.getAllCompanies();
            setCompanies(data);
            if (isCompanyAdmin && data.length === 1) {
                setSelectedCompanyId(data[0].id);
                setSelectedCompany(data[0]);
            }
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
                const data = await companyService.getCompanyById(companyId);
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
        const updated: Company = await companyService.updateCompany(id, payload);
        setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        if (selectedCompanyId === updated.id) {
            setSelectedCompany(updated);
        }
        return updated;
    };

    const deleteCompany = async (id: number): Promise<void> => {
        await companyService.deleteCompany(id);
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        setSelectedCompanyId((prev) => (prev === id ? null : prev));
        setSelectedCompany((prev) => (prev && prev.id === id ? null : prev));
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
        deleteCompany,
        refreshCompanies: fetchCompanies
    };
};
