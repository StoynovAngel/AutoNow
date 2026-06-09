import CompanyInfo from './CompanyInfo';
import type { Company } from './CompanyInfo';
import DriverInfo from './DriverInfo';
import type { Driver } from './DriverInfo';
import DriverRatingsInfo from './DriverRatingsInfo';
import type { Rating } from '../../services/rating/ratingService';
import VehicleInfo from './VehicleInfo';
import type { Vehicle } from './VehicleInfo';

interface CompanyManagementContentProps {
    selectedCompany: Company | null;
    selectedDriver: Driver | null;
    driverVehicles: Vehicle[];
    driverRatings: Rating[];
    canEditCompany?: boolean;
    onEditCompany?: () => void;
}

const CompanyManagementContent = ({selectedCompany, selectedDriver, driverVehicles, driverRatings, canEditCompany, onEditCompany}: CompanyManagementContentProps) => {
    return (
        <div className="flex-1 flex gap-4 items-stretch min-w-0 h-full">
            <div className="flex-1 flex min-h-0 min-w-0">
                <CompanyInfo company={selectedCompany} canEdit={canEditCompany} onEdit={onEditCompany}/>
            </div>
            <div className="flex-1 flex flex-col gap-4 min-h-0 min-w-0">
                <div className="flex-1 flex min-h-0">
                    <DriverInfo driver={selectedDriver}/>
                </div>
                <div className="flex-1 flex min-h-0">
                    <DriverRatingsInfo ratings={driverRatings} hasDriver={!!selectedDriver}/>
                </div>
            </div>
            <VehicleInfo vehicles={driverVehicles} layout="sidebar"/>
        </div>
    );
};

export default CompanyManagementContent;
