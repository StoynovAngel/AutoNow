import {useState, useEffect} from 'react';
import {companyService} from '../services/company/companyService';
import type {Company} from '../components/company/CompanyInfo';

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
            console.log('Companies fetched:', data);
            setCompanies(data);
        } catch (err: any) {
            console.error('Failed to fetch companies', err);
            console.error('Error response:', err.response?.data);
            setError('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const selectCompany = async (companyId: number) => {
        setSelectedCompanyId(companyId);
        if (companyId) {
            try {
                const data = await companyService.getCompanyById(String(companyId));
                console.log('Company details:', data);
                setSelectedCompany(data);
            } catch (err: any) {
                console.error('Failed to fetch company details', err);
                console.error('Error response:', err.response?.data);
            }
        } else {
            setSelectedCompany(null);
        }
    };

    return {
        companies,
        selectedCompanyId,
        selectedCompany,
        loading,
        error,
        selectCompany,
        refreshCompanies: fetchCompanies
    };
};
