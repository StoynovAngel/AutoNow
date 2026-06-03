import profilePicture from '../../assets/profile-picture.png';

export interface Driver {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    expertiseType: string[];
    available: boolean;
    imageUrl?: string;
    companyId: number;
    vehicleIds: number[];
}

interface DriverInfoProps {
    driver: Driver | null;
}

const DriverInfo = ({driver}: DriverInfoProps) => {
    if (!driver) {
        return (
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-1 min-h-0 flex flex-col">
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <img src={profilePicture} alt="No driver selected" className="w-16 h-16 rounded-full border-2 border-gray-200 mb-3 object-cover opacity-40" />
                    <p className="text-gray-500 text-sm font-semibold">Select a driver to view details</p>
                    <p className="text-gray-400 text-xs mt-1">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Driver Information</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    driver.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                    {driver.available ? '✓ Available' : '✗ Unavailable'}
                </span>
            </div>
            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 grid grid-cols-2 gap-3 content-start min-w-0">
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                        <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 truncate">
                            {driver.firstName} {driver.lastName}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                            <svg className="w-3 h-3 text-gray-400 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{driver.phoneNumber}</span>
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Company ID</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            #{driver.companyId}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Assigned Vehicles</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            {driver.vehicleIds.length} vehicle{driver.vehicleIds.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">License Types</label>
                        <div className="flex flex-wrap gap-1.5">
                            {driver.expertiseType.map(t => (
                                <span key={t} className="text-xs text-gray-900 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 inline-block font-mono">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-start">
                    <img
                        src={driver.imageUrl ?? profilePicture}
                        alt={`${driver.firstName} ${driver.lastName}`}
                        className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-md object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default DriverInfo;
