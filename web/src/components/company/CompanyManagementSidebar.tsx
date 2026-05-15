interface CompanyManagementSidebarProps {
    companies: any[];
    drivers: any[];
    selectedCompanyId: string | null;
    selectedDriverId: string | null;
    onSelectCompany: (companyId: string) => void;
    onSelectDriver: (driverId: string) => void;
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
        <div className="flex flex-col gap-3 w-64">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Companies</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {companies.length}
                    </span>
                </div>
                <div className="flex-1 space-y-2 mb-3 overflow-y-auto max-h-64 scrollbar-hide">
                    {companies.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">No companies yet</p>
                    ) : (
                        companies.map((company) => (
                            <div
                                key={company.id}
                                onClick={() => onSelectCompany(company.id)}
                                className={`px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
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
                            </div>
                        ))
                    )}
                </div>
                <button
                    onClick={onAddCompany}
                    className="w-full px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
                >
                    + Add Company
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Drivers</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {drivers.length}
                    </span>
                </div>
                <div className="flex-1 space-y-2 mb-3 overflow-y-auto max-h-64 scrollbar-hide">
                    {drivers.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                            {selectedCompanyId ? 'No drivers in this company' : 'Select a company'}
                        </p>
                    ) : (
                        drivers.map((driver) => (
                            <div
                                key={driver.id}
                                onClick={() => onSelectDriver(driver.id)}
                                className={`px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedDriverId === driver.id
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                <p className="font-semibold text-sm">
                                    {driver.firstName} {driver.lastName}
                                </p>
                                {driver.licenseNumber && (
                                    <p className={`text-xs mt-0.5 ${selectedDriverId === driver.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                        License: {driver.licenseNumber}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <button
                    onClick={onAddDriver}
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
                >
                    + Add Driver
                </button>
            </div>
        </div>
    );
};

export default CompanyManagementSidebar;
