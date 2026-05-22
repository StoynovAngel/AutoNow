import { useState } from 'react';
import type { Vehicle } from '../company/VehicleInfo';
import type { Driver } from '../company/DriverInfo';

interface AssignVehicleModalProps {
    driver: Driver;
    allVehicles: Vehicle[];
    onAssign: (vehicleId: number) => Promise<void>;
    onUnassign: (vehicleId: number) => Promise<void>;
    onClose: () => void;
}

const AssignVehicleModal = ({ driver, allVehicles, onAssign, onUnassign, onClose }: AssignVehicleModalProps) => {
    const [loading, setLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const assignedIds = new Set(driver.vehicleIds);

    const handle = async (vehicleId: number, assigned: boolean) => {
        setLoading(vehicleId);
        setError(null);
        try {
            if (assigned) {
                await onUnassign(vehicleId);
            } else {
                await onAssign(vehicleId);
            }
        } catch {
            setError('Operation failed. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        Assign Vehicles — {driver.firstName} {driver.lastName}
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div role="alert" className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                {allVehicles.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No vehicles available.</p>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {allVehicles.map(vehicle => {
                            const assigned = assignedIds.has(vehicle.id);
                            const isLoading = loading === vehicle.id;
                            return (
                                <div key={vehicle.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                                    <div className="flex items-center gap-3">
                                        {vehicle.imageURL && (
                                            <img src={vehicle.imageURL} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                                            <p className="text-xs text-gray-500">{vehicle.vehicleType} · {vehicle.numberOfSeats} seats</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => handle(vehicle.id, assigned)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                                            assigned
                                                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                                : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                                        }`}
                                    >
                                        {isLoading ? '...' : assigned ? 'Unassign' : 'Assign'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default AssignVehicleModal;
