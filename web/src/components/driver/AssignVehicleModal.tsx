import { useState } from 'react';
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import type { Vehicle } from '../company/VehicleInfo';
import type { Driver } from '../company/DriverInfo';

interface AssignVehicleModalProps {
    driver: Driver;
    allVehicles: Vehicle[];
    onSetPreferred: (vehicleId: number) => Promise<void>;
    onClearPreferred: () => Promise<void>;
    onClose: () => void;
}

const AssignVehicleModal = ({ driver, allVehicles, onSetPreferred, onClearPreferred, onClose }: AssignVehicleModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSet = async (vehicleId: number) => {
        setLoading(true);
        setError(null);
        try {
            await onSetPreferred(vehicleId);
        } catch {
            setError('Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setLoading(true);
        setError(null);
        try {
            await onClearPreferred();
        } catch {
            setError('Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const eligibleVehicles = allVehicles.filter(v => v.vehicleType !== 'RENTAL');

    return (
        <Modal show onClose={onClose} size="lg" dismissible>
            <ModalHeader>
                Preferred Vehicle - {driver.firstName} {driver.lastName}
            </ModalHeader>
            <ModalBody>
                {error && (
                    <Alert color="failure" role="alert" aria-live="assertive" className="mb-3">
                        {error}
                    </Alert>
                )}

                {eligibleVehicles.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No vehicles available.</p>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {eligibleVehicles.map(vehicle => {
                            const isPreferred = driver.preferredVehicleId === vehicle.id;
                            return (
                                <div
                                    key={vehicle.id}
                                    className={`flex items-center justify-between border rounded-lg px-3 py-2.5 ${
                                        isPreferred
                                            ? 'bg-blue-50 border-blue-300'
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {vehicle.imageUrl && (
                                            <img src={vehicle.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                                            <p className="text-xs text-gray-500">{vehicle.vehicleType} · {vehicle.numberOfSeats} seats</p>
                                        </div>
                                        {isPreferred && (
                                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                                Preferred
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        size="xs"
                                        color={isPreferred ? 'failure' : 'default'}
                                        disabled={loading}
                                        aria-pressed={isPreferred}
                                        onClick={() => isPreferred ? handleClear() : handleSet(vehicle.id)}
                                    >
                                        {isPreferred ? 'Remove' : 'Set preferred'}
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
