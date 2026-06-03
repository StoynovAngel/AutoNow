import { useState } from 'react';
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
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
        <Modal show onClose={onClose} size="lg" dismissible>
            <ModalHeader>
                Assign Vehicles — {driver.firstName} {driver.lastName}
            </ModalHeader>
            <ModalBody>
                {error && (
                    <Alert color="failure" aria-live="assertive" className="mb-3">
                        {error}
                    </Alert>
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
                                        {vehicle.imageUrl && (
                                            <img src={vehicle.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                                            <p className="text-xs text-gray-500">{vehicle.vehicleType} · {vehicle.numberOfSeats} seats</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="xs"
                                        color={assigned ? 'failure' : 'purple'}
                                        disabled={isLoading}
                                        onClick={() => handle(vehicle.id, assigned)}
                                    >
                                        {isLoading ? '...' : assigned ? 'Unassign' : 'Assign'}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="gray" onClick={onClose} className="w-full">
                    Done
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AssignVehicleModal;
