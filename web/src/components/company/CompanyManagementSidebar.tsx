import { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import type { Company } from './CompanyInfo';
import type { Driver } from './DriverInfo';

interface CompanyManagementSidebarProps {
    companies: Company[];
    drivers: Driver[];
    selectedCompanyId: number | null;
    selectedDriverId: number | null;
    onSelectCompany: (companyId: number) => void;
    onSelectDriver: (driverId: number) => void;
    canCreateCompany?: boolean;
    onAddCompany?: () => void;
}

const CompanyManagementSidebar = ({
    companies,
    drivers,
    selectedCompanyId,
    selectedDriverId,
    onSelectCompany,
    onSelectDriver,
    canCreateCompany = false,
    onAddCompany,
}: CompanyManagementSidebarProps) => {
    const [companySearch, setCompanySearch] = useState('');
    const filteredCompanies = companySearch.trim()
        ? companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()))
        : companies;

    return (
        <div className="flex flex-col gap-3 w-72 h-full">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100 min-h-0 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Companies</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {filteredCompanies.length}
                    </span>
                </div>
                <div className="mb-2">
                    <label htmlFor="company-search" className="sr-only">Search companies</label>
                    <TextInput
                        id="company-search"
                        sizing="sm"
                        placeholder="Search by name…"
                        value={companySearch}
                        onChange={e => setCompanySearch(e.target.value)}
                    />
                </div>
                <div className="flex-1 space-y-2 mb-3 overflow-y-auto min-h-0">
                    {filteredCompanies.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                            {companies.length === 0 ? 'No companies yet' : 'No matches'}
                        </p>
                    ) : (
                        filteredCompanies.map((company) => (
                            <button
                                key={company.id}
                                type="button"
                                onClick={() => onSelectCompany(company.id)}
                                aria-pressed={selectedCompanyId === company.id}
                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedCompanyId === company.id
                                        ? "bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-lg transform scale-[1.02]"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                <p className="font-semibold text-sm">{company.name}</p>
                                {company.companyType && (
                                    <p className={`text-xs mt-0.5 ${selectedCompanyId === company.id ? 'text-brand-50' : 'text-gray-500'}`}>
                                        {company.companyType}
                                    </p>
                                )}
                            </button>
                        ))
                    )}
                </div>
                {canCreateCompany && onAddCompany && (
                    <Button onClick={onAddCompany} size="sm" className="w-full">
                        + Add Company
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100 min-h-0 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Drivers</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {drivers.length}
                    </span>
                </div>
                <div className="flex-1 space-y-2 mb-3 overflow-y-auto min-h-0">
                    {drivers.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                            {selectedCompanyId ? 'No drivers in this company' : 'Select a company'}
                        </p>
                    ) : (
                        drivers.map((driver) => (
                            <button
                                key={driver.id}
                                type="button"
                                onClick={() => onSelectDriver(driver.id)}
                                aria-pressed={selectedDriverId === driver.id}
                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedDriverId === driver.id
                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-[1.02]"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                <p className="font-semibold text-sm">
                                    {driver.firstName} {driver.lastName}
                                </p>
                                {driver.expertiseType.length > 0 && (
                                    <p className={`text-xs mt-0.5 ${selectedDriverId === driver.id ? 'text-orange-100' : 'text-gray-500'}`}>
                                        License: {driver.expertiseType.join(', ')}
                                    </p>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyManagementSidebar;
