import { useMemo, useState } from 'react';
import { Alert, Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select } from 'flowbite-react';
import type { Driver } from '../company/DriverInfo';
import type { Order } from './OrderInfo';

interface AssignOrderModalProps {
    order: Order;
    drivers: Driver[];
    onAssign: (driverId: number, vehicleId: number) => Promise<void>;
    onClose: () => void;
}

const AssignOrderModal = ({ order, drivers, onAssign, onClose }: AssignOrderModalProps) => {
    const [driverId, setDriverId] = useState<number | null>(order.driverId ?? null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const eligibleDrivers = useMemo(() => {
        return drivers.filter((d) => d.available && d.preferredVehicleId != null);
    }, [drivers]);

    const selectedDriver = useMemo(
        () => eligibleDrivers.find((d) => d.id === driverId) ?? null,
        [eligibleDrivers, driverId],
    );

    const canSubmit = selectedDriver !== null && selectedDriver.preferredVehicleId != null && !submitting;

    const handleDriverChange = (value: string) => {
        setDriverId(value ? Number(value) : null);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!selectedDriver || selectedDriver.preferredVehicleId == null) return;
        setSubmitting(true);
        setError(null);
        try {
            await onAssign(selectedDriver.id, selectedDriver.preferredVehicleId);
            onClose();
        } catch {
            setError('Assignment failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isReassign = order.status !== 'CREATED' && order.driverId != null;

    return (
        <Modal show onClose={onClose} size="lg" dismissible>
            <ModalHeader>
                {isReassign ? 'Reassign Order' : 'Assign Order'} — #{order.id}
            </ModalHeader>
            <ModalBody>
                {error && (
                    <Alert color="failure" aria-live="assertive" className="mb-3">
                        {error}
                    </Alert>
                )}

                <div className="space-y-4">
                    <div>
                        <Label htmlFor={`assign-driver-${order.id}`} className="mb-1 block">
                            Driver ({order.vehicleType})
                        </Label>
                        <Select
                            id={`assign-driver-${order.id}`}
                            value={driverId ?? ''}
                            onChange={(e) => handleDriverChange(e.target.value)}
                            disabled={eligibleDrivers.length === 0}
                        >
                            <option value="">
                                {eligibleDrivers.length === 0
                                    ? 'No available drivers with a vehicle'
                                    : 'Select a driver'}
                            </option>
                            {eligibleDrivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.firstName} {d.lastName} · {d.phoneNumber}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {selectedDriver && (
                        <p className="text-sm text-gray-500">
                            Vehicle ID #{selectedDriver.preferredVehicleId} will be used.
                        </p>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="gray" onClick={onClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button color="blue" onClick={handleSubmit} disabled={!canSubmit}>
                    {submitting ? 'Assigning...' : isReassign ? 'Reassign' : 'Assign'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AssignOrderModal;
