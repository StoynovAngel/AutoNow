import Navigation from '../components/Navigation';
import CompanyManagementSidebar from '../components/company/CompanyManagementSidebar';
import CompanyManagementContent from '../components/company/CompanyManagementContent';
import {useCompanies} from '../hooks/useCompanies';
import {useDrivers} from '../hooks/useDrivers';

const Company = () => {
    const {
        companies,
        selectedCompanyId,
        selectedCompany,
        loading: companiesLoading,
        error: companiesError,
        selectCompany
    } = useCompanies();

    const {
        drivers,
        selectedDriverId,
        selectedDriver,
        driverVehicles,
        loading: driversLoading,
        error: driversError,
        selectDriver
    } = useDrivers(selectedCompanyId);

    const handleAddCompany = () => {
        // TODO: Implement add company modal
        console.log('Add new company');
    };

    const handleAddDriver = () => {
        // TODO: Implement add driver modal
        console.log('Add new driver');
    };

    const loading = companiesLoading || driversLoading;
    const error = companiesError || driversError;

    if (loading) {
        return (
            <>
                <Navigation/>
                <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation/>
                <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navigation/>
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 pb-6">
                <div className="max-w-400 mx-auto">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                        <p className="text-sm text-gray-600 mt-0.5">Manage companies, drivers, and vehicles</p>
                    </div>
                    <div className="flex gap-4">
                        <CompanyManagementSidebar
                            companies={companies}
                            drivers={drivers}
                            selectedCompanyId={selectedCompanyId}
                            selectedDriverId={selectedDriverId}
                            onSelectCompany={selectCompany}
                            onSelectDriver={selectDriver}
                            onAddCompany={handleAddCompany}
                            onAddDriver={handleAddDriver}
                        />
                        <CompanyManagementContent
                            selectedCompany={selectedCompany}
                            selectedDriver={selectedDriver}
                            driverVehicles={driverVehicles}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Company;