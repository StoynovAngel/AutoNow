import type { Company } from './CompanyInfo';

interface CompanyListProps {
    companies: Company[];
    selectedCompanyId: string | null;
    onSelectCompany: (companyId: string) => void;
    onAddCompany: () => void;
}

const CompanyList = ({companies, selectedCompanyId, onSelectCompany, onAddCompany}: CompanyListProps) => {
    return (
        <div className="w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <div className="flex-1 space-y-2 mb-4 overflow-y-auto">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        onClick={() => onSelectCompany(String(company.id))}
                        className={`px-3 py-2 border rounded-lg cursor-pointer transition ${
                            selectedCompanyId === String(company.id)
                                ? "bg-violet-100 border-violet-500"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {company.name}
                    </div>
                ))}
            </div>

            <button
                onClick={onAddCompany}
                className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
            >
                Add new company
            </button>
        </div>
    );
};

export default CompanyList;
