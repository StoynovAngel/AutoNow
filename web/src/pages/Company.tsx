import { useState } from 'react';
import Navigation from '../components/ui/Navigation.tsx';
import PageStatus from '../components/ui/PageStatus.tsx';
import CompanyManagementSidebar from '../components/company/CompanyManagementSidebar';
import CompanyManagementContent from '../components/company/CompanyManagementContent';
import AddCompanyModal from '../components/company/AddCompanyModal';
import EditCompanyModal from '../components/company/EditCompanyModal';
import EditPricingModal from '../components/company/EditPricingModal';
import {useCompanies} from '../hooks/useCompanies';
import {useDrivers} from '../hooks/useDrivers';
import {useCompanyPricing} from '../hooks/useCompanyPricing';
import {useAuth} from '../contexts/AuthContext';

const Company = () => {
    const {user} = useAuth();
    const authorities = user?.authorities ?? [];
    const isAdmin = authorities.includes('ROLE_ADMIN');
    const isCompanyAdmin = authorities.includes('ROLE_COMPANY_ADMIN');
    const isCustomer = authorities.includes('ROLE_CUSTOMER');
    const canCreateCompany = isAdmin || isCompanyAdmin || isCustomer;

    const {
        companies,
        selectedCompanyId,
        selectedCompany,
        loading: companiesLoading,
        error: companiesError,
        selectCompany,
        createCompany,
        updateCompany,
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

    const { pricing, savePricing, supported: pricingSupported } = useCompanyPricing(selectedCompanyId, selectedCompany?.companyType);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditPricingModal, setShowEditPricingModal] = useState(false);

    const canEditSelectedCompany =
        !!selectedCompany &&
        (isAdmin || (isCompanyAdmin && user?.companyId === selectedCompany.id));

    const canEditPricing = canEditSelectedCompany && pricingSupported;

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
                <div className="w-full max-w-full overflow-x-hidden">
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
                            canCreateCompany={canCreateCompany}
                            onAddCompany={() => setShowAddModal(true)}
                        />
                        <CompanyManagementContent
                            selectedCompany={selectedCompany}
                            selectedDriver={selectedDriver}
                            driverVehicles={driverVehicles}
                            driverRatings={driverRatings}
                            pricing={pricing}
                            canEditCompany={canEditSelectedCompany}
                            onEditCompany={() => setShowEditModal(true)}
                            canEditPricing={canEditPricing}
                            onEditPricing={() => setShowEditPricingModal(true)}
                        />
                    </div>
                </div>
            </div>

            <AddCompanyModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={async (payload) => { await createCompany(payload); }}
            />

            {selectedCompany && (
                <EditCompanyModal
                    show={showEditModal}
                    company={selectedCompany}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={async (payload) => { await updateCompany(selectedCompany.id, payload); }}
                />
            )}

            {selectedCompany && pricingSupported && (
                <EditPricingModal
                    show={showEditPricingModal}
                    pricing={pricing}
                    companyType={selectedCompany.companyType}
                    onClose={() => setShowEditPricingModal(false)}
                    onSubmit={async (payload) => { await savePricing(selectedCompany.id, payload); }}
                />
            )}
        </>
    );
}

export default Company;