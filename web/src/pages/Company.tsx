import Navigation from '../components/ui/Navigation.tsx';
import PageStatus from '../components/ui/PageStatus.tsx';
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
        driverRatings,
        loading: driversLoading,
        error: driversError,
        selectDriver
    } = useDrivers(selectedCompanyId);

    const loading = companiesLoading || driversLoading;
    const error = companiesError || driversError;

    if (loading) {
        return <PageStatus state="loading" />;
    }

    if (error) {
        return <PageStatus state="error" message={error} />;
    }

    return (
        <>
            <Navigation/>
            <div className="h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 pb-6 overflow-hidden">
                <div className="w-full max-w-full">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                        <p className="text-sm text-gray-600 mt-0.5">Manage companies, drivers and vehicles</p>
                    </div>
                    <div className="flex gap-4 min-w-0 h-[calc(100vh-12rem)]">
                        <CompanyManagementSidebar
                            companies={companies}
                            drivers={drivers}
                            selectedCompanyId={selectedCompanyId}
                            selectedDriverId={selectedDriverId}
                            onSelectCompany={selectCompany}
                            onSelectDriver={selectDriver}
                        />
                        <CompanyManagementContent
                            selectedCompany={selectedCompany}
                            selectedDriver={selectedDriver}
                            driverVehicles={driverVehicles}
                            driverRatings={driverRatings}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Company;