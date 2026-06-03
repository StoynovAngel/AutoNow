import { Button } from 'flowbite-react';
import type { Company } from './CompanyInfo';

interface CompanyListProps {
    companies: Company[];
    selectedCompanyId: number | null;
    onSelectCompany: (companyId: number) => void;
    onAddCompany: () => void;
}

const CompanyList = ({companies, selectedCompanyId, onSelectCompany, onAddCompany}: CompanyListProps) => {
    return (
        <div className="w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <div className="flex-1 space-y-2 mb-4 overflow-y-auto">
                {companies.map((company) => (
                    <button
                        key={company.id}
                        type="button"
                        onClick={() => onSelectCompany(company.id)}
                        aria-pressed={selectedCompanyId === company.id}
                        className={`w-full text-left px-3 py-2 border rounded-lg cursor-pointer transition ${
                            selectedCompanyId === company.id
                                ? "bg-brand-50 border-brand-500"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {company.name}
                    </button>
                ))}
            </div>

            <Button onClick={onAddCompany} className="w-full">
                Add new company
            </Button>
        </div>
    );
};

export default CompanyList;
