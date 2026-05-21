export interface Driver {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    licenseNumber: string;
    expertiseType: string;
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
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Select a driver to view details</p>
                    <p className="text-gray-400 text-xs mt-1">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100 relative">
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
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                    <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {driver.firstName} {driver.lastName}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {driver.phoneNumber}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">License Number</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {driver.licenseNumber}
                    </p>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">License Type</label>
                    <p className="text-sm text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 inline-block font-mono">
                        {driver.expertiseType}
                    </p>
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                {driver.imageUrl ? (
                    <img
                        src={driver.imageUrl}
                        alt={`${driver.firstName} ${driver.lastName}`}
                        className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-md object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverInfo;
