import CompanyInfo from './CompanyInfo';
import type { Company } from './CompanyInfo';
import DriverInfo from './DriverInfo';
import type { Driver } from './DriverInfo';
import VehicleInfo from './VehicleInfo';
import type { Vehicle } from './VehicleInfo';

interface CompanyManagementContentProps {
    selectedCompany: Company | null;
    selectedDriver: Driver | null;
    driverVehicles: Vehicle[];
}

const CompanyManagementContent = ({selectedCompany, selectedDriver, driverVehicles}: CompanyManagementContentProps) => {
    return (
        <div className="flex-1 flex gap-4 items-start min-w-0">
            <div className="flex-1 flex flex-col gap-4">
                <CompanyInfo company={selectedCompany}/>
                <DriverInfo driver={selectedDriver}/>
            </div>
            <VehicleInfo vehicles={driverVehicles} layout="sidebar" />
        </div>
    );
};

export default CompanyManagementContent;
