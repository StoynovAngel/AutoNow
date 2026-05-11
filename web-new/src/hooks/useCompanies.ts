import {useState, useEffect} from 'react';
import {companyService} from '../services/company/companyService';

export const useCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
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

    const selectCompany = async (companyId: string) => {
        setSelectedCompanyId(companyId);
        if (companyId) {
            try {
                const data = await companyService.getCompanyById(companyId);
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
