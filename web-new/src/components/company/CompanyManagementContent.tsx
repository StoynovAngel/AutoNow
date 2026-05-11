import CompanyInfo from './CompanyInfo';
import DriverInfo from './DriverInfo';
import VehicleInfo from './VehicleInfo';

interface CompanyManagementContentProps {
    selectedCompany: any;
    selectedDriver: any;
    driverVehicles: any[];
}

const CompanyManagementContent = ({selectedCompany, selectedDriver, driverVehicles}: CompanyManagementContentProps) => {
    return (
        <div className="flex-1 flex gap-4">
            <div className="flex-1 flex flex-col gap-4">
                <CompanyInfo company={selectedCompany}/>
                <DriverInfo driver={selectedDriver}/>
            </div>
            <VehicleInfo vehicles={driverVehicles} />
        </div>
    );
};

export default CompanyManagementContent;
