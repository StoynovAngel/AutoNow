export interface Vehicle {
    id: number;
    brand: string;
    model: string;
    licensePlate: string;
    imageUrl?: string;
    airConditioning: boolean;
    numberOfSeats: number;
    trunkCapacity: number;
    vehicleType: string;
    companyId: number;
}

interface VehicleInfoProps {
    vehicles: Vehicle[];
    onEdit?: (vehicle: Vehicle) => void;
    onDelete?: (id: number) => void;
    layout?: 'sidebar' | 'grid';
}

const VehicleInfo = ({vehicles, onEdit, onDelete, layout = 'grid'}: VehicleInfoProps) => {
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className={`bg-white rounded-xl shadow-md p-4 border border-gray-100 ${layout === 'sidebar' ? 'w-72 h-full flex flex-col' : 'w-full'}`}>
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2a1 1 0 001-1m0 0h2a1 1 0 001-1v-3a1 1 0 00-.293-.707l-2-2A1 1 0 0014 11h-2.5a.5.5 0 01-.5-.5V6" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">No vehicles assigned</p>
                    <p className="text-gray-400 text-xs mt-1">Select a driver with vehicles</p>
                </div>
            </div>
        );
    }

    return (
        <div className={layout === 'sidebar' ? 'w-72 flex-shrink-0 h-full' : 'w-full'}>
            <div className={layout === 'sidebar' ? 'flex flex-col gap-2 h-full overflow-y-auto pr-1' : 'grid grid-cols-3 gap-4'}>
                {vehicles.map((vehicle, index) => (
                    <div
                        key={vehicle.id}
                        className={`flex flex-col bg-white border border-gray-200 text-gray-900 rounded-lg shadow-sm overflow-hidden ${layout === 'sidebar' ? 'flex-shrink-0 h-[calc(50%-0.25rem)]' : 'h-full'}`}
                    >
                        {vehicle.imageUrl && (
                            <div className={`w-full overflow-hidden bg-gray-100 flex-shrink-0 ${layout === 'sidebar' ? 'h-42' : 'h-42'}`}>
                                <img
                                    src={vehicle.imageUrl}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        <div className="p-3 flex flex-col flex-1 min-h-0 overflow-hidden">
                            <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                        <span className="text-brand-700 text-xs font-bold bg-brand-100 px-2.5 py-1 rounded-full">
                                            #{index + 1}
                                        </span>
                                        <span className="text-brand-700 text-xs font-bold bg-brand-100 px-2.5 py-1 rounded-full">
                                            {vehicle.vehicleType}
                                        </span>
                                    </div>
                                    <p className="font-bold text-lg mb-0.5 text-gray-900">{vehicle.brand} - {vehicle.model}</p>
                                </div>
                                <p className="text-xs font-mono inline-block bg-gray-100 text-gray-900 border border-gray-200 px-2 py-0.5 rounded flex-shrink-0">
                                    {vehicle.licensePlate}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                                    <div className="flex items-center mb-0.5">
                                        <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-xs text-gray-500 font-semibold">SEATS</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">{vehicle.numberOfSeats}</p>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                                    <div className="flex items-center mb-0.5">
                                        <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span className="text-xs text-gray-500 font-semibold">TRUNK</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">{vehicle.trunkCapacity ? `${vehicle.trunkCapacity}L` : '—'}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-semibold text-xs text-gray-700">Air Conditioning</span>
                                    </div>
                                    {vehicle.airConditioning ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">YES</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">NO</span>
                                    )}
                                </div>

                                {vehicle.companyId && (
                                    <div className="flex items-center bg-gray-50 border border-gray-200 p-2 rounded-lg">
                                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-semibold text-xs text-gray-700">Company ID: {vehicle.companyId}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-semibold">VEHICLE ID #{vehicle.id}</span>
                                    <div className="flex gap-1.5">
                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(vehicle)}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(vehicle.id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VehicleInfo;
