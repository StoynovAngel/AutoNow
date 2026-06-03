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
            <div className={`bg-white rounded-xl shadow-md p-4 border border-gray-100 ${layout === 'sidebar' ? 'w-72 h-64' : 'w-full'}`}>
                <div className="flex flex-col items-center justify-center h-full text-center">
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
        <div className={layout === 'sidebar' ? 'w-72 flex-shrink-0' : 'w-full'}>
            <div className={layout === 'sidebar' ? 'flex flex-col gap-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1' : 'grid grid-cols-3 gap-4'}>
                {vehicles.map((vehicle, index) => (
                    <div
                        key={vehicle.id}
                        className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-lg shadow-lg overflow-hidden"
                    >
                        {vehicle.imageUrl && (
                            <div className={`w-full overflow-hidden bg-white/10 ${layout === 'sidebar' ? 'h-32' : 'h-48'}`}>
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

                        <div className="p-3">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-1.5">
                                        <span className="text-green-100 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                                            #{index + 1}
                                        </span>
                                        <span className="text-green-100 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                                            {vehicle.vehicleType}
                                        </span>
                                    </div>
                                    <p className="font-bold text-lg mb-0.5">{vehicle.brand}</p>
                                    <p className="text-sm text-green-50">{vehicle.model}</p>
                                    <p className="text-xs font-mono mt-1 inline-block bg-white/25 text-white px-2 py-0.5 rounded">
                                        {vehicle.licensePlate}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg">
                                    <div className="flex items-center mb-0.5">
                                        <svg className="w-3 h-3 mr-1 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-xs text-green-100 font-semibold">SEATS</span>
                                    </div>
                                    <p className="text-sm font-bold">{vehicle.numberOfSeats}</p>
                                </div>

                                <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg">
                                    <div className="flex items-center mb-0.5">
                                        <svg className="w-3 h-3 mr-1 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span className="text-xs text-green-100 font-semibold">TRUNK</span>
                                    </div>
                                    <p className="text-sm font-bold">{vehicle.trunkCapacity ? `${vehicle.trunkCapacity}L` : '—'}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between bg-white/15 backdrop-blur-sm p-2 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-3.5 h-3.5 mr-1.5 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-semibold text-xs">Air Conditioning</span>
                                    </div>
                                    {vehicle.airConditioning ? (
                                        <span className="bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-bold">YES</span>
                                    ) : (
                                        <span className="bg-red-500/30 text-white px-2 py-0.5 rounded-full text-xs font-bold">NO</span>
                                    )}
                                </div>

                                {vehicle.companyId && (
                                    <div className="flex items-center bg-white/15 backdrop-blur-sm p-2 rounded-lg">
                                        <svg className="w-3.5 h-3.5 mr-1.5 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-semibold text-xs">Company ID: {vehicle.companyId}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 pt-2 border-t border-white/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-green-100 font-semibold">VEHICLE ID #{vehicle.id}</span>
                                    <div className="flex gap-1.5">
                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(vehicle)}
                                                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
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
                                                className="bg-red-500/40 hover:bg-red-500/60 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
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
