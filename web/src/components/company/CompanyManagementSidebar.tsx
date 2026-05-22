import type { Company } from './CompanyInfo';
import type { Driver } from './DriverInfo';

interface CompanyManagementSidebarProps {
    companies: Company[];
    drivers: Driver[];
    selectedCompanyId: number | null;
    selectedDriverId: number | null;
    onSelectCompany: (companyId: number) => void;
    onSelectDriver: (driverId: number) => void;
    onAddCompany: () => void;
    onAddDriver: () => void;
}

const CompanyManagementSidebar = ({
    companies,
    drivers,
    selectedCompanyId,
    selectedDriverId,
    onSelectCompany,
    onSelectDriver,
    onAddCompany,
    onAddDriver
}: CompanyManagementSidebarProps) => {
    return (
        <div className="flex flex-col gap-3 w-72 sticky top-24 max-h-[calc(100vh-7rem)]">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100 min-h-0 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Companies</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {companies.length}
                    </span>
                </div>
                <div className="flex-1 space-y-2 mb-3 overflow-y-auto min-h-0">
                    {companies.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">No companies yet</p>
                    ) : (
                        companies.map((company) => (
                            <button
                                key={company.id}
                                type="button"
                                onClick={() => onSelectCompany(company.id)}
                                aria-pressed={selectedCompanyId === company.id}
                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedCompanyId === company.id
                                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                <p className="font-semibold text-sm">{company.name}</p>
                                {company.companyType && (
                                    <p className={`text-xs mt-0.5 ${selectedCompanyId === company.id ? 'text-violet-100' : 'text-gray-500'}`}>
                                        {company.companyType}
                                    </p>
                                )}
                            </button>
                        ))
                    )}
                </div>
                <button
                    onClick={onAddCompany}
                    className="w-full px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg flex-shrink-0"
                >
                    + Add Company
                </button>
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
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                <p className="font-semibold text-sm">
                                    {driver.firstName} {driver.lastName}
                                </p>
                                {driver.expertiseType && (
                                    <p className={`text-xs mt-0.5 ${selectedDriverId === driver.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                        License: {driver.expertiseType}
                                    </p>
                                )}
                            </button>
                        ))
                    )}
                </div>
                <button
                    onClick={onAddDriver}
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg flex-shrink-0"
                >
                    + Add Driver
                </button>
            </div>
        </div>
    );
};

export default CompanyManagementSidebar;
